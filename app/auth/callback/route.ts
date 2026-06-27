import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/ratelimit";

// Handles both the PKCE (?code=) and token_hash magic-link flows, honouring a safe ?next=.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const base = process.env.NEXT_PUBLIC_SITE_URL || origin;

  // Throttle verification attempts per IP (baseline brute-force protection).
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`callback:${ip}`, 20, 1)) {
    return NextResponse.redirect(`${base}/login?error=auth`);
  }
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextParam = searchParams.get("next");
  const dest = nextParam && nextParam.startsWith("/") ? nextParam : "/";

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${base}${dest}`);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${base}${dest}`);
  }

  return NextResponse.redirect(`${base}/login?error=auth`);
}
