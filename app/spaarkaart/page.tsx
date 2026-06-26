import { redirect } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/auth";
import { Button } from "@/components/ds/buttons/Button";
import { DeleteAccount } from "./DeleteAccount";
import { QrCard } from "@/components/QrCard";
import { signOut } from "./actions";
import { dateTime, txnLabel } from "@/lib/format";
import type { Reward, Transaction } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Spaarkaart() {
  const profile = await getUserProfile();
  if (!profile) redirect("/login");
  if (profile.role === "admin") redirect("/admin");

  const supabase = await createClient();
  const [balanceRes, txnRes, rewardRes] = await Promise.all([
    supabase.from("customer_balances").select("balance").eq("customer_id", profile.id).single(),
    supabase
      .from("point_transactions")
      .select("*")
      .eq("customer_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase.from("rewards").select("*").order("points_cost"),
  ]);

  const balance = balanceRes.data?.balance ?? 0;
  const txns = (txnRes.data ?? []) as Transaction[];
  const rewards = (rewardRes.data ?? []) as Reward[];
  const rewardName = (id: string | null) => rewards.find((r) => r.id === id)?.name ?? null;
  const activeRewards = rewards.filter((r) => r.is_active);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const qrSvg = await QRCode.toString(`${siteUrl}/admin/klant/${profile.qr_token}`, {
    type: "svg",
    margin: 1,
    color: { dark: "#22201F", light: "#FFFFFF" },
  });

  return (
    <main className="page">
      <div className="container stack">
        <div className="row-between">
          <div>
            <span className="eyebrow">De Huyskamer</span>
            <h1 className="title">Hoi {profile.display_name ?? ""}</h1>
          </div>
          <form action={signOut}>
            <Button type="submit" variant="secondary" size="sm" onDark>
              Uitloggen
            </Button>
          </form>
        </div>

        {/* Saldo + QR */}
        <div className="card stack" style={{ alignItems: "center", textAlign: "center" }}>
          <span className="field-label">Jouw saldo</span>
          <div>
            <span className="points">{balance}</span> <span className="points-unit">punten</span>
          </div>
          <QrCard svg={qrSvg} />
          <p className="muted-light" style={{ fontSize: "var(--fs-body-sm)" }}>
            Laat deze code scannen bij de kassa om punten te sparen of in te wisselen.
          </p>
        </div>

        {/* Beschikbare beloningen */}
        {activeRewards.length > 0 && (
          <div className="card stack-sm">
            <h2 className="title-on-light">Beloningen</h2>
            <div className="list">
              {activeRewards.map((r) => (
                <div className="list-row" key={r.id}>
                  <div>
                    <div className="body-light" style={{ fontWeight: 500 }}>
                      {r.name}
                    </div>
                    {r.description && <div className="muted-light caption">{r.description}</div>}
                  </div>
                  <div className={balance >= r.points_cost ? "delta-pos" : "muted-light"}>
                    {r.points_cost} pnt
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historie */}
        <div className="card stack-sm">
          <h2 className="title-on-light">Historie</h2>
          {txns.length === 0 ? (
            <p className="muted-light">Nog geen transacties. Spaar je eerste punten bij De Huyskamer!</p>
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

        {/* AVG */}
        <div className="row-between wrap">
          <Link href="/privacy" className="muted link-underline" style={{ fontSize: "var(--fs-body-sm)" }}>
            Privacyverklaring
          </Link>
          <DeleteAccount />
        </div>
      </div>
    </main>
  );
}
