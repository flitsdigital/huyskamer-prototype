"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateSettings(formData: FormData) {
  const ratio = Number(String(formData.get("points_per_euro") || "").replace(",", "."));
  if (!Number.isFinite(ratio) || ratio <= 0) return; // ponytail: invalid -> no-op

  const supabase = await createClient();
  await supabase
    .from("settings")
    .update({ points_per_euro: ratio, updated_at: new Date().toISOString() })
    .eq("id", true);
  revalidatePath("/admin/instellingen");
}
