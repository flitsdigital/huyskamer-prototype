export default function Loading() {
  return (
    <main className="page">
      <div className="container stack">
        <div className="skeleton on-dark skeleton-title" />
        {[0, 1, 2].map((i) => (
          <div className="card" key={i}>
            <div className="skeleton skeleton-line" style={{ width: "40%" }} />
            <div className="skeleton skeleton-line" />
          </div>
        ))}
      </div>
    </main>
  );
}
