export default function Loading() {
  return (
    <div className="stack">
      <div className="skeleton on-dark skeleton-title" />
      <div className="cust-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="card" key={i}>
            <div className="skeleton skeleton-line" style={{ width: "60%" }} />
            <div className="skeleton skeleton-line" style={{ width: "40%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
