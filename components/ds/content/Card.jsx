import React from "react";

/**
 * Versatile content card. With an `image` it becomes a feature tile (image
 * over caption); without one it's the quiet "value" block (script eyebrow +
 * serif title + body) seen in the Gezelligheid row.
 */
export function Card({
  image,
  imageAlt = "",
  aspectRatio = "4 / 3",
  eyebrow,
  title,
  body,
  footer,
  onDark = true,
  align = "left",
  style,
  children,
  ...rest
}) {
  const textColor = onDark ? "var(--text-on-dark)" : "var(--text-on-light)";
  const mutedColor = onDark ? "var(--text-on-dark-muted)" : "var(--text-on-light-muted)";
  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--sp-4)",
        textAlign: align,
        alignItems: align === "center" ? "center" : "flex-start",
        ...style,
      }}
      {...rest}
    >
      {image && (
        <div style={{
          width: "100%",
          aspectRatio,
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          background: "var(--dh-sand-300)",
          boxShadow: "var(--shadow-md)",
        }}>
          <img src={image} alt={imageAlt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      )}
      {(eyebrow || title || body) && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-1)" }}>
          {eyebrow && <span style={{ font: "var(--fw-regular) var(--fs-script-md)/1 var(--font-script)", color: textColor }}>{eyebrow}</span>}
          {title && <h3 style={{ margin: 0, font: "var(--type-h4)", color: textColor }}>{title}</h3>}
          {body && <p style={{ margin: "var(--sp-1) 0 0", font: "var(--type-body)", color: mutedColor, textWrap: "pretty" }}>{body}</p>}
        </div>
      )}
      {children}
      {footer && <div>{footer}</div>}
    </article>
  );
}

export default Card;
