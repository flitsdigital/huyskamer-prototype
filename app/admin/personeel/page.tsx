import { requireOwner } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ds/buttons/Button";
import { ConfirmButton } from "@/components/ConfirmButton";
import { promoteByEmail, makeOwner, makeStaff, demote } from "./actions";

export const dynamic = "force-dynamic";

type Staff = { id: string; display_name: string | null; email: string | null; is_owner: boolean };

export default async function Personeel() {
  const profile = await requireOwner();
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, email, is_owner")
    .eq("role", "admin")
    .order("created_at");
  const staff = (data ?? []) as Staff[];

  return (
    <div className="stack">
      <div>
        <span className="eyebrow">Beheer</span>
        <h1 className="title">Personeel</h1>
      </div>

      <div className="card stack-sm">
        <h2 className="title-on-light">Medewerker toevoegen</h2>
        <p className="muted-light">
          Vul het e-mailadres in van een bestaand account om er een medewerker van te maken.
        </p>
        <form action={promoteByEmail} className="row wrap" style={{ alignItems: "flex-end" }}>
          <div className="grow">
            <label className="field-label" htmlFor="pe">
              E-mail
            </label>
            <input id="pe" name="email" type="email" className="control" required />
          </div>
          <Button type="submit">Toevoegen</Button>
        </form>
      </div>

      <div className="stack-sm">
        {staff.map((s) => (
          <div className="card row-between wrap" key={s.id}>
            <div>
              <div className="body-light" style={{ fontWeight: 500 }}>
                {s.display_name || s.email}
                {s.id === profile.id && " (jij)"}
              </div>
              <div className="muted-light caption">{s.email}</div>
            </div>
            <div className="row wrap" style={{ alignItems: "center" }}>
              <span className={`role-badge ${s.is_owner ? "role-owner" : "role-staff"}`}>
                {s.is_owner ? "Eigenaar" : "Medewerker"}
              </span>
              {s.id !== profile.id && (
                <>
                  {s.is_owner ? (
                    <form action={makeStaff}>
                      <input type="hidden" name="id" value={s.id} />
                      <Button type="submit" variant="ghost" size="sm">
                        Maak medewerker
                      </Button>
                    </form>
                  ) : (
                    <form action={makeOwner}>
                      <input type="hidden" name="id" value={s.id} />
                      <Button type="submit" variant="ghost" size="sm">
                        Maak eigenaar
                      </Button>
                    </form>
                  )}
                  <ConfirmButton
                    action={demote}
                    variant="ghost"
                    size="sm"
                    title="Toegang intrekken"
                    message={`${s.display_name || s.email} wordt weer een gewone klant en verliest beheerrechten.`}
                    confirmLabel="Intrekken"
                    hidden={<input type="hidden" name="id" value={s.id} />}
                  >
                    Verwijder
                  </ConfirmButton>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
