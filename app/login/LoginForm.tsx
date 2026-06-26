"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ds/buttons/Button";
import { Input } from "@/components/ds/forms/Input";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useT, useLocale } from "@/components/LocaleProvider";

export function LoginForm({
  next,
  referralCode,
  authError,
}: {
  next: string;
  referralCode: string;
  authError: boolean;
}) {
  const t = useT();
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(authError ? "Inloglink verlopen of ongeldig. Probeer opnieuw." : null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  async function send() {
    setError(null);
    if (!consent) {
      setError(t("auth.consentRequired"));
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
    const redirect = `${siteUrl}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""}`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirect,
        data: {
          display_name: name || undefined,
          consent: "true",
          locale,
          referral_code: referralCode || undefined,
          birthdate: birthdate || undefined,
        },
      },
    });
    setLoading(false);
    if (error) setError(error.message);
    else {
      setSent(true);
      setCooldown(30);
    }
  }

  return (
    <main className="page">
      <div className="container container-narrow stack">
        <div className="hero hero-storefront stack-sm" style={{ textAlign: "center" }}>
          <span className="eyebrow-light" style={{ color: "rgba(255,255,255,0.85)" }}>
            {t("auth.welcome")}
          </span>
          <h1 className="title" style={{ color: "#fff" }}>
            De Huyskamer
          </h1>
          <p style={{ color: "rgba(255,255,255,0.88)" }}>{t("auth.tagline")}</p>
        </div>

        <div className="row" style={{ justifyContent: "center" }}>
          <LanguageSwitcher />
        </div>

        <div className="card stack">
          {sent ? (
            <div className="stack-sm">
              <h2 className="title-on-light">{t("auth.checkMail")}</h2>
              <p className="muted-light">{t("auth.checkMailBody", { email })}</p>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span className="muted-light caption">{t("auth.mailNotReceived")}</span>
                <Button type="button" variant="ghost" size="sm" disabled={cooldown > 0 || loading} onClick={send}>
                  {cooldown > 0 ? t("auth.resendIn", { s: cooldown }) : t("auth.resend")}
                </Button>
              </div>
            </div>
          ) : (
            <form
              className="stack"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              {referralCode && <p className="success">{t("auth.referralApplied")}</p>}
              <Input
                label={t("auth.email")}
                type="email"
                required
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="jij@voorbeeld.nl"
              />
              <Input
                label={t("auth.name")}
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              />
              <Input
                label={t("profile.birthdate")}
                type="date"
                value={birthdate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBirthdate(e.target.value)}
              />
              <label className="checkbox-row">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 2 }} />
                <span>
                  {t("auth.consent")} (
                  <Link href="/privacy" className="link-underline">
                    {t("card.privacy")}
                  </Link>
                  ).
                </span>
              </label>
              {error && <p className="error">{error}</p>}
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? t("auth.sending") : t("auth.sendLink")}
              </Button>
              <p className="muted-light" style={{ fontSize: "var(--fs-caption)" }}>
                {t("auth.noAccount")}
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
