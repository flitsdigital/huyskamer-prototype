"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error?: string; ok?: string };

export async function earnAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const customerId = String(formData.get("customerId") || "");
  const token = String(formData.get("token") || "");
  const amount = Number(String(formData.get("amount") || "").replace(",", "."));
  if (!customerId || !Number.isFinite(amount) || amount <= 0)
    return { error: "Vul een geldig bedrag in." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("earn_points", {
    p_customer: customerId,
    p_amount: amount,
    p_note: null,
  });
  if (error) return { error: error.message };
  revalidatePath(`/admin/klant/${token}`);
  return { ok: "Punten bijgeschreven." };
}

export async function redeemAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const customerId = String(formData.get("customerId") || "");
  const token = String(formData.get("token") || "");
  const rewardId = String(formData.get("rewardId") || "");
  if (!customerId || !rewardId) return { error: "Kies een beloning." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("redeem_reward", {
    p_customer: customerId,
    p_reward: rewardId,
  });
  if (error) return { error: error.message };
  revalidatePath(`/admin/klant/${token}`);
  return { ok: "Beloning ingewisseld." };
}

export async function adjustAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const customerId = String(formData.get("customerId") || "");
  const token = String(formData.get("token") || "");
  const delta = parseInt(String(formData.get("delta") || ""), 10);
  const note = String(formData.get("note") || "").trim();
  if (!customerId || !Number.isInteger(delta) || delta === 0)
    return { error: "Vul een correctie in (niet 0)." };
  if (!note) return { error: "Reden is verplicht." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("adjust_points", {
    p_customer: customerId,
    p_delta: delta,
    p_note: note,
  });
  if (error) return { error: error.message };
  revalidatePath(`/admin/klant/${token}`);
  return { ok: "Correctie geboekt." };
}
