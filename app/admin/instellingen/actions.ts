"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateSettings(formData: FormData) {
  const num = (k: string) => {
    const v = Number(String(formData.get(k) || "").replace(",", "."));
    return Number.isFinite(v) ? v : null;
  };
  const ratio = num("points_per_euro");
  const welcome = num("welcome_bonus");
  const referral = num("referral_bonus");
  const birthday = num("birthday_bonus");
  const expiryRaw = String(formData.get("points_expiry_months") || "").trim();
  const expiry = expiryRaw === "" ? 0 : Math.max(0, Math.round(Number(expiryRaw) || 0));

  const update: Record<string, number | null> = {};
  if (ratio != null && ratio > 0) update.points_per_euro = ratio;
  if (welcome != null && welcome >= 0) update.welcome_bonus = Math.round(welcome);
  if (referral != null && referral >= 0) update.referral_bonus = Math.round(referral);
  if (birthday != null && birthday >= 0) update.birthday_bonus = Math.round(birthday);
  update.points_expiry_months = expiry > 0 ? expiry : null;

  const supabase = await createClient();
  await supabase
    .from("settings")
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq("id", true);
  revalidatePath("/admin/instellingen");
}
