import { requireOwner } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { dateTime, euro } from "@/lib/format";
import { PrintButton } from "@/components/PrintButton";

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
  await requireOwner();
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
      <div className="row-between wrap">
        <div>
          <span className="eyebrow">Beheer</span>
          <h1 className="title">Logboek</h1>
        </div>
        <PrintButton label="Printen" />
      </div>

      <div className="card">
        {rows.length === 0 ? (
          <p className="muted-light">Nog geen transacties.</p>
        ) : (
          <ul className="log-list">
            {rows.map((t) => {
              const details =
                t.type === "earn" && t.amount_spent != null
                  ? euro(t.amount_spent)
                  : t.type === "redeem" && t.reward?.name
                    ? t.reward.name
                    : t.type === "adjust" && t.note
                      ? t.note
                      : null;
              return (
                <li key={t.id} className="log-row">
                  <div className="grow">
                    <div className="log-who">{who(t.customer)}</div>
                    <div className="log-meta">
                      {TYPE_LABEL[t.type]}
                      {details ? ` · ${details}` : ""}
                    </div>
                    <div className="log-sub">
                      {dateTime(t.created_at)} · door {who(t.admin)}
                    </div>
                  </div>
                  <div className={`log-delta ${t.points_delta >= 0 ? "delta-pos" : "delta-neg"}`}>
                    {t.points_delta >= 0 ? "+" : ""}
                    {t.points_delta}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
