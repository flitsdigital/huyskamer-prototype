import { requireStaff } from "@/lib/auth";
import { AdminNav } from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireStaff();

  return (
    <div className="admin">
      <AdminNav isOwner={!!profile.is_owner} />
      <div className="admin-inner">
        <header className="appbar">
          <span className="appbar-brand">
            <span className="scr">De</span> Huyskamer
          </span>
          <span className="caption">Beheer</span>
        </header>
        {children}
      </div>
    </div>
  );
}
