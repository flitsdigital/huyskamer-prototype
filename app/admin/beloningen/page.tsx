import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ds/buttons/Button";
import { ConfirmButton } from "@/components/ConfirmButton";
import { createReward, updateReward, toggleReward, deleteReward } from "./actions";
import type { Reward } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BeloningenPage() {
  const profile = await getUserProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect("/spaarkaart");
  if (!profile.is_owner) redirect("/admin");

  const supabase = await createClient();
  const { data } = await supabase.from("rewards").select("*").order("points_cost");
  const rewards = (data ?? []) as Reward[];

  return (
    <div className="stack">
      <div>
        <span className="eyebrow">Beheer</span>
        <h1 className="title">Beloningen</h1>
      </div>

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
          <div>
            <label className="field-label" htmlFor="new-img">Afbeelding-URL (optioneel)</label>
            <input id="new-img" name="image_url" type="url" className="control" placeholder="https://…/koffie.jpg" />
          </div>
          <Button type="submit">Toevoegen</Button>
        </form>
      </div>

      <div className="reward-grid">
        {rewards.length === 0 && <div className="card muted-light">Nog geen beloningen.</div>}
        {rewards.map((r) => (
          <div className="card stack-sm" key={r.id}>
            {r.image_url && <img className="reward-img" src={r.image_url} alt="" loading="lazy" />}
            <div className="row-between">
              <span className={`tag ${r.is_active ? "tag-on" : "tag-off"}`}>{r.is_active ? "Actief" : "Inactief"}</span>
              <div className="row">
                <form action={toggleReward}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="is_active" value={String(r.is_active)} />
                  <Button type="submit" variant="ghost" size="sm">
                    {r.is_active ? "Deactiveren" : "Activeren"}
                  </Button>
                </form>
                <ConfirmButton
                  action={deleteReward}
                  variant="ghost"
                  size="sm"
                  title="Beloning verwijderen"
                  message={`"${r.name}" verwijderen? Is de beloning al ingewisseld, dan wordt hij gedeactiveerd zodat de historie klopt.`}
                  confirmLabel="Verwijderen"
                  hidden={<input type="hidden" name="id" value={r.id} />}
                >
                  Verwijderen
                </ConfirmButton>
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
              <div>
                <label className="field-label">Afbeelding-URL</label>
                <input name="image_url" type="url" className="control" defaultValue={r.image_url ?? ""} />
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
