"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="nl">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center", background: "#2C2A28", color: "#fff" }}>
        <h1 style={{ fontFamily: "Georgia, serif" }}>Er ging iets mis</h1>
        <p>Probeer het opnieuw.</p>
        <button
          onClick={reset}
          style={{ padding: "12px 24px", borderRadius: 1000, border: 0, background: "#A30F0F", color: "#fff", cursor: "pointer" }}
        >
          Opnieuw proberen
        </button>
      </body>
    </html>
  );
}
