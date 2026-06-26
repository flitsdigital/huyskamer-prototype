import type { Transaction } from "@/lib/types";
import type { Locale } from "@/lib/i18n";

const intlLocale = (l: Locale) => (l === "de" ? "de-DE" : l === "en" ? "en-GB" : "nl-NL");

export const euro = (n: number) =>
  n.toLocaleString("nl-NL", { style: "currency", currency: "EUR" });

export const dateTime = (s: string, l: Locale = "nl") =>
  new Date(s).toLocaleString(intlLocale(l), {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

type TxnLike = {
  type: string;
  amount_spent: number | null;
  note: string | null;
};

export function txnLabel(t: TxnLike, rewardName?: string | null): string {
  if (t.type === "earn") {
    return t.amount_spent != null ? `Punten gespaard · ${euro(t.amount_spent)}` : "Punten gespaard";
  }
  if (t.type === "redeem") {
    return rewardName ? `Ingewisseld: ${rewardName}` : "Beloning ingewisseld";
  }
  return t.note ? `Correctie · ${t.note}` : "Correctie";
}

export type MonthGroup = { key: string; label: string; total: number; items: Transaction[] };

// Groups already-desc-sorted transactions into months (most recent first).
export function groupByMonth(txns: Transaction[], locale: Locale = "nl"): MonthGroup[] {
  const map = new Map<string, MonthGroup>();
  for (const t of txns) {
    const d = new Date(t.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    let g = map.get(key);
    if (!g) {
      g = {
        key,
        label: d.toLocaleDateString(intlLocale(locale), { month: "long", year: "numeric" }),
        total: 0,
        items: [],
      };
      map.set(key, g);
    }
    g.total += t.points_delta;
    g.items.push(t);
  }
  return Array.from(map.values());
}
