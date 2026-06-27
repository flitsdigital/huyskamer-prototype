"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ds/icons/Icon";
import { signOut } from "@/app/spaarkaart/actions";

type Item = { href: string; label: string; icon: IconName; center?: boolean };

function isActive(href: string, path: string): boolean {
  if (href === "/admin") return path === "/admin" || path.startsWith("/admin/klant");
  if (href === "/admin/meer") return path.startsWith("/admin/meer") || path.startsWith("/admin/instellingen") || path.startsWith("/admin/personeel");
  return path.startsWith(href);
}

export function AdminNav({ isOwner }: { isOwner: boolean }) {
  const path = usePathname();

  const tabs: Item[] = isOwner
    ? [
        { href: "/admin", label: "Klanten", icon: "users" },
        { href: "/admin/beloningen", label: "Beloningen", icon: "gift" },
        { href: "/admin/scan", label: "Scannen", icon: "scan", center: true },
        { href: "/admin/logboek", label: "Logboek", icon: "list" },
        { href: "/admin/meer", label: "Meer", icon: "menu" },
      ]
    : [
        { href: "/admin", label: "Klanten", icon: "users" },
        { href: "/admin/scan", label: "Scannen", icon: "scan", center: true },
        { href: "/admin/meer", label: "Meer", icon: "menu" },
      ];

  const side: Item[] = isOwner
    ? [
        { href: "/admin", label: "Klanten", icon: "users" },
        { href: "/admin/scan", label: "Scannen", icon: "scan" },
        { href: "/admin/beloningen", label: "Beloningen", icon: "gift" },
        { href: "/admin/logboek", label: "Logboek", icon: "list" },
        { href: "/admin/personeel", label: "Personeel", icon: "users" },
        { href: "/admin/instellingen", label: "Instellingen", icon: "settings" },
      ]
    : [
        { href: "/admin", label: "Klanten", icon: "users" },
        { href: "/admin/scan", label: "Scannen", icon: "scan" },
      ];

  return (
    <>
      <aside className="sidebar">
        <span className="sidebar-brand">
          <span className="scr">De</span> Huyskamer
        </span>
        {side.map((t) => (
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

      <nav className="tabbar" aria-label="Hoofdmenu">
        {tabs.map((t) => {
          const active = isActive(t.href, path);
          if (t.center) {
            return (
              <Link key={t.href} href={t.href} className={`tab tab-scan ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}>
                <span className="tab-ico-wrap">
                  <Icon name={t.icon} size={26} />
                </span>
                <span>{t.label}</span>
              </Link>
            );
          }
          return (
            <Link key={t.href} href={t.href} className={`tab ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}>
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
