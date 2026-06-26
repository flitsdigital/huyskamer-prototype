import { createClient } from "@/lib/supabase/server";
import { dateTime, euro } from "@/lib/format";

export const dynamic = "force-dynamic";

type LogRow = {
  id: string;
  type: "earn" | "redeem" | "adjust";
  amount_spent: number | null;
  points_delta: number;
  note: string | null;
  created_at: string;
  customer: { display_name: string | null; email: string | null } | null;
  admin: { display_name: string | null; email: string | null } | null;
  reward: { name: string } | null;
};

const TYPE_LABEL: Record<LogRow["type"], string> = {
  earn: "Sparen",
  redeem: "Inwisselen",
  adjust: "Correctie",
};

function who(p: { display_name: string | null; email: string | null } | null) {
  return p?.display_name || p?.email || "—";
}

export default async function LogboekPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("point_transactions")
    .select(
      `id, type, amount_spent, points_delta, note, created_at,
       customer:profiles!point_transactions_customer_id_fkey(display_name, email),
       admin:profiles!point_transactions_performed_by_fkey(display_name, email),
       reward:rewards(name)`
    )
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (data ?? []) as unknown as LogRow[];

  return (
    <div className="stack">
      <div>
        <span className="eyebrow">Beheer</span>
        <h1 className="title">Logboek</h1>
      </div>

      <div className="card" style={{ overflowX: "auto" }}>
        {rows.length === 0 ? (
          <p className="muted-light">Nog geen transacties.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Wanneer</th>
                <th>Klant</th>
                <th>Type</th>
                <th>Details</th>
                <th style={{ textAlign: "right" }}>Punten</th>
                <th>Door</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id}>
                  <td className="muted-light">{dateTime(t.created_at)}</td>
                  <td>{who(t.customer)}</td>
                  <td>{TYPE_LABEL[t.type]}</td>
                  <td className="muted-light">
                    {t.type === "earn" && t.amount_spent != null ? euro(t.amount_spent) : ""}
                    {t.type === "redeem" && t.reward?.name ? t.reward.name : ""}
                    {t.type === "adjust" && t.note ? t.note : ""}
                  </td>
                  <td
                    style={{ textAlign: "right" }}
                    className={t.points_delta >= 0 ? "delta-pos" : "delta-neg"}
                  >
                    {t.points_delta >= 0 ? "+" : ""}
                    {t.points_delta}
                  </td>
                  <td className="muted-light">{who(t.admin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
