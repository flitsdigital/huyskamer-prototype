# De Huyskamer loyalty — agent notes

Dutch restaurant loyalty app. Next.js 16 App Router + Supabase (Postgres/Auth/RLS).

## Architecture
- **Balance = `SUM(point_transactions.points_delta)`** via the `customer_balances` view (`security_invoker`). Never store a balance.
- **All point mutations go through `SECURITY DEFINER` RPCs** (`earn_points`, `redeem_reward`, `adjust_points`) which call `is_admin()`. `point_transactions` has a SELECT-only RLS policy — no direct writes by design.
- **Roles** live in `profiles.role` (`customer`/`admin`). `is_admin()` is SECURITY DEFINER (bypasses RLS to avoid policy recursion). A `guard_profile_changes` trigger stops non-admins from changing their own `role`/`qr_token`.
- **Auth gating** is done in server components/layouts via `lib/auth.ts#getUserProfile`, not in `proxy.ts` (which only refreshes the session).
- **QR token** is static per customer (`profiles.qr_token`) and encodes `${NEXT_PUBLIC_SITE_URL}/admin/klant/<token>`.

## Conventions
- Server actions live next to their route in `actions.ts`; interactive feedback uses `useActionState` (see `app/admin/klant/[token]/Forms.tsx`).
- Design system is vendored under `components/ds/` (inline-styled, needs the CSS custom properties from `app/tokens.css`). Interactive DS components are marked `"use client"`.
- Styling: tokens in `app/tokens.css`, utility classes in `app/globals.css`. Dutch UI copy throughout.
- Mobile-first: admin nav is a fixed bottom tab bar (`components/AdminTabBar.tsx`, "Scannen" centered/emphasized), headings use `clamp()`, viewport + safe-areas set in `app/layout.tsx`. The vendored DS `Icon` was extended with app glyphs (`users`/`gift`/`scan`/`list`) — keep `Icon.jsx` and `Icon.d.ts` in sync.

## Schema source of truth
`supabase/migrations/0001_init.sql`. Apply via the Supabase MCP or SQL editor. Regenerate TS types from the live DB if the schema changes.
