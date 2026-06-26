"use client";
import React from "react";

/** Multi-line field, matching Input's label + white-field treatment. */
export function Textarea({ label, id, rows = 6, hint, error, style, ...rest }) {
  const fieldId = id || (label ? `f-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)", width: "100%" }}>
      {label && (
        <label htmlFor={fieldId} style={{
          font: "var(--fw-regular) 22px/1 var(--font-script)",
          color: "var(--text-on-light)",
        }}>{label}</label>
      )}
      <textarea
        id={fieldId}
        rows={rows}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "14px 16px",
          background: "var(--surface-field)",
          color: "var(--text-on-light)",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--fs-body)",
          lineHeight: "var(--lh-body)",
          border: `1px solid ${error ? "var(--brand)" : "transparent"}`,
          borderRadius: "var(--radius-sm)",
          boxShadow: "var(--shadow-xs)",
          outline: "none",
          resize: "vertical",
          transition: "var(--transition-base)",
          ...style,
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--focus-ring)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(193,20,20,0.15)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = error ? "var(--brand)" : "transparent"; e.currentTarget.style.boxShadow = "var(--shadow-xs)"; }}
        {...rest}
      />
      {(hint || error) && (
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--fs-body-sm)", color: error ? "var(--brand)" : "var(--text-on-light-muted)" }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}

export default Textarea;