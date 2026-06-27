import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; ref?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next && sp.next.startsWith("/") ? sp.next : "";
  return <LoginForm next={next} referralCode={sp.ref ?? ""} authError={sp.error === "auth"} />;
}
