-- 0002: tiers, welcome/referral/birthday bonuses, points expiry,
-- staff vs owner roles, per-customer redeem lock, extra indexes.
-- Additive & idempotent where practical. Run in the Supabase SQL editor.

-- ============ Roles: owner (eigenaar) vs staff (medewerker) ============
-- role stays customer/admin; an admin is "staff" (may book). is_owner adds management rights.
alter table public.profiles add column if not exists is_owner boolean not null default false;
update public.profiles set is_owner = true where role = 'admin' and is_owner = false;

create or replace function public.is_owner()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and is_owner = true);
$$;
-- is_admin() keeps meaning "any staff member" (role = 'admin').

-- ============ Extra profile fields ============
alter table public.profiles add column if not exists birthdate date;
alter table public.profiles add column if not exists birthday_bonus_year int;
alter table public.profiles add column if not exists referral_code text unique;
alter table public.profiles add column if not exists referred_by uuid references public.profiles(id);
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists locale text not null default 'nl';

update public.profiles
  set referral_code = upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
  where referral_code is null;

-- ============ Settings: bonuses & expiry ============
alter table public.settings add column if not exists welcome_bonus int not null default 25;
alter table public.settings add column if not exists referral_bonus int not null default 50;
alter table public.settings add column if not exists birthday_bonus int not null default 80;
alter table public.settings add column if not exists points_expiry_months int; -- null = never

-- reward image (optional URL) for visual reward cards
alter table public.rewards add column if not exists image_url text;

-- ============ Tiers ============
create table if not exists public.tiers (
  id              serial primary key,
  name            text not null,
  min_points      int not null,            -- lifetime earned to reach this tier
  earn_multiplier numeric(4,2) not null default 1,
  sort            int not null
);
insert into public.tiers (name, min_points, earn_multiplier, sort)
  select * from (values
    ('Brons',  0,    1.00, 1),
    ('Zilver', 500,  1.25, 2),
    ('Goud',   1500, 1.50, 3)
  ) as v(name, min_points, earn_multiplier, sort)
  where not exists (select 1 from public.tiers);

-- lifetime earned points (positive earn deltas only)
create or replace view public.customer_lifetime with (security_invoker = on) as
  select p.id as customer_id,
         coalesce(sum(t.points_delta) filter (where t.type = 'earn'), 0)::int as total_earned
  from public.profiles p
  left join public.point_transactions t on t.customer_id = p.id
  group by p.id;

-- current + next tier per customer
create or replace view public.customer_tiers with (security_invoker = on) as
  select cl.customer_id,
         cl.total_earned,
         tr.id   as tier_id,
         tr.name as tier_name,
         tr.earn_multiplier,
         (select min(min_points) from public.tiers t2 where t2.min_points > cl.total_earned) as next_tier_min,
         (select name from public.tiers t3 where t3.min_points > cl.total_earned order by t3.min_points limit 1) as next_tier_name
  from public.customer_lifetime cl
  left join lateral (
    select * from public.tiers t
    where t.min_points <= cl.total_earned
    order by t.min_points desc limit 1
  ) tr on true;

grant select on public.tiers, public.customer_lifetime, public.customer_tiers to authenticated;

-- ============ earn_points: apply the customer's tier multiplier ============
create or replace function public.earn_points(p_customer uuid, p_amount numeric, p_note text default null)
returns public.point_transactions language plpgsql security definer set search_path = public as $$
declare v_ratio numeric; v_mult numeric; v_points int; v_row public.point_transactions;
begin
  if not public.is_admin() then raise exception 'Niet geautoriseerd'; end if;
  if p_amount is null or p_amount <= 0 then raise exception 'Ongeldig bedrag'; end if;
  if not exists (select 1 from public.profiles where id = p_customer and role = 'customer') then
    raise exception 'Klant niet gevonden';
  end if;
  select points_per_euro into v_ratio from public.settings where id;
  select coalesce(earn_multiplier, 1) into v_mult from public.customer_tiers where customer_id = p_customer;
  v_points := round(p_amount * v_ratio * coalesce(v_mult, 1));
  insert into public.point_transactions (customer_id, type, amount_spent, points_delta, performed_by, note)
  values (p_customer, 'earn', p_amount, v_points, auth.uid(), p_note)
  returning * into v_row;
  return v_row;
end; $$;

