export default function Loading() {
  return (
    <div className="stack">
      <div className="card stack-sm" style={{ alignItems: "center" }}>
        <div className="skeleton skeleton-line" style={{ width: 140 }} />
        <div className="skeleton" style={{ width: 120, height: 64 }} />
      </div>
      <div className="detail-grid">
        <div className="stack">
          {[0, 1, 2].map((i) => (
            <div className="card" key={i}>
              <div className="skeleton skeleton-line" style={{ width: "50%" }} />
              <div className="skeleton skeleton-line" />
            </div>
          ))}
        </div>
        <div className="card">
          <div className="skeleton skeleton-line" style={{ width: "40%" }} />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line" style={{ width: "80%" }} />
        </div>
      </div>
    </div>
  );
}
