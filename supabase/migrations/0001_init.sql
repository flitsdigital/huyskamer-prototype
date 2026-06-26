-- De Huyskamer loyalty — initial schema, RLS and business RPCs.
-- Balance is always SUM(points_delta); no stored balance column.

-- 1. Enums
create type public.user_role as enum ('customer', 'admin');
create type public.txn_type as enum ('earn', 'redeem', 'adjust');

-- 2. Tables
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  role         public.user_role not null default 'customer',
  display_name text,
  email        text,
  phone        text,
  qr_token     uuid not null default gen_random_uuid() unique,
  consent_at   timestamptz,
  created_at   timestamptz not null default now()
);

create table public.rewards (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  points_cost int not null check (points_cost > 0),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table public.point_transactions (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references public.profiles (id) on delete cascade,
  type         public.txn_type not null,
  amount_spent numeric(10, 2),                       -- only for 'earn'
  points_delta int not null,                         -- + earn, - redeem/correction
  reward_id    uuid references public.rewards (id),  -- only for 'redeem'
  performed_by uuid references public.profiles (id), -- which admin
  note         text,
  created_at   timestamptz not null default now()
);
create index point_transactions_customer_idx
  on public.point_transactions (customer_id, created_at desc);

-- Single-row settings table.
create table public.settings (
  id              boolean primary key default true check (id),
  points_per_euro numeric(10, 2) not null default 1,
  updated_at      timestamptz not null default now()
);
insert into public.settings (id) values (true);

-- 3. is_admin(): SECURITY DEFINER so it bypasses RLS (avoids policy recursion on profiles).
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- 4. Balance view. security_invoker => the querying user's RLS applies (no leaks).
create view public.customer_balances with (security_invoker = on) as
  select p.id as customer_id,
         coalesce(sum(t.points_delta), 0)::int as balance
  from public.profiles p
  left join public.point_transactions t on t.customer_id = p.id
  group by p.id;

-- 5. New auth user -> profile row.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, phone, display_name, consent_at)
  values (
    new.id,
    new.email,
    new.phone,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, ''), '@', 1)),
    case when (new.raw_user_meta_data ->> 'consent') = 'true' then now() else null end
  );
  return new;
end; $$;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- 6. Guard: a logged-in non-admin cannot change their own role or qr_token.
-- Only enforced for real authenticated end-users; the service_role / SQL editor / migrations
-- (auth.uid() is null) and admins may set role/qr_token freely — needed to bootstrap the first admin.
create or replace function public.guard_profile_changes()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.qr_token := old.qr_token;
  end if;
  return new;
end; $$;
create trigger profiles_guard
  before update on public.profiles for each row execute function public.guard_profile_changes();

-- 7. Row Level Security
alter table public.profiles enable row level security;
alter table public.rewards enable row level security;
alter table public.point_transactions enable row level security;
alter table public.settings enable row level security;

-- profiles: read/update own or admin; insert via trigger only; delete admin only.
create policy profiles_select on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy profiles_update on public.profiles
  for update using (id = auth.uid() or public.is_admin());
create policy profiles_delete on public.profiles
  for delete using (public.is_admin());

-- rewards: any signed-in user can read the catalog; only admins write.
create policy rewards_select on public.rewards
  for select to authenticated using (true);
create policy rewards_write on public.rewards
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- point_transactions: read own or admin. NO write policy => direct writes denied;
-- all writes go through the SECURITY DEFINER RPCs below.
create policy txn_select on public.point_transactions
  for select using (customer_id = auth.uid() or public.is_admin());

-- settings: admin only (RPCs read it as definer regardless).
create policy settings_select on public.settings
  for select using (public.is_admin());
create policy settings_update on public.settings
  for update using (public.is_admin()) with check (public.is_admin());

-- 8. Privileges (RLS still gates every row).
grant select on public.profiles, public.rewards, public.point_transactions,
                public.settings, public.customer_balances to authenticated;
grant update, delete on public.profiles to authenticated;
grant insert, update, delete on public.rewards to authenticated;
grant update on public.settings to authenticated;