-- ============ redeem_reward: per-customer advisory lock prevents double-spend ============
create or replace function public.redeem_reward(p_customer uuid, p_reward uuid)
returns public.point_transactions language plpgsql security definer set search_path = public as $$
declare v_cost int; v_active boolean; v_balance int; v_row public.point_transactions;
begin
  if not public.is_admin() then raise exception 'Niet geautoriseerd'; end if;
  if not exists (select 1 from public.profiles where id = p_customer and role = 'customer') then
    raise exception 'Klant niet gevonden';
  end if;
  perform pg_advisory_xact_lock(hashtext(p_customer::text));  -- serialise redeems per customer
  select points_cost, is_active into v_cost, v_active from public.rewards where id = p_reward;
  if v_cost is null then raise exception 'Beloning niet gevonden'; end if;
  if not v_active then raise exception 'Beloning is niet actief'; end if;
  select coalesce(sum(points_delta), 0) into v_balance from public.point_transactions where customer_id = p_customer;
  if v_balance < v_cost then raise exception 'Onvoldoende punten'; end if;
  insert into public.point_transactions (customer_id, type, points_delta, reward_id, performed_by)
  values (p_customer, 'redeem', -v_cost, p_reward, auth.uid())
  returning * into v_row;
  return v_row;
end; $$;

-- ============ Management is owner-only (rewards, settings, tiers) ============
drop policy if exists rewards_write on public.rewards;
create policy rewards_write on public.rewards
  for all to authenticated using (public.is_owner()) with check (public.is_owner());

drop policy if exists settings_select on public.settings;
create policy settings_select on public.settings for select using (public.is_admin());
drop policy if exists settings_update on public.settings;
create policy settings_update on public.settings for update using (public.is_owner()) with check (public.is_owner());

alter table public.tiers enable row level security;
drop policy if exists tiers_select on public.tiers;
create policy tiers_select on public.tiers for select to authenticated using (true);
drop policy if exists tiers_write on public.tiers;
create policy tiers_write on public.tiers for all to authenticated using (public.is_owner()) with check (public.is_owner());
grant update, insert, delete on public.tiers to authenticated;

-- ============ Owner-only: set a profile's role/owner flag via RPC ============
create or replace function public.set_staff_role(p_user uuid, p_role public.user_role, p_is_owner boolean default false)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_owner() then raise exception 'Alleen de eigenaar mag rollen wijzigen'; end if;
  update public.profiles set role = p_role, is_owner = (p_role = 'admin' and p_is_owner) where id = p_user;
end; $$;
revoke all on function public.set_staff_role(uuid, public.user_role, boolean) from public, anon;
grant execute on function public.set_staff_role(uuid, public.user_role, boolean) to authenticated;

-- ============ Owner-only: create a walk-in customer at the till ============
create or replace function public.create_walkin_customer(p_name text, p_email text default null)
returns public.profiles language plpgsql security definer set search_path = public as $$
declare v_row public.profiles; v_id uuid := gen_random_uuid();
begin
  if not public.is_admin() then raise exception 'Niet geautoriseerd'; end if;
  -- A profile without an auth.users row: the customer can claim it later by signing up with this email.
  insert into public.profiles (id, role, display_name, email, referral_code)
  values (v_id, 'customer', nullif(trim(p_name), ''), nullif(trim(p_email), ''),
          upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)))
  returning * into v_row;
  return v_row;
end; $$;
revoke all on function public.create_walkin_customer(text, text) from public, anon;
grant execute on function public.create_walkin_customer(text, text) to authenticated;

-- profiles.id no longer must reference auth.users (walk-ins have no auth row yet).
alter table public.profiles drop constraint if exists profiles_id_fkey;

