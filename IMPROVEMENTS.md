# Verbeteringen — branch `feature/grote-verbeteringen`

Alle gevraagde items uitgewerkt. Eerst de **3 handmatige stappen** om het live te krijgen, daarna de statuslijst.

---

## ⚠️ Handmatige stappen (in deze volgorde)

1. **Draai de migratie** `supabase/migrations/0002_loyalty_plus.sql` in de Supabase **SQL Editor**.
   Voegt toe: tiers, welkomst-/aanbreng-/verjaardagsbonus, vervaldatum, medewerker/eigenaar-rollen,
   redeem-lock, indexes, reward-afbeeldingen, en zet `point_transactions` in de realtime-publicatie.
   Je huidige admin wordt automatisch **eigenaar** (`is_owner = true`).
2. **(Optioneel) Geplande taken** voor verjaardag & vervaldatum: zet de **`pg_cron`**-extensie aan
   (Database → Extensions) en haal onderaan `0002` de twee `cron.schedule(...)`-regels uit commentaar.
   Zonder cron werken de functies nog steeds handmatig: `select public.grant_birthday_bonuses();`.
3. **Merge de branch** naar `main` → Vercel deployt. (Env onveranderd; voor Sentry zie onder.)

**Optioneel:**
- **Sentry** (error monitoring): zet `SENTRY_DSN` als env-var. Zonder DSN is het een no-op (0 bundle-impact).
- **DB-types genereren:** `SUPABASE_PROJECT_ID=<ref> npm run db:types` (vereist de Supabase CLI).
- **Tests:** `npm run test:e2e` (app moet draaien); RLS-test: `psql "$DATABASE_URL" -f supabase/tests/rls.test.sql`.

---

## Status per item

### Loyaliteit
- **1 Spaartiers** ✅ `tiers`-tabel (Brons/Zilver/Goud), `earn_points` × tier-multiplier, badge + voortgang op spaarkaart/profiel.
- **3 Verjaardagsbeloning** ✅ geboortedatum bij registratie/profiel + `grant_birthday_bonuses()`. ⚙️ auto-uitvoeren = pg_cron (stap 2).
- **7 Welkomstbonus** ✅ via `handle_new_user` + instelbaar onder Instellingen.
- **8 Punten vervallen** ✅ `expire_inactive_points()` + instelbaar (leeg = nooit). ⚙️ auto = pg_cron (stap 2).
- **9 Voortgangsbalk** ✅ "nog X tot beloning" én tier-voortgang op de spaarkaart.
- **12 Referral** ✅ unieke code, bonus voor beide partijen, capture via `?ref=`, deel-/kopieerknop.

### Klant-app
- **16 Profielpagina** ✅ `/profiel` — naam, geboortedatum, taal, referral.
- **18 Statistieken** ✅ tier, gespaard dit jaar, inwisselingen, lid sinds.
- **20 Meertalig** ✅ NL/EN/DE met taalwissel; klantflows vertaald. (Admin-UI bewust NL.)
- **22 Delen** ✅ Web Share API + kopieer-fallback (spaarkaart & profiel).

### Admin / kassa
- **27 Snel klant aanmaken** ✅ `create_walkin_customer` RPC + formulier op `/admin`; klant claimt later via e-mail.
- **32 Zoeken/filteren** ✅ live zoeken op naam/e-mail in het klantoverzicht.
- **34 Rollen** ✅ medewerker vs eigenaar (`is_owner`), `set_staff_role` RPC, eigenaar-only pagina's + nav, `/admin/personeel`.

### UX (D)
- **37** Optimistische states ✅ (pending + toasts + skeletons). **38** Toasts ✅. **39** Lege-staten ⚠️ merk-hero op login; lege lijsten zijn tekstueel (verder uit te breiden). **40** Bevestigingsdialoog ✅ (verwijderen/rol intrekken). **41** Skeletons ✅ (`loading.tsx`). **42** Pull-to-refresh ✅. **43** Foutpagina's ✅ (404/500/global). **44** Onboarding ✅ (klant; admin nog niet). **45** Historie per maand ✅. **46** Micro-animaties ✅ (+ reduced-motion). **47** Opnieuw-versturen-timer ✅. **48** Deep-link na scan ✅ (`?next=`).

### UI (E)
- **49** Favicon/app-icoon/OG ✅. **50** Count-up + confetti ✅. **51** Merkfoto-hero ✅ (login). **52** QR met kader ✅ / logo-in-midden ⚠️ (kader + witruimte; logo-overlay nog niet). **53** Iconenset uitgebreid ✅. **54** Print-stylesheet ✅ (logboek). **55** Visuele beloningskaarten ✅ (afbeelding-URL). **56** Tier-badges ✅. **57** Eigenaar-dashboard ✅ (KPI's); sparklines ⚠️ nog niet. **58** Desktop-typografie ✅.

### Techniek (J)
- **89** DB-types ⚙️ `npm run db:types` toegevoegd (genereren vereist CLI). **90** Tests ✅ (Playwright-config + smoke + RLS-SQL). **91** CI ✅ (`.github/workflows/ci.yml`: typecheck + build). **92** Sentry ✅ (server, env-gated). **93** Rate-limiting ✅ (baseline; ⚙️ serverless → Upstash). **94** Redeem-lock ✅ (advisory lock). **95** Indexes ✅. **96** Realtime ✅ (live saldo/historie).

### Toegankelijkheid (K)
- **97** A11y ✅ skip-link, ARIA-labels/roles, `aria-current`, `lang`, focus-states, alt-teksten, toetsenbordnav. (Doorlopend.)
- **99** Reduced-motion ✅. Tekstgrootte-schaling ⚠️ deels (px-tokens; rem-refactor is vervolgwerk).

⚠️ = werkt, met een duidelijk afgebakende vervolgstap. Zie de code-comments en deze lijst.
