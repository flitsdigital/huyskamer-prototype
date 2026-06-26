"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ds/icons/Icon";

type Tab = { href: string; label: string; icon: IconName; center?: boolean };

const TABS: Tab[] = [
  { href: "/admin", label: "Klanten", icon: "users" },
  { href: "/admin/beloningen", label: "Beloningen", icon: "gift" },
  { href: "/admin/scan", label: "Scannen", icon: "scan", center: true },
  { href: "/admin/logboek", label: "Logboek", icon: "list" },
  { href: "/admin/meer", label: "Meer", icon: "menu" },
];

function activeFor(href: string, path: string): boolean {
  if (href === "/admin") return path === "/admin" || path.startsWith("/admin/klant");
  if (href === "/admin/meer") return path.startsWith("/admin/meer") || path.startsWith("/admin/instellingen");
  return path.startsWith(href);
}

export function AdminTabBar() {
  const path = usePathname();
  return (
    <nav className="tabbar" aria-label="Hoofdmenu">
      {TABS.map((t) => {
        const active = activeFor(t.href, path);
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
  );
}
