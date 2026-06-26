"use client";
import React from "react";

/** Filled/outline star row in brand red — the rating mark above testimonials. */
export function StarRating({ value = 5, max = 5, size = 18, color = "var(--brand)", style, ...rest }) {
  const Star = ({ filled }) => (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block" }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
  return (
    <div role="img" aria-label={`${value} van ${max} sterren`} style={{ display: "inline-flex", gap: "2px", color, ...style }} {...rest}>
      {Array.from({ length: max }).map((_, i) => <Star key={i} filled={i < Math.round(value)} />)}
    </div>
  );
}

export default StarRating;