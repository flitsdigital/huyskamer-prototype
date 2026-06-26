"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createWalkin(formData: FormData): Promise<{ token?: string; error?: string }> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim() || null;
  if (!name) return { error: "Naam is verplicht" };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_walkin_customer", { p_name: name, p_email: email });
  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { token: (data as { qr_token: string } | null)?.qr_token };
}
