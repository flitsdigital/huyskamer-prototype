import { requireOwner } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ds/buttons/Button";
import { updateSettings } from "./actions";
import type { Settings } from "@/lib/types";

export const dynamic = "force-dynamic";

function Field({ label, name, value, hint, suffix }: { label: string; name: string; value: string; hint?: string; suffix?: string }) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <div className="row" style={{ gap: "var(--sp-2)" }}>
        <input id={name} name={name} type="text" inputMode="decimal" className="control" defaultValue={value} style={{ maxWidth: 160 }} />
        {suffix && <span className="muted-light caption">{suffix}</span>}
      </div>
      {hint && <p className="muted-light caption" style={{ marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

export default async function InstellingenPage() {
  await requireOwner();
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("*").eq("id", true).single();
  const s = (data ?? {}) as Partial<Settings>;
  const v = (n: number | null | undefined, d: number) => String(n ?? d).replace(".", ",");

  return (
    <div className="stack">
      <div>
        <span className="eyebrow">Beheer</span>
        <h1 className="title">Instellingen</h1>
      </div>

      <form action={updateSettings} className="card stack">
        <Field label="Punten per euro" name="points_per_euro" value={v(s.points_per_euro, 1)} suffix="× bedrag" hint="Bij bijschrijven: bedrag × deze waarde, normaal afgerond (en × het niveau-tarief van de klant)." />
        <hr className="divider" />
        <Field label="Welkomstbonus" name="welcome_bonus" value={v(s.welcome_bonus, 25)} suffix="punten" hint="Punten die een nieuwe klant bij registratie krijgt." />
        <Field label="Aanbrengbonus" name="referral_bonus" value={v(s.referral_bonus, 50)} suffix="punten" hint="Punten voor zowel de aanbrenger als de nieuwe klant bij een geslaagde uitnodiging." />
        <Field label="Verjaardagscadeau" name="birthday_bonus" value={v(s.birthday_bonus, 80)} suffix="punten" hint="Punten op de verjaardag van de klant (vereist een geplande taak — zie README)." />
        <Field label="Punten vervallen na" name="points_expiry_months" value={s.points_expiry_months != null ? String(s.points_expiry_months) : ""} suffix="maanden inactiviteit" hint="Laat leeg voor 'nooit'. Vereist een geplande taak — zie README." />
        <Button type="submit">Opslaan</Button>
      </form>
    </div>
  );
}
