import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { dateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

type CustomerRow = {
  id: string;
  display_name: string | null;
  email: string | null;
  qr_token: string;
  created_at: string;
};

export default async function AdminHome() {
  const supabase = await createClient();
  const [customerRes, balanceRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, email, qr_token, created_at")
      .eq("role", "customer")
      .order("created_at", { ascending: false }),
    supabase.from("customer_balances").select("customer_id, balance"),
  ]);

  const customers = (customerRes.data ?? []) as CustomerRow[];
  const balances = new Map(
    (balanceRes.data ?? []).map((b: { customer_id: string; balance: number }) => [
      b.customer_id,
      b.balance,
    ])
  );

  return (
    <div className="stack">
      <div>
        <span className="eyebrow">Beheer</span>
        <h1 className="title">Klanten</h1>
      </div>

      <div className="card">
        {customers.length === 0 ? (
          <p className="muted-light">Nog geen klanten geregistreerd.</p>
        ) : (
          <div className="list">
            {customers.map((c) => (
              <Link href={`/admin/klant/${c.qr_token}`} key={c.id} className="list-row">
                <div>
                  <div className="body-light" style={{ fontWeight: 500 }}>
                    {c.display_name || c.email || "Onbekend"}
                  </div>
                  <div className="muted-light caption">
                    {c.email} · sinds {dateTime(c.created_at)}
                  </div>
                </div>
                <div className="title-on-light" style={{ fontSize: "var(--fs-h4)" }}>
                  {balances.get(c.id) ?? 0} <span className="muted-light caption">pnt</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