-- ============ handle_new_user: welcome bonus + referral, claim walk-in by email ============
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_ref_code text; v_referrer uuid; v_welcome int; v_ref_bonus int; v_birthdate date; v_existing uuid;
begin
  select welcome_bonus, referral_bonus into v_welcome, v_ref_bonus from public.settings where id;
  v_ref_code := new.raw_user_meta_data ->> 'referral_code';
  begin v_birthdate := nullif(new.raw_user_meta_data ->> 'birthdate', '')::date; exception when others then v_birthdate := null; end;

  -- Claim a walk-in profile created at the till with this email.
  select id into v_existing from public.profiles
    where email is not null and lower(email) = lower(coalesce(new.email, '')) and id <> new.id limit 1;
  if v_existing is not null then
    update public.point_transactions set customer_id = new.id where customer_id = v_existing;
    update public.profiles set id = new.id where id = v_existing;  -- re-point the walk-in to the auth user
    update public.profiles set display_name = coalesce(display_name, new.raw_user_meta_data ->> 'display_name'),
                               birthdate = coalesce(birthdate, v_birthdate),
                               consent_at = case when (new.raw_user_meta_data ->> 'consent') = 'true' then now() else consent_at end
      where id = new.id;
    return new;
  end if;

  if v_ref_code is not null then
    select id into v_referrer from public.profiles where referral_code = upper(v_ref_code) limit 1;
  end if;

  insert into public.profiles (id, email, phone, display_name, consent_at, birthdate, referred_by, referral_code, locale)
  values (
    new.id, new.email, new.phone,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, ''), '@', 1)),
    case when (new.raw_user_meta_data ->> 'consent') = 'true' then now() else null end,
    v_birthdate, v_referrer,
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
    coalesce(new.raw_user_meta_data ->> 'locale', 'nl')
  );

  if coalesce(v_welcome, 0) > 0 then
    insert into public.point_transactions (customer_id, type, points_delta, note)
    values (new.id, 'adjust', v_welcome, 'Welkomstbonus');
  end if;

  if v_referrer is not null and coalesce(v_ref_bonus, 0) > 0 then
    insert into public.point_transactions (customer_id, type, points_delta, note)
    values (new.id, 'adjust', v_ref_bonus, 'Aanmeldbonus via vriend');
    insert into public.point_transactions (customer_id, type, points_delta, performed_by, note)
    values (v_referrer, 'adjust', v_ref_bonus, new.id, 'Vriend aangebracht');
  end if;

  return new;
end; $$;

-- ============ Birthday bonus & points expiry (run via pg_cron or manually) ============
create or replace function public.grant_birthday_bonuses()
returns int language plpgsql security definer set search_path = public as $$
declare v_bonus int; v_count int := 0; r record;
begin
  select birthday_bonus into v_bonus from public.settings where id;
  if coalesce(v_bonus, 0) <= 0 then return 0; end if;
  for r in
    select id from public.profiles
    where role = 'customer' and birthdate is not null
      and extract(month from birthdate) = extract(month from current_date)
      and extract(day from birthdate) = extract(day from current_date)
      and (birthday_bonus_year is null or birthday_bonus_year < extract(year from current_date)::int)
  loop
    insert into public.point_transactions (customer_id, type, points_delta, note)
    values (r.id, 'adjust', v_bonus, 'Verjaardagscadeau');
    update public.profiles set birthday_bonus_year = extract(year from current_date)::int where id = r.id;
    v_count := v_count + 1;
  end loop;
  return v_count;
end; $$;

create or replace function public.expire_inactive_points()
returns int language plpgsql security definer set search_path = public as $$
declare v_months int; v_count int := 0; r record; v_balance int;
begin
  select points_expiry_months into v_months from public.settings where id;
  if v_months is null or v_months <= 0 then return 0; end if;
  for r in
    select p.id from public.profiles p where p.role = 'customer'
      and coalesce((select max(created_at) from public.point_transactions t where t.customer_id = p.id), p.created_at)
          < now() - (v_months || ' months')::interval
  loop
    select coalesce(sum(points_delta), 0) into v_balance from public.point_transactions where customer_id = r.id;
    if v_balance > 0 then
      insert into public.point_transactions (customer_id, type, points_delta, note)
      values (r.id, 'adjust', -v_balance, 'Punten vervallen (inactiviteit)');
      v_count := v_count + 1;
    end if;
  end loop;
  return v_count;
end; $$;

-- Optional scheduled jobs — enable the pg_cron extension first, then uncomment:
-- select cron.schedule('birthday-bonus', '5 0 * * *',  $$select public.grant_birthday_bonuses()$$);
-- select cron.schedule('expire-points',  '15 0 1 * *', $$select public.expire_inactive_points()$$);

-- ============ Indexes ============
create index if not exists profiles_role_idx        on public.profiles(role);
create index if not exists profiles_referred_by_idx  on public.profiles(referred_by);
create index if not exists txn_performed_by_idx       on public.point_transactions(performed_by);
create index if not exists txn_reward_idx             on public.point_transactions(reward_id);
create index if not exists txn_type_idx               on public.point_transactions(type);

-- ============ Realtime (live balance/history updates) ============
do $$ begin
  alter publication supabase_realtime add table public.point_transactions;
exception when duplicate_object then null; when others then null; end $$;
