import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next 16 "proxy" convention (formerly middleware). Refreshes the Supabase session per request.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts|img|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|otf|ttf)$).*)",
  ],
};
