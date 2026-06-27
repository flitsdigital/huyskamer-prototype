"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { normalizeLocale, type Locale } from "@/lib/i18n";

export async function setLocale(locale: Locale) {
  const l = normalizeLocale(locale);
  (await cookies()).set("locale", l, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) await supabase.from("profiles").update({ locale: l }).eq("id", user.id);
  } catch {
    /* best effort */
  }
}
