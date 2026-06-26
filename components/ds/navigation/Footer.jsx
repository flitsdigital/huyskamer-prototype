import React from "react";
import { IconButton } from "../buttons/IconButton.jsx";
import { Icon } from "../icons/Icon.jsx";

const DEFAULT_HOURS = [
  ["Maandag", "12.00 - 17.00 uur"],
  ["Dinsdag", "Gesloten"],
  ["Woensdag", "10.00 - 17.30 uur"],
  ["Donderdag", "10.00 - 21.00 uur"],
  ["Vrijdag", "10.00 - 17.30 uur"],
  ["Zaterdag", "10.00 - 17.00 uur"],
  ["Zondag", "Gesloten"],
];

/**
 * Site footer: opening hours, navigation + socials, contact details, and the
 * oversized "De Huyskamer" serif wordmark. Renders on a sand surface by default.
 */
export function Footer({
  hours = DEFAULT_HOURS,
  links = ["Over ons", "Lunchkaart", "Drankjes", "Arrangementen", "Contact"],
  contact = {
    name: "De Huyskamer Klazienaveen",
    address: ["Langestraat 119a,", "7891GH Klazienaveen"],
    phone: ["0591-202623", "06-56052360"],
    email: "info@dehuyskamerklazienaveen.nl",
  },
  wordmark = "De Huyskamer",
  onSand = true,
  style,
  ...rest
}) {
  const bg = onSand ? "var(--surface-card-deep)" : "var(--surface-deep)";
  const text = onSand ? "var(--text-on-light)" : "var(--text-on-dark)";
  const muted = onSand ? "var(--text-on-light-muted)" : "var(--text-on-dark-muted)";
  const line = onSand ? "rgba(34,32,31,0.12)" : "var(--border-on-dark)";
  const colHead = { font: "var(--fw-bold) var(--fs-h5)/1.2 var(--font-serif)", color: text, margin: "0 0 var(--sp-4)" };

  return (
    <footer style={{ background: bg, color: text, ...style }} {...rest}>
      <div style={{
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        padding: "var(--sp-9) var(--page-gutter) var(--sp-7)",
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr 1fr",
        gap: "var(--sp-8)",
      }}>
        {/* Opening hours */}
        <div>
          <h4 style={colHead}>Openingstijden</h4>
          <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "auto 1fr", rowGap: "var(--sp-2)", columnGap: "var(--sp-6)" }}>
            {hours.map(([day, val]) => {
              const closed = /gesloten/i.test(val);
              return (
                <React.Fragment key={day}>
                  <dt style={{ font: "var(--type-body)", color: closed ? muted : text }}>{day}</dt>
                  <dd style={{ margin: 0, font: "var(--type-body)", color: closed ? muted : text }}>{val}</dd>
                </React.Fragment>
              );
            })}
          </dl>
        </div>

        {/* Navigation + social */}
        <div>
          <h4 style={{ ...colHead, textAlign: "center" }}>Navigatie</h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: "var(--sp-2) var(--sp-4)", justifyContent: "center" }}>
            {links.map((l) => (
              <li key={l}><a href="#" style={{ font: "var(--type-body)", color: text, textDecoration: "none" }}>{l}</a></li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: "var(--sp-2)", justifyContent: "center", marginTop: "var(--sp-5)" }}>
            <IconButton variant="sand" size={36} label="WhatsApp" icon={<Icon name="whatsapp" size={18} />} />
            <IconButton variant="sand" size={36} label="Instagram" icon={<Icon name="instagram" size={18} />} />
            <IconButton variant="sand" size={36} label="Facebook" icon={<Icon name="facebook" size={18} />} />
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ ...colHead, textAlign: "right" }}>Contact</h4>
          <address style={{ fontStyle: "normal", textAlign: "right", display: "flex", flexDirection: "column", gap: "var(--sp-3)", font: "var(--type-body)", color: text }}>
            <span>{contact.name}</span>
            <span>{contact.address.map((a, i) => <React.Fragment key={i}>{a}<br/></React.Fragment>)}</span>
            <span>{contact.phone.map((p, i) => <React.Fragment key={i}>{p}<br/></React.Fragment>)}</span>
            <a href={`mailto:${contact.email}`} style={{ color: text, textDecoration: "none" }}>{contact.email}</a>
          </address>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div aria-hidden="true" style={{
        borderTop: `1px solid ${line}`,
        overflow: "hidden",
        textAlign: "center",
      }}>
        <span style={{
          display: "block",
          font: `var(--fw-bold) clamp(64px, 13vw, 200px)/0.9 var(--font-serif)`,
          color: onSand ? "var(--dh-ink-900)" : "var(--text-on-dark)",
          padding: "var(--sp-6) 0 0",
          whiteSpace: "nowrap",
          letterSpacing: "var(--ls-tight)",
        }}>{wordmark}</span>
      </div>
    </footer>
  );
}

export default Footer;
