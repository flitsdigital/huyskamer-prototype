import React from "react";

/**
 * Guest review. Quote in body sans, signed in handwritten script.
 * Defaults to the "quiet" treatment (hairline-separated, no card fill)
 * seen in the testimonial wall; pass variant="card" for a sand card.
 */
export function Testimonial({ quote, author, rating, variant = "quiet", onDark = true, style, ...rest }) {
  const isCard = variant === "card";
  const textColor = onDark && !isCard ? "var(--text-on-dark)" : "var(--text-on-light)";
  const mutedColor = onDark && !isCard ? "var(--text-on-dark-muted)" : "var(--text-on-light-muted)";
  return (
    <figure
      style={{
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "var(--sp-4)",
        padding: isCard ? "var(--sp-6)" : 0,
        background: isCard ? "var(--surface-card)" : "transparent",
        borderRadius: isCard ? "var(--radius-md)" : 0,
        boxShadow: isCard ? "var(--shadow-sm)" : "none",
        ...style,
      }}
      {...rest}
    >
      {rating != null && (
        <div style={{ color: "var(--brand)", display: "inline-flex", gap: 2 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="16" height="16" viewBox="0 0 24 24"
              fill={i < Math.round(rating) ? "currentColor" : "none"} stroke="currentColor"
              strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          ))}
        </div>
      )}
      <blockquote style={{
        margin: 0,
        font: "var(--type-body-lg)",
        color: textColor,
        textWrap: "pretty",
      }}>{quote}</blockquote>
      {author && (
        <figcaption style={{
          font: "var(--fw-regular) 24px/1 var(--font-script)",
          color: mutedColor,
        }}>{author}</figcaption>
      )}
    </figure>
  );
}

export default Testimonial;
