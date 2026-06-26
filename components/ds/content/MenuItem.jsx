"use client";
import React from "react";

/**
 * A single dish row from the menukaart: name + price on one baseline,
 * optional description beneath. Designed to stack inside a category.
 */
export function MenuItem({ name, price, description, vegetarian = false, style, ...rest }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-1)", padding: "var(--sp-3) 0", ...style }} {...rest}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--sp-4)" }}>
        <span style={{
          font: "var(--fw-bold) var(--fs-h5)/1.2 var(--font-serif)",
          color: "var(--text-on-dark)",
        }}>
          {name}
          {vegetarian && <span style={{ color: "var(--text-on-dark-muted)", fontWeight: "var(--fw-regular)" }}> (V)</span>}
        </span>
        {price != null && (
          <span style={{
            font: "var(--fw-bold) var(--fs-h5)/1.2 var(--font-serif)",
            color: "var(--text-on-dark)",
            whiteSpace: "nowrap",
          }}>{typeof price === "number" ? `€ ${price.toFixed(2).replace(".", ",")}` : price}</span>
        )}
      </div>
      {description && (
        <p style={{
          margin: 0,
          font: "var(--type-body)",
          fontSize: "var(--fs-body-sm)",
          color: "var(--text-on-dark-muted)",
          maxWidth: "60ch",
        }}>{description}</p>
      )}
    </div>
  );
}

export default MenuItem;