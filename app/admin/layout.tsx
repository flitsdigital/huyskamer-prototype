import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/auth";
import { AdminTabBar } from "@/components/AdminTabBar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getUserProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect("/spaarkaart");

  return (
    <main className="page has-tabbar">
      <div className="container">
        <header className="appbar">
          <span className="appbar-brand">
            <span className="scr">De</span> Huyskamer
          </span>
          <span className="caption">Beheer</span>
        </header>
        {children}
      </div>
      <AdminTabBar />
    </main>
  );
}
