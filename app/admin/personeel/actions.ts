"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function promoteByEmail(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) return;
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("id").ilike("email", email).limit(1).maybeSingle();
  if (data?.id) await supabase.rpc("set_staff_role", { p_user: data.id, p_role: "admin", p_is_owner: false });
  revalidatePath("/admin/personeel");
}

async function setRole(id: string, role: "admin" | "customer", isOwner: boolean) {
  const supabase = await createClient();
  await supabase.rpc("set_staff_role", { p_user: id, p_role: role, p_is_owner: isOwner });
  revalidatePath("/admin/personeel");
}

export async function makeOwner(formData: FormData) {
  await setRole(String(formData.get("id")), "admin", true);
}
export async function makeStaff(formData: FormData) {
  await setRole(String(formData.get("id")), "admin", false);
}
export async function demote(formData: FormData) {
  await setRole(String(formData.get("id")), "customer", false);
}
