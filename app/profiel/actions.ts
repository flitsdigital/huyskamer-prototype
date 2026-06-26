"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileResult = { ok?: string; error?: string };

export async function updateProfile(_prev: ProfileResult, formData: FormData): Promise<ProfileResult> {
  const name = String(formData.get("display_name") || "").trim();
  const birthdate = String(formData.get("birthdate") || "").trim() || null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Niet ingelogd" };

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: name || null, birthdate })
    .eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/profiel");
  revalidatePath("/spaarkaart");
  return { ok: "Opgeslagen" };
}
