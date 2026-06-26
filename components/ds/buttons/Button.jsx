"use client";
import React from "react";

/**
 * De Huyskamer button.
 * Primary is the signature red pill (PT Serif Bold). Secondary is an
 * outline that adapts to dark/light surfaces; ghost is a quiet text link.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  onDark = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled = false,
  as,
  style,
  ...rest
}) {
  const Tag = as || (rest.href ? "a" : "button");

  const pad = size === "sm" ? "10px 18px" : "15px 24px";
  const fontSize = size === "sm" ? 15 : 16;

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--sp-2)",
    width: fullWidth ? "100%" : "fit-content",
    padding: pad,
    fontFamily: "var(--font-serif)",
    fontWeight: "var(--fw-bold)",
    fontSize,
    lineHeight: 1,
    textDecoration: "none",
    whiteSpace: "nowrap",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    border: "1px solid transparent",
    transition: "var(--transition-base)",
    boxSizing: "border-box",
  };

  const variants = {
    primary: {
      background: "var(--brand)",
      color: "var(--brand-contrast)",
      borderRadius: "var(--radius-pill)",
    },
    secondary: {
      background: "transparent",
      color: onDark ? "var(--text-on-dark)" : "var(--text-on-light)",
      borderColor: onDark ? "rgba(255,255,255,0.55)" : "rgba(34,32,31,0.35)",
      borderRadius: "var(--radius-pill)",
    },
    ghost: {
      background: "transparent",
      color: onDark ? "var(--text-on-dark)" : "var(--text-on-light)",
      borderRadius: "var(--radius-sm)",
      padding: size === "sm" ? "8px 8px" : "10px 10px",
    },
  };

  return (
    <Tag
      style={{ ...base, ...variants[variant], ...style }}
      disabled={Tag === "button" ? disabled : undefined}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (variant === "primary") e.currentTarget.style.background = "var(--brand-hover)";
        else e.currentTarget.style.background = onDark ? "rgba(255,255,255,0.10)" : "rgba(34,32,31,0.06)";
      }}
      onMouseLeave={(e) => {
        if (variant === "primary") e.currentTarget.style.background = "var(--brand)";
        else e.currentTarget.style.background = "transparent";
      }}
      {...rest}
    >
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </Tag>
  );
}

export default Button;