import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireCustomer } from "@/lib/auth";
import { Button } from "@/components/ds/buttons/Button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CopyButton } from "@/components/CopyButton";
import { ShareButton } from "@/components/ShareButton";
import { ProfileForm } from "./ProfileForm";
import { t, normalizeLocale } from "@/lib/i18n";
import { dateTime } from "@/lib/format";
import type { Transaction, CustomerTier } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProfielPage() {
  const profile = await requireCustomer();
  const locale = normalizeLocale(profile.locale);

  const supabase = await createClient();
  const [txnRes, tierRes] = await Promise.all([
    supabase.from("point_transactions").select("type,points_delta,created_at").eq("customer_id", profile.id),
    supabase.from("customer_tiers").select("*").eq("customer_id", profile.id).single(),
  ]);
  const txns = (txnRes.data ?? []) as Pick<Transaction, "type" | "points_delta" | "created_at">[];
  const tier = (tierRes.data ?? null) as CustomerTier | null;

  const year = new Date().getFullYear();
  const earnedThisYear = txns
    .filter((x) => x.type === "earn" && new Date(x.created_at).getFullYear() === year)
    .reduce((s, x) => s + x.points_delta, 0);
  const redeemed = txns.filter((x) => x.type === "redeem").length;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const referralUrl = `${siteUrl}/login?ref=${profile.referral_code ?? ""}`;

  return (
    <main className="page">
      <div className="container stack">
        <div className="row-between wrap">
          <div>
            <span className="eyebrow">De Huyskamer</span>
            <h1 className="title">{t(locale, "profile.title")}</h1>
          </div>
          <Link href="/spaarkaart">
            <Button variant="ghost" size="sm" onDark>
              {t(locale, "common.back")}
            </Button>
          </Link>
        </div>

        <div className="card stack-sm">
          <ProfileForm displayName={profile.display_name ?? ""} birthdate={profile.birthdate ?? ""} />
        </div>

        <div className="card stack-sm">
          <h2 className="title-on-light">{t(locale, "profile.language")}</h2>
          <LanguageSwitcher />
        </div>

        <div className="card stack-sm">
          <h2 className="title-on-light">{t(locale, "profile.stats")}</h2>
          <div className="kpi-grid">
            <div className="kpi">
              <div className="k-val">{tier?.tier_name ?? "—"}</div>
              <div className="k-lab">{t(locale, "card.tier")}</div>
            </div>
            <div className="kpi">
              <div className="k-val">{earnedThisYear}</div>
              <div className="k-lab">{t(locale, "profile.earnedThisYear")}</div>
            </div>
            <div className="kpi">
              <div className="k-val">{redeemed}</div>
              <div className="k-lab">{t(locale, "profile.redeemedCount")}</div>
            </div>
            <div className="kpi">
              <div className="k-val" style={{ fontSize: "var(--fs-h5)" }}>
                {dateTime(profile.created_at, locale).split(",")[0]}
              </div>
              <div className="k-lab">{t(locale, "profile.memberSince")}</div>
            </div>
          </div>
        </div>

        <div className="card stack-sm">
          <h2 className="title-on-light">{t(locale, "profile.referralCode")}</h2>
          <p className="muted-light">{t(locale, "profile.referralBody")}</p>
          <div className="row-between wrap">
            <span className="referral-code">{profile.referral_code}</span>
            <div className="row">
              <CopyButton value={referralUrl} label={t(locale, "profile.copy")} copiedLabel={t(locale, "profile.copied")} />
              <ShareButton
                url={referralUrl}
                title="De Huyskamer"
                text={t(locale, "profile.referralBody")}
                label={t(locale, "card.share")}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
