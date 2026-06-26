import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { dateTime, txnLabel } from "@/lib/format";
import { EarnForm, RedeemForm, AdjustForm } from "./Forms";
import type { Profile, Reward, Transaction } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function KlantDetail({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: customerData } = await supabase
    .from("profiles")
    .select("*")
    .eq("qr_token", token)
    .eq("role", "customer")
    .single();
  const customer = customerData as Profile | null;
  if (!customer) notFound();

  const [balanceRes, txnRes, rewardRes, settingsRes] = await Promise.all([
    supabase.from("customer_balances").select("balance").eq("customer_id", customer.id).single(),
    supabase
      .from("point_transactions")
      .select("*")
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase.from("rewards").select("*").order("points_cost"),
    supabase.from("settings").select("points_per_euro").eq("id", true).single(),
  ]);

  const balance = balanceRes.data?.balance ?? 0;
  const ratio = Number(settingsRes.data?.points_per_euro ?? 1);
  const txns = (txnRes.data ?? []) as Transaction[];
  const rewards = (rewardRes.data ?? []) as Reward[];
  const activeRewards = rewards.filter((r) => r.is_active);
  const rewardName = (id: string | null) => rewards.find((r) => r.id === id)?.name ?? null;

  return (
    <div className="stack">
      <div className="card stack-sm" style={{ textAlign: "center", alignItems: "center" }}>
        <span className="field-label">{customer.display_name || customer.email}</span>
        <div>
          <span className="points">{balance}</span> <span className="points-unit">punten</span>
        </div>
        {customer.email && <span className="muted-light caption">{customer.email}</span>}
      </div>

      <div className="detail-grid">
        <div className="stack">
          <div className="card stack-sm">
            <h2 className="title-on-light">Punten bijschrijven</h2>
            <EarnForm customerId={customer.id} token={token} ratio={ratio} />
          </div>

          <div className="card stack-sm">
            <h2 className="title-on-light">Beloning inwisselen</h2>
            {activeRewards.length === 0 ? (
              <p className="muted-light">Geen actieve beloningen. Voeg er een toe bij Beloningen.</p>
            ) : (
              <RedeemForm customerId={customer.id} token={token} rewards={activeRewards} balance={balance} />
            )}
          </div>

          <div className="card stack-sm">
            <h2 className="title-on-light">Correctie</h2>
            <AdjustForm customerId={customer.id} token={token} />
          </div>
        </div>

        <div className="stack">
          <div className="card stack-sm">
            <h2 className="title-on-light">Recente historie</h2>
            {txns.length === 0 ? (
              <p className="muted-light">Nog geen transacties.</p>
            ) : (
              <div className="list">
                {txns.map((t) => (
                  <div className="list-row" key={t.id}>
                    <div>
                      <div className="body-light">{txnLabel(t, rewardName(t.reward_id))}</div>
                      <div className="muted-light caption">{dateTime(t.created_at)}</div>
                    </div>
                    <div className={t.points_delta >= 0 ? "delta-pos" : "delta-neg"}>
                      {t.points_delta >= 0 ? "+" : ""}
                      {t.points_delta}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
