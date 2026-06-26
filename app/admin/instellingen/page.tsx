import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ds/buttons/Button";
import { updateSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function InstellingenPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("points_per_euro").eq("id", true).single();
  const ratio = data?.points_per_euro ?? 1;

  return (
    <div className="stack">
      <div>
        <span className="eyebrow">Beheer</span>
        <h1 className="title">Instellingen</h1>
      </div>

      <div className="card stack-sm">
        <h2 className="title-on-light">Spaarverhouding</h2>
        <p className="muted-light">
          Aantal punten dat een klant per besteed euro spaart. Bij bijschrijven wordt het bedrag ×
          deze waarde genomen en normaal afgerond.
        </p>
        <form action={updateSettings} className="stack-sm">
          <div style={{ maxWidth: 220 }}>
            <label className="field-label" htmlFor="ratio">
              Punten per euro
            </label>
            <input
              id="ratio"
              name="points_per_euro"
              type="text"
              inputMode="decimal"
              className="control"
              defaultValue={String(ratio).replace(".", ",")}
              required
            />
          </div>
          <Button type="submit">Opslaan</Button>
        </form>
      </div>
    </div>
  );
}
