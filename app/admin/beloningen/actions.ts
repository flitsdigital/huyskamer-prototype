"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ponytail: invalid input -> no-op (revalidate keeps the list truthful).

export async function createReward(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;
  const image_url = String(formData.get("image_url") || "").trim() || null;
  const points = parseInt(String(formData.get("points_cost") || ""), 10);
  if (!name || !Number.isInteger(points) || points <= 0) return;

  const supabase = await createClient();
  await supabase.from("rewards").insert({ name, description, image_url, points_cost: points });
  revalidatePath("/admin/beloningen");
}

export async function updateReward(formData: FormData) {
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;
  const image_url = String(formData.get("image_url") || "").trim() || null;
  const points = parseInt(String(formData.get("points_cost") || ""), 10);
  if (!id || !name || !Number.isInteger(points) || points <= 0) return;

  const supabase = await createClient();
  await supabase.from("rewards").update({ name, description, image_url, points_cost: points }).eq("id", id);
  revalidatePath("/admin/beloningen");
}

export async function toggleReward(formData: FormData) {
  const id = String(formData.get("id") || "");
  const isActive = String(formData.get("is_active")) === "true";
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("rewards").update({ is_active: !isActive }).eq("id", id);
  revalidatePath("/admin/beloningen");
}

export async function deleteReward(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;
  const supabase = await createClient();
  const { error } = await supabase.from("rewards").delete().eq("id", id);
  if (error) await supabase.from("rewards").update({ is_active: false }).eq("id", id);
  revalidatePath("/admin/beloningen");
}
