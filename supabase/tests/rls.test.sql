-- RLS / RPC smoke tests. Run against a DB with 0001 + 0002 applied:
--   psql "$DATABASE_URL" -f supabase/tests/rls.test.sql
-- Raises an exception on the first failed assertion; prints a notice when all pass.

do $$
begin
  -- No JWT (SQL context) => not staff, not owner.
  assert public.is_admin() = false, 'is_admin() must be false without auth';
  assert public.is_owner() = false, 'is_owner() must be false without auth';

  -- point_transactions must have NO direct write policy (writes go through RPCs only).
  assert not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'point_transactions'
      and cmd in ('INSERT', 'UPDATE', 'DELETE')
  ), 'point_transactions must have no direct write policy';

  -- RLS is enabled on the sensitive tables.
  assert (select relrowsecurity from pg_class where oid = 'public.point_transactions'::regclass), 'RLS off on point_transactions';
  assert (select relrowsecurity from pg_class where oid = 'public.profiles'::regclass), 'RLS off on profiles';

  -- earn_points without admin must raise (authorization guard).
  begin
    perform public.earn_points('00000000-0000-0000-0000-000000000000'::uuid, 10);
    raise exception 'GUARD_FAILED: earn_points should have rejected an unauthorized caller';
  exception
    when others then
      if sqlerrm like 'GUARD_FAILED:%' then raise; end if;
  end;

  raise notice 'All RLS/RPC assertions passed.';
end $$;
