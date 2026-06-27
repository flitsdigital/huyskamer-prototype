import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

// Returns the signed-in user's profile, or null when not authenticated.
export async function getUserProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return (data as Profile) ?? null;
}

// Route guards — redirect away from the wrong audience, else return the profile.
export async function requireCustomer(): Promise<Profile> {
  const p = await getUserProfile();
  if (!p) redirect("/login");
  if (p.role === "admin") redirect("/admin");
  return p;
}

export async function requireStaff(): Promise<Profile> {
  const p = await getUserProfile();
  if (!p) redirect("/login");
  if (p.role !== "admin") redirect("/spaarkaart");
  return p;
}

export async function requireOwner(): Promise<Profile> {
  const p = await requireStaff();
  if (!p.is_owner) redirect("/admin");
  return p;
}
