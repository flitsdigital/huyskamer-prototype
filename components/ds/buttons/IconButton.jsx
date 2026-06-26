"use client";
import React from "react";

/**
 * Circular icon button. Two surface treatments seen in the brand:
 *  • "scrim"  — translucent dark disc over imagery (e.g. the nav menu toggle)
 *  • "sand"   — soft sand disc used for social links in the footer
 *  • "ghost"  — bare, hover-tinted
 */
export function IconButton({
  icon,
  label,
  variant = "scrim",
  size = 43,
  onDark = true,
  as,
  style,
  ...rest
}) {
  const Tag = as || (rest.href ? "a" : "button");

  const variants = {
    scrim: { background: "rgba(0,0,0,0.20)", color: "var(--text-on-dark)" },
    sand: { background: "var(--dh-sand-500)", color: "var(--dh-brown-900)" },
    ghost: { background: "transparent", color: onDark ? "var(--text-on-dark)" : "var(--text-on-light)" },
    solid: { background: "var(--brand)", color: "var(--brand-contrast)" },
  };

  return (
    <Tag
      aria-label={label}
      title={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "var(--radius-full)",
        border: "none",
        cursor: "pointer",
        transition: "var(--transition-base)",
        boxSizing: "border-box",
        ...variants[variant],
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(0.92)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
      {...rest}
    >
      {icon}
    </Tag>
  );
}

export default IconButton;