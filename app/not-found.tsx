import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <div className="container stack" style={{ textAlign: "center", paddingTop: "var(--sp-9)" }}>
        <span className="eyebrow">404</span>
        <h1 className="title">Pagina niet gevonden</h1>
        <p className="muted">Deze pagina bestaat niet (meer).</p>
        <p>
          <Link href="/" className="link-underline muted">
            Terug naar start
          </Link>
        </p>
      </div>
    </main>
  );
}
