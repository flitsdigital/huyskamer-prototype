"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ds/icons/Icon";
import { signOut } from "@/app/spaarkaart/actions";

type Item = { href: string; label: string; icon: IconName; center?: boolean };

// Mobile bottom bar — 5 slots, "Meer" holds settings/logout.
const TABS: Item[] = [
  { href: "/admin", label: "Klanten", icon: "users" },
  { href: "/admin/beloningen", label: "Beloningen", icon: "gift" },
  { href: "/admin/scan", label: "Scannen", icon: "scan", center: true },
  { href: "/admin/logboek", label: "Logboek", icon: "list" },
  { href: "/admin/meer", label: "Meer", icon: "menu" },
];

// Desktop sidebar — room for everything directly.
const SIDE: Item[] = [
  { href: "/admin", label: "Klanten", icon: "users" },
  { href: "/admin/scan", label: "Scannen", icon: "scan" },
  { href: "/admin/beloningen", label: "Beloningen", icon: "gift" },
  { href: "/admin/logboek", label: "Logboek", icon: "list" },
  { href: "/admin/instellingen", label: "Instellingen", icon: "settings" },
];

function isActive(href: string, path: string): boolean {
  if (href === "/admin") return path === "/admin" || path.startsWith("/admin/klant");
  if (href === "/admin/meer") return path.startsWith("/admin/meer") || path.startsWith("/admin/instellingen");
  return path.startsWith(href);
}

export function AdminNav() {
  const path = usePathname();
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar">
        <span className="sidebar-brand">
          <span className="scr">De</span> Huyskamer
        </span>
        {SIDE.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`side-link ${isActive(t.href, path) ? "active" : ""}`}
            aria-current={isActive(t.href, path) ? "page" : undefined}
          >
            <span className="side-ico">
              <Icon name={t.icon} size={20} />
            </span>
            {t.label}
          </Link>
        ))}
        <span className="side-spacer" />
        <form action={signOut}>
          <button
            type="submit"
            className="side-link"
            style={{ width: "100%", background: "none", border: 0, cursor: "pointer", textAlign: "left" }}
          >
            <span className="side-ico">
              <Icon name="log-out" size={20} />
            </span>
            Uitloggen
          </button>
        </form>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="tabbar" aria-label="Hoofdmenu">
        {TABS.map((t) => {
          const active = isActive(t.href, path);
          if (t.center) {
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`tab tab-scan ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className="tab-ico-wrap">
                  <Icon name={t.icon} size={26} />
                </span>
                <span>{t.label}</span>
              </Link>
            );
          }
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`tab ${active ? "active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className="tab-ico">
                <Icon name={t.icon} size={22} />
              </span>
              <span>{t.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
