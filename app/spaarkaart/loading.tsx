export default function Loading() {
  return (
    <main className="page">
      <div className="container-wide stack">
        <div className="skeleton on-dark skeleton-title" />
        <div className="spaar-grid">
          <div className="card stack" style={{ alignItems: "center" }}>
            <div className="skeleton skeleton-line" style={{ width: 120 }} />
            <div className="skeleton" style={{ width: 120, height: 64 }} />
            <div className="skeleton" style={{ width: 200, height: 200, borderRadius: 8 }} />
          </div>
          <div className="stack">
            {[0, 1, 2].map((i) => (
              <div className="card" key={i}>
                <div className="skeleton skeleton-line" style={{ width: "50%" }} />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line" style={{ width: "70%" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
