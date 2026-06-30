import Link from "next/link";
import { redirect } from "next/navigation";
import { getTokenCookie, getUserData } from "@/lib/cookies";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = await getTokenCookie();
  const user = await getUserData();

  if (!token || !user || user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-[#f4f7fb]">
      <aside className="w-64 shrink-0 text-white flex flex-col" style={{ backgroundColor: "#2f6f7e" }}>
        <div className="px-6 py-6 border-b border-white/10 flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-lg font-bold">
            +
          </div>
          <span className="text-lg font-bold">MediClick Admin</span>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1">
          <Link
            href="/admin/users"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium bg-white/10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Users
          </Link>
        </nav>
        <div className="px-4 py-5 border-t border-white/10">
          <div className="px-2 mb-3">
            <p className="text-sm font-medium truncate">{user.fullName}</p>
            <p className="text-xs text-white/60 truncate">{user.email}</p>
          </div>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}