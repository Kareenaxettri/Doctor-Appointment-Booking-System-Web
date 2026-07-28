import Link from "next/link";
import { redirect } from "next/navigation";
import { getTokenCookie, getUserData } from "@/lib/cookies";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = await getTokenCookie();
  const user = await getUserData();

  if (!token || !user || user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      <style>{`
        .admin-nav-link:hover {
          background: var(--bg-hover) !important;
        }
      `}</style>

      <aside
        className="w-64 shrink-0 flex flex-col"
        style={{ background: "var(--bg-sidebar)", borderRight: "1px solid var(--border-light)" }}
      >
        <div
          className="px-5 py-5 flex items-center gap-2.5"
          style={{ borderBottom: "1px solid var(--border-light)" }}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold"
            style={{ background: "var(--brand)", color: "var(--fg-inverse)" }}
          >
            M
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--fg)" }}>
            MediClick Admin
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <Link
            href="/admin/users"
            className="admin-nav-link flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition"
            style={{ color: "var(--fg-secondary)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Users
          </Link>
          <Link
            href="/admin/doctors"
            className="admin-nav-link flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition"
            style={{ color: "var(--fg-secondary)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l7 4v6c0 5-3 8-7 10-4-2-7-5-7-10V6l7-4z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            Doctors
          </Link>
          <Link
            href="/admin/appointments"
            className="admin-nav-link flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition"
            style={{ color: "var(--fg-secondary)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            Appointments
          </Link>
          <Link
            href="/admin/payments"
            className="admin-nav-link flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition"
            style={{ color: "var(--fg-secondary)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" strokeLinecap="round" />
            </svg>
            Payments
          </Link>
        </nav>

        <div className="px-3 pb-4">
          <div className="px-2 mb-3">
            <p className="text-[13px] font-medium truncate" style={{ color: "var(--fg)" }}>
              {user.fullName}
            </p>
            <p className="text-[11px] truncate" style={{ color: "var(--fg-tertiary)" }}>
              {user.email}
            </p>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="flex items-center justify-end gap-2 border-b px-5 py-3"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border-light)" }}
        >
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-y-auto p-5" style={{ background: "var(--bg)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
