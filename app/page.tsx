import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const profile = await getUserProfile();
  if (!profile) redirect("/login");
  redirect(profile.role === "admin" ? "/admin" : "/spaarkaart");
}
