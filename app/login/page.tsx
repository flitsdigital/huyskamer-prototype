"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ds/buttons/Button";
import { Input } from "@/components/ds/forms/Input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!consent) {
      setError("Geef toestemming om door te gaan.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
        data: { display_name: name || undefined, consent: "true" },
      },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <main className="page">
      <div className="container container-narrow stack">
        <div className="stack-sm" style={{ textAlign: "center", gap: "var(--sp-1)" }}>
          <span className="eyebrow-light">Welkom bij</span>
          <h1 className="title">De Huyskamer</h1>
          <p className="muted">Spaar punten en geniet van een gratis kopje koffie.</p>
        </div>

        <div className="card stack">
          {sent ? (
            <div className="stack-sm">
              <h2 className="title-on-light">Check je mail</h2>
              <p className="muted-light">
                We hebben een inloglink naar <strong>{email}</strong> gestuurd. Open de link op deze
                telefoon om in te loggen.
              </p>
            </div>
          ) : (
            <form className="stack" onSubmit={handleSubmit}>
              <Input
                label="E-mailadres"
                type="email"
                required
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="jij@voorbeeld.nl"
              />
              <Input
                label="Naam (optioneel)"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Voornaam"
              />
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{ marginTop: 2 }}
                />
                <span>
                  Ik ga akkoord met het opslaan van mijn gegevens voor het spaarprogramma (zie{" "}
                  <Link href="/privacy" className="link-underline">
                    privacyverklaring
                  </Link>
                  ).
                </span>
              </label>
              {error && <p className="error">{error}</p>}
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? "Versturen…" : "Stuur inloglink"}
              </Button>
              <p className="muted-light" style={{ fontSize: "var(--fs-caption)" }}>
                Nog geen account? Die maken we automatisch aan bij je eerste inloglink.
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
