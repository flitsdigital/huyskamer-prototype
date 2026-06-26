import { redirect } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/auth";
import { Button } from "@/components/ds/buttons/Button";
import { Icon } from "@/components/ds/icons/Icon";
import { DeleteAccount } from "./DeleteAccount";
import { QrCard } from "@/components/QrCard";
import { BalanceCelebrate } from "@/components/BalanceCelebrate";
import { RealtimeRefresh } from "@/components/RealtimeRefresh";
import { ShareButton } from "@/components/ShareButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Onboarding } from "@/components/Onboarding";
import { PullToRefresh } from "@/components/PullToRefresh";
import { signOut } from "./actions";
import { dateTime, txnLabel, groupByMonth } from "@/lib/format";
import { t, normalizeLocale } from "@/lib/i18n";
import type { Reward, Transaction, CustomerTier } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Spaarkaart() {
  const profile = await getUserProfile();
  if (!profile) redirect("/login");
  if (profile.role === "admin") redirect("/admin");
  const locale = normalizeLocale(profile.locale);

  const supabase = await createClient();
  const [balanceRes, txnRes, rewardRes, tierRes] = await Promise.all([
    supabase.from("customer_balances").select("balance").eq("customer_id", profile.id).single(),
    supabase
      .from("point_transactions")
      .select("*")
      .eq("customer_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase.from("rewards").select("*").order("points_cost"),
    supabase.from("customer_tiers").select("*").eq("customer_id", profile.id).single(),
  ]);

  const balance = balanceRes.data?.balance ?? 0;
  const txns = (txnRes.data ?? []) as Transaction[];
  const rewards = (rewardRes.data ?? []) as Reward[];
  const tier = (tierRes.data ?? null) as CustomerTier | null;
  const rewardName = (id: string | null) => rewards.find((r) => r.id === id)?.name ?? null;
  const activeRewards = rewards.filter((r) => r.is_active);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const qrSvg = await QRCode.toString(`${siteUrl}/admin/klant/${profile.qr_token}`, {
    type: "svg",
    margin: 1,
    color: { dark: "#22201F", light: "#FFFFFF" },
  });

  const nextReward =
    activeRewards.filter((r) => r.points_cost > balance).sort((a, b) => a.points_cost - b.points_cost)[0] ?? null;
  const rewardPct = nextReward ? Math.min(100, Math.round((balance / nextReward.points_cost) * 100)) : 100;
  const tierPct =
    tier && tier.next_tier_min ? Math.min(100, Math.round((tier.total_earned / tier.next_tier_min) * 100)) : 100;

  const year = new Date().getFullYear();
  const earnedThisYear = txns
    .filter((x) => x.type === "earn" && new Date(x.created_at).getFullYear() === year)
    .reduce((s, x) => s + x.points_delta, 0);
  const redeemedCount = txns.filter((x) => x.type === "redeem").length;

  const referralUrl = `${siteUrl}/login?ref=${profile.referral_code ?? ""}`;
  const groups = groupByMonth(txns, locale);

  return (
    <main className="page">
      <PullToRefresh />
      <RealtimeRefresh customerId={profile.id} />
      <Onboarding
        storageKey="dh-onb-customer"
        steps={[
          { title: t(locale, "card.yourBalance"), body: t(locale, "card.scanHint") },
          { title: t(locale, "card.share"), body: t(locale, "profile.referralBody") },
        ]}
      />
      <div className="container-wide stack">
        <div className="row-between wrap">
          <div>
            <span className="eyebrow">De Huyskamer</span>
            <h1 className="title">{t(locale, "card.greeting", { name: profile.display_name ?? "" })}</h1>
          </div>
          <div className="row wrap">
            <LanguageSwitcher />
            <Link href="/profiel">
              <Button variant="secondary" size="sm" onDark>
                {t(locale, "card.profile")}
              </Button>
            </Link>
            <form action={signOut}>
              <Button type="submit" variant="ghost" size="sm" onDark>
                {t(locale, "card.logout")}
              </Button>
            </form>
          </div>
        </div>

        <div className="spaar-grid">
          <div className="card stack" style={{ alignItems: "center", textAlign: "center" }}>
            {tier?.tier_name && (
              <span className={`tier-badge tier-${tier.tier_name}`}>
                <Icon name="star" size={14} /> {tier.tier_name}
              </span>
            )}
            <span className="field-label">{t(locale, "card.yourBalance")}</span>
            <div>
              <BalanceCelebrate value={balance} /> <span className="points-unit">{t(locale, "common.points")}</span>
            </div>
            {nextReward && (
              <div style={{ width: "100%" }} className="stack-sm">
                <div className="progress">
                  <span style={{ width: `${rewardPct}%` }} />
                </div>
                <p className="muted-light caption">
                  {t(locale, "card.toNextReward", { n: nextReward.points_cost - balance, reward: nextReward.name })}
                </p>
              </div>
            )}
            <QrCard svg={qrSvg} />
            <p className="muted-light" style={{ fontSize: "var(--fs-body-sm)" }}>
              {t(locale, "card.scanHint")}
            </p>
          </div>

          <div className="stack">
            {tier && (
              <div className="card stack-sm">
                <div className="row-between">
                  <h2 className="title-on-light">{t(locale, "card.tier")}</h2>
                  {tier.tier_name && <span className={`tier-badge tier-${tier.tier_name}`}>{tier.tier_name}</span>}
                </div>
                <div className="progress">
                  <span style={{ width: `${tierPct}%` }} />
                </div>
                <p className="muted-light caption">
                  {tier.next_tier_name
                    ? t(locale, "card.toNextTier", {
                        n: (tier.next_tier_min ?? 0) - tier.total_earned,
                        tier: tier.next_tier_name,
                      })
                    : t(locale, "card.maxTier")}
                </p>
              </div>
            )}

            <div className="card stack-sm">
              <h2 className="title-on-light">{t(locale, "card.share")}</h2>
              <p className="muted-light">{t(locale, "profile.referralBody")}</p>
              <div className="row-between wrap">
                <span className="referral-code">{profile.referral_code}</span>
                <ShareButton
                  url={referralUrl}
                  title="De Huyskamer"
                  text={t(locale, "profile.referralBody")}
                  label={t(locale, "card.share")}
                />
              </div>
            </div>

            {activeRewards.length > 0 && (
              <div className="card stack-sm">
                <h2 className="title-on-light">{t(locale, "card.rewards")}</h2>
                <div className="list">
                  {activeRewards.map((r) => (
                    <div className="list-row" key={r.id}>
                      <div>
                        <div className="body-light" style={{ fontWeight: 500 }}>
                          {r.name}
                        </div>
                        {r.description && <div className="muted-light caption">{r.description}</div>}
                      </div>
                      <div className={balance >= r.points_cost ? "delta-pos" : "muted-light"}>{r.points_cost} pnt</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="card stack-sm">
              <h2 className="title-on-light">{t(locale, "card.history")}</h2>
              {txns.length === 0 ? (
                <p className="muted-light">{t(locale, "card.noHistory")}</p>
              ) : (
                <div>
                  {groups.map((g) => (
                    <div key={g.key}>
                      <div className="month-head">
                        <span className="m">{g.label}</span>
                        <span className="s">
                          {g.total >= 0 ? "+" : ""}
                          {g.total} pnt
                        </span>
                      </div>
                      <div className="list">
                        {g.items.map((tx) => (
                          <div className="list-row" key={tx.id}>
                            <div>
                              <div className="body-light">{txnLabel(tx, rewardName(tx.reward_id))}</div>
                              <div className="muted-light caption">{dateTime(tx.created_at, locale)}</div>
                            </div>
                            <div className={tx.points_delta >= 0 ? "delta-pos" : "delta-neg"}>
                              {tx.points_delta >= 0 ? "+" : ""}
                              {tx.points_delta}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row-between wrap">
          <Link href="/privacy" className="muted link-underline" style={{ fontSize: "var(--fs-body-sm)" }}>
            {t(locale, "card.privacy")}
          </Link>
          <DeleteAccount />
        </div>
      </div>
    </main>
  );
}
