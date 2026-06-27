"use client";

import { useEffect } from "react";
import { Button } from "@/components/ds/buttons/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="page">
      <div className="container stack" style={{ textAlign: "center", paddingTop: "var(--sp-9)" }}>
        <span className="eyebrow">Oeps</span>
        <h1 className="title">Er ging iets mis</h1>
        <p className="muted">Probeer het opnieuw. Blijft het misgaan, neem dan contact op.</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={reset}>Opnieuw proberen</Button>
        </div>
      </div>
    </main>
  );
}