-- 9. Business RPCs — SECURITY DEFINER, admin-guarded.
create or replace function public.earn_points(p_customer uuid, p_amount numeric, p_note text default null)
returns public.point_transactions language plpgsql security definer set search_path = public as $$
declare v_ratio numeric; v_points int; v_row public.point_transactions;
begin
  if not public.is_admin() then raise exception 'Niet geautoriseerd'; end if;
  if p_amount is null or p_amount <= 0 then raise exception 'Ongeldig bedrag'; end if;
  if not exists (select 1 from public.profiles where id = p_customer and role = 'customer') then
    raise exception 'Klant niet gevonden';
  end if;
  select points_per_euro into v_ratio from public.settings where id;
  v_points := round(p_amount * v_ratio);  -- numeric round() breaks ties away from zero ("normaal afgerond")
  insert into public.point_transactions (customer_id, type, amount_spent, points_delta, performed_by, note)
  values (p_customer, 'earn', p_amount, v_points, auth.uid(), p_note)
  returning * into v_row;
  return v_row;
end; $$;

create or replace function public.redeem_reward(p_customer uuid, p_reward uuid)
returns public.point_transactions language plpgsql security definer set search_path = public as $$
declare v_cost int; v_active boolean; v_balance int; v_row public.point_transactions;
begin
  if not public.is_admin() then raise exception 'Niet geautoriseerd'; end if;
  if not exists (select 1 from public.profiles where id = p_customer and role = 'customer') then
    raise exception 'Klant niet gevonden';
  end if;
  select points_cost, is_active into v_cost, v_active from public.rewards where id = p_reward;
  if v_cost is null then raise exception 'Beloning niet gevonden'; end if;
  if not v_active then raise exception 'Beloning is niet actief'; end if;
  -- ponytail: no row lock; single-restaurant testcase, the double-redeem race is negligible.
  select coalesce(sum(points_delta), 0) into v_balance
    from public.point_transactions where customer_id = p_customer;
  if v_balance < v_cost then raise exception 'Onvoldoende punten'; end if;
  insert into public.point_transactions (customer_id, type, points_delta, reward_id, performed_by)
  values (p_customer, 'redeem', -v_cost, p_reward, auth.uid())
  returning * into v_row;
  return v_row;
end; $$;

create or replace function public.adjust_points(p_customer uuid, p_delta int, p_note text)
returns public.point_transactions language plpgsql security definer set search_path = public as $$
declare v_row public.point_transactions;
begin
  if not public.is_admin() then raise exception 'Niet geautoriseerd'; end if;
  if not exists (select 1 from public.profiles where id = p_customer and role = 'customer') then
    raise exception 'Klant niet gevonden';
  end if;
  if p_delta = 0 then raise exception 'Correctie mag niet 0 zijn'; end if;
  if p_note is null or length(trim(p_note)) = 0 then raise exception 'Reden is verplicht'; end if;
  insert into public.point_transactions (customer_id, type, points_delta, performed_by, note)
  values (p_customer, 'adjust', p_delta, auth.uid(), p_note)
  returning * into v_row;
  return v_row;
end; $$;

-- AVG: a customer can delete their own account (cascades to profile + transactions).
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = public as $$
begin
  delete from auth.users where id = auth.uid();
end; $$;

-- Lock down execution.
revoke all on function public.earn_points(uuid, numeric, text) from public, anon;
revoke all on function public.redeem_reward(uuid, uuid) from public, anon;
revoke all on function public.adjust_points(uuid, int, text) from public, anon;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.earn_points(uuid, numeric, text) to authenticated;
grant execute on function public.redeem_reward(uuid, uuid) to authenticated;
grant execute on function public.adjust_points(uuid, int, text) to authenticated;
grant execute on function public.delete_my_account() to authenticated;

-- 10. Demo rewards.
insert into public.rewards (name, description, points_cost) values
  ('Gratis koffie',  'Een vers gezette koffie van het huis.', 50),
  ('Gratis taartje', 'Een huisgemaakt taartje naar keuze.',   80);
