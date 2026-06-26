import React from "react";

/**
 * The brand's recurring header lockup: a handwritten script eyebrow above a
 * bold PT-Serif heading, with optional supporting paragraph.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  onDark = true,
  eyebrowColor,
  style,
  ...rest
}) {
  const textColor = onDark ? "var(--text-on-dark)" : "var(--text-on-light)";
  const mutedColor = onDark ? "var(--text-on-dark-muted)" : "var(--text-on-light-muted)";
  return (
    <header
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--sp-2)",
        textAlign: align,
        alignItems: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        ...style,
      }}
      {...rest}
    >
      {eyebrow && (
        <span style={{
          font: "var(--type-eyebrow)",
          color: eyebrowColor || textColor,
        }}>{eyebrow}</span>
      )}
      {title && (
        <h2 style={{
          margin: 0,
          font: "var(--type-h2)",
          color: textColor,
          textWrap: "balance",
        }}>{title}</h2>
      )}
      {description && (
        <p style={{
          margin: "var(--sp-2) 0 0",
          font: "var(--type-body)",
          color: mutedColor,
          maxWidth: "52ch",
          textWrap: "pretty",
        }}>{description}</p>
      )}
    </header>
  );
}

export default SectionHeading;
