# De Huyskamer — Spaarprogramma

Digitaal loyaliteitsprogramma voor restaurant De Huyskamer. Klanten sparen punten op besteding
en wisselen ze in voor beloningen; medewerkers scannen de klant-QR en boeken punten.

**Stack:** Next.js 16 (App Router) · Supabase (Postgres, Auth, RLS) · het De Huyskamer design system.

---

## Belangrijkste keuzes (testcase)

| Onderwerp | Keuze |
|-----------|-------|
| Punten | `afgerond(bedrag × punten_per_euro)`, normaal afgerond. Ratio start op **1 punt/€1**, instelbaar onder **Beheer → Instellingen**. |
| Saldo | Altijd `SUM(points_delta)` uit `point_transactions` — geen los saldoveld. |
| QR-token | **Statisch** per klant. De QR codeert de admin-URL, dus scannen werkt ook met de gewone camera-app. |
| Admins | **Eigen account per medewerker** (zinvol logboek via `performed_by`). |
| Correcties | Admin boekt een `adjust`-transactie **met verplichte reden**. |
| AVG | Toestemmingsvinkje bij registratie + self-service **account verwijderen** + privacyverklaring (placeholder). |
| Rolscheiding | Afgedwongen via **RLS**; alle puntmutaties lopen via `SECURITY DEFINER` RPC's met `is_admin()`-check. |

---

## Setup

### 1. Supabase-project
Maak een nieuw project aan op [supabase.com](https://supabase.com). Noteer uit **Project Settings → API**:
- Project URL (`https://<ref>.supabase.co`)
- de **anon / publishable** key

### 2. Database migreren
Draai `supabase/migrations/0001_init.sql` (tabellen, RLS, RPC's, triggers, demo-beloningen). Twee opties:
- **Plak** de inhoud in de Supabase **SQL Editor** en run, of
- geef mij de **project-ref**, dan draai ik 'm via de Supabase-MCP.

### 3. Auth instellen (Supabase → Authentication)
- **Email** provider aan (magic link). Zonder eigen SMTP geldt de Supabase-ratelimiet — prima voor de test.
- **URL Configuration:**
  - Site URL: `http://localhost:3000` (lokaal) / je productie-URL.
  - Redirect URLs: voeg `http://localhost:3000/auth/callback` toe (en de productievariant).

### 4. Env
Kopieer `.env.local.example` → `.env.local` en vul in:
```
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
`NEXT_PUBLIC_SITE_URL` is nodig voor de magic-link redirect én voor de URL in de klant-QR.

### 5. Draaien
```
npm install
npm run dev
```

### 6. Eerste admin maken
Log één keer in met het e-mailadres van de eigenaar (magic link). Promoveer dat account daarna in de SQL Editor:
```sql
update public.profiles set role = 'admin' where email = 'eigenaar@dehuyskamer.nl';
```
Volgende medewerkers idem.

---

## Flows
- **Klant** → `/spaarkaart`: saldo, QR-code, historie, account verwijderen.
- **Admin** → `/admin`: klantoverzicht · `/admin/scan` (camera) · klantdetail (punten bijschrijven / inwisselen / corrigeren) · beloningen · logboek · instellingen.
- Scannen opent `/admin/klant/<qr_token>`; de admin-RLS opent het klantprofiel.

## Bewuste vereenvoudigingen (`ponytail`)
- **Telefoon-login** zit niet aan: e-mail magic link dekt registratie/inlog. Telefoon-OTP vereist een SMS-provider (Twilio); aanzetten kan later in Supabase.
- **Geen row-lock** bij inwisselen — verwaarloosbare race voor één locatie.
- **In-browser scanner** gebruikt `BarcodeDetector` (Chrome/Android); op iOS gebruikt men de camera-app of het handmatige codeveld.
- **Privacyverklaring** is een placeholder — vervang door definitieve juridische tekst.
# huyskamer-prototype

---

## v2 — branch `feature/grote-verbeteringen`

Grote uitbreiding: spaartiers, welkomst-/aanbreng-/verjaardagsbonus, puntenvervaldatum, referral,
klantprofiel + statistieken, NL/EN/DE, medewerker/eigenaar-rollen, walk-in-klanten, realtime,
toasts, skeletons, onboarding, foutpagina's, owner-dashboard, tests/CI/Sentry en toegankelijkheid.

**Zie [`IMPROVEMENTS.md`](IMPROVEMENTS.md) voor de volledige statuslijst en de handmatige stappen.**

Kort:
1. Draai **`supabase/migrations/0002_loyalty_plus.sql`** in de Supabase SQL Editor (vóór merge).
2. Optioneel `pg_cron` aan voor verjaardags-/vervaldatum-taken; `SENTRY_DSN` voor error monitoring.
3. Merge → Vercel deployt.

Scripts: `npm run typecheck` · `npm run test:e2e` · `npm run db:types`.
De in-browser scanner gebruikt nu **jsQR** (werkt ook op iOS Safari).

