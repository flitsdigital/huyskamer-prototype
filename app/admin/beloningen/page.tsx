import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ds/buttons/Button";
import { createReward, updateReward, toggleReward, deleteReward } from "./actions";
import type { Reward } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BeloningenPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("rewards").select("*").order("points_cost");
  const rewards = (data ?? []) as Reward[];

  return (
    <div className="stack">
      <div>
        <span className="eyebrow">Beheer</span>
        <h1 className="title">Beloningen</h1>
      </div>

      {/* Nieuwe beloning */}
      <div className="card stack-sm">
        <h2 className="title-on-light">Nieuwe beloning</h2>
        <form action={createReward} className="stack-sm">
          <div className="row wrap" style={{ alignItems: "flex-end" }}>
            <div className="grow">
              <label className="field-label" htmlFor="new-name">Naam</label>
              <input id="new-name" name="name" className="control" placeholder="Gratis koffie" required />
            </div>
            <div style={{ width: 120 }}>
              <label className="field-label" htmlFor="new-points">Punten</label>
              <input id="new-points" name="points_cost" type="number" min={1} className="control" placeholder="50" required />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="new-desc">Omschrijving (optioneel)</label>
            <input id="new-desc" name="description" className="control" placeholder="Een vers gezette koffie" />
          </div>
          <Button type="submit">Toevoegen</Button>
        </form>
      </div>

      {/* Bestaande beloningen */}
      <div className="stack-sm">
        {rewards.length === 0 && <div className="card muted-light">Nog geen beloningen.</div>}
        {rewards.map((r) => (
          <div className="card stack-sm" key={r.id}>
            <div className="row-between">
              <span className={`tag ${r.is_active ? "tag-on" : "tag-off"}`}>
                {r.is_active ? "Actief" : "Inactief"}
              </span>
              <div className="row">
                <form action={toggleReward}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="is_active" value={String(r.is_active)} />
                  <Button type="submit" variant="ghost" size="sm">
                    {r.is_active ? "Deactiveren" : "Activeren"}
                  </Button>
                </form>
                <form action={deleteReward}>
                  <input type="hidden" name="id" value={r.id} />
                  <Button type="submit" variant="ghost" size="sm">
                    Verwijderen
                  </Button>
                </form>
              </div>
            </div>
            <form action={updateReward} className="stack-sm">
              <input type="hidden" name="id" value={r.id} />
              <div className="row wrap" style={{ alignItems: "flex-end" }}>
                <div className="grow">
                  <label className="field-label">Naam</label>
                  <input name="name" className="control" defaultValue={r.name} required />
                </div>
                <div style={{ width: 120 }}>
                  <label className="field-label">Punten</label>
                  <input name="points_cost" type="number" min={1} className="control" defaultValue={r.points_cost} required />
                </div>
              </div>
              <div>
                <label className="field-label">Omschrijving</label>
                <input name="description" className="control" defaultValue={r.description ?? ""} />
              </div>
              <Button type="submit" variant="secondary" size="sm">
                Opslaan
              </Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
