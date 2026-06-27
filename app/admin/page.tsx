import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/auth";
import { CustomerBrowser } from "./CustomerBrowser";
import { QuickCreate } from "./QuickCreate";

export const dynamic = "force-dynamic";

type CustomerRow = {
  id: string;
  display_name: string | null;
  email: string | null;
  qr_token: string;
  created_at: string;
};

export default async function AdminHome() {
  const profile = await getUserProfile();
  const isOwner = !!profile?.is_owner;
  const supabase = await createClient();

  const [custRes, balRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, email, qr_token, created_at")
      .eq("role", "customer")
      .order("created_at", { ascending: false }),
    supabase.from("customer_balances").select("customer_id, balance"),
  ]);

  const customers = (custRes.data ?? []) as CustomerRow[];
  const balMap = new Map(
    (balRes.data ?? []).map((b: { customer_id: string; balance: number }) => [b.customer_id, b.balance])
  );
  const withBal = customers.map((c) => ({ ...c, balance: balMap.get(c.id) ?? 0 }));

  let kpis: { customers: number; totalBalance: number; transactions: number; redeemed: number } | null = null;
  if (isOwner) {
    const totalBalance = withBal.reduce((s, c) => s + c.balance, 0);
    const [{ count: txCount }, { count: redeemedCount }] = await Promise.all([
      supabase.from("point_transactions").select("*", { count: "exact", head: true }),
      supabase.from("point_transactions").select("*", { count: "exact", head: true }).eq("type", "redeem"),
    ]);
    kpis = { customers: customers.length, totalBalance, transactions: txCount ?? 0, redeemed: redeemedCount ?? 0 };
  }

  return (
    <div className="stack">
      <div className="row-between wrap">
        <div>
          <span className="eyebrow">Beheer</span>
          <h1 className="title">Klanten</h1>
        </div>
        <span className={`role-badge ${isOwner ? "role-owner" : "role-staff"}`}>
          {isOwner ? "Eigenaar" : "Medewerker"}
        </span>
      </div>

      {kpis && (
        <div className="kpi-grid">
          <div className="kpi">
            <div className="k-val">{kpis.customers}</div>
            <div className="k-lab">Klanten</div>
          </div>
          <div className="kpi">
            <div className="k-val">{kpis.totalBalance}</div>
            <div className="k-lab">Punten in omloop</div>
          </div>
          <div className="kpi">
            <div className="k-val">{kpis.transactions}</div>
            <div className="k-lab">Transacties</div>
          </div>
          <div className="kpi">
            <div className="k-val">{kpis.redeemed}</div>
            <div className="k-lab">Inwisselingen</div>
          </div>
        </div>
      )}

      <QuickCreate />
      <CustomerBrowser customers={withBal} />
    </div>
  );
}
