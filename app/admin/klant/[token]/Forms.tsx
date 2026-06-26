"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ds/buttons/Button";
import { Input } from "@/components/ds/forms/Input";
import { Textarea } from "@/components/ds/forms/Textarea";
import { earnAction, redeemAction, adjustAction, type ActionResult } from "./actions";
import type { Reward } from "@/lib/types";

const initial: ActionResult = {};
const PRESETS = ["2,50", "5", "7,50", "10", "15"];

function Feedback({ state }: { state: ActionResult }) {
  if (state.error) return <p className="error">{state.error}</p>;
  if (state.ok) return <p className="success">{state.ok}</p>;
  return null;
}

export function EarnForm({
  customerId,
  token,
  ratio,
}: {
  customerId: string;
  token: string;
  ratio: number;
}) {
  const [state, action, pending] = useActionState(earnAction, initial);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (state.ok) setAmount("");
  }, [state]);

  const n = parseFloat(amount.replace(",", ".").replace(/[^0-9.]/g, ""));
  const preview = Number.isFinite(n) && n > 0 ? Math.round(n * ratio) : null;

  return (
    <form action={action} className="stack-sm">
      <input type="hidden" name="customerId" value={customerId} />
      <input type="hidden" name="token" value={token} />
      <div className="chips">
        {PRESETS.map((p) => (
          <button
            type="button"
            key={p}
            className={`chip ${amount === p ? "selected" : ""}`}
            onClick={() => setAmount(p)}
          >
            €{p}
          </button>
        ))}
      </div>
      <Input
        label="Besteed bedrag (€)"
        name="amount"
        type="text"
        inputMode="decimal"
        placeholder="0,00"
        required
        value={amount}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
      />
      {preview !== null && (
        <p className="muted-light">
          ≈ <strong>{preview}</strong> {preview === 1 ? "punt" : "punten"}
        </p>
      )}
      <Button type="submit" fullWidth disabled={pending}>
        {pending ? "Bezig…" : "Punten bijschrijven"}
      </Button>
      <Feedback state={state} />
    </form>
  );
}

export function RedeemForm({
  customerId,
  token,
  rewards,
  balance,
}: {
  customerId: string;
  token: string;
  rewards: Reward[];
  balance: number;
}) {
  const [state, action, pending] = useActionState(redeemAction, initial);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (state.ok) setSelected("");
  }, [state]);

  const chosen = rewards.find((r) => r.id === selected);

  return (
    <form action={action} className="stack-sm">
      <input type="hidden" name="customerId" value={customerId} />
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="rewardId" value={selected} />
      <div className="stack-sm">
        {rewards.map((r) => {
          const afford = balance >= r.points_cost;
          return (
            <button
              type="button"
              key={r.id}
              disabled={!afford}
              className={`reward-card ${selected === r.id ? "selected" : ""}`}
              onClick={() => setSelected(r.id)}
            >
              <span>
                <span style={{ fontWeight: 500 }}>{r.name}</span>
                {!afford && <span className="muted-light caption"> · te weinig punten</span>}
              </span>
              <span className="rc-cost">{r.points_cost} pnt</span>
            </button>
          );
        })}
      </div>
      <Button type="submit" variant="secondary" fullWidth disabled={pending || !selected}>
        {pending
          ? "Bezig…"
          : chosen
            ? `Inwisselen voor ${chosen.points_cost} punten`
            : "Kies een beloning"}
      </Button>
      <Feedback state={state} />
    </form>
  );
}

export function AdjustForm({ customerId, token }: { customerId: string; token: string }) {
  const [state, action, pending] = useActionState(adjustAction, initial);
  return (
    <form action={action} className="stack-sm">
      <input type="hidden" name="customerId" value={customerId} />
      <input type="hidden" name="token" value={token} />
      <Input label="Correctie (punten, + of −)" name="delta" type="number" placeholder="bijv. -10" required />
      <Textarea label="Reden" name="note" rows={2} placeholder="Reden van de correctie" required />
      <Button type="submit" variant="ghost" disabled={pending}>
        {pending ? "Bezig…" : "Correctie boeken"}
      </Button>
      <Feedback state={state} />
    </form>
  );
}
