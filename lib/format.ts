export const euro = (n: number) =>
  n.toLocaleString("nl-NL", { style: "currency", currency: "EUR" });

export const dateTime = (s: string) =>
  new Date(s).toLocaleString("nl-NL", {
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
