"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getProfileImageUrl, getInitials } from "@/lib/utils";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { href: "/dashboard", label: "Find Doctors", icon: SearchDoctorIcon },
  { href: "/appointments", label: "My Appointments", icon: CalendarIcon },
  { href: "/favourites", label: "Favorites", icon: HeartIcon },
  { href: "/payments", label: "Payments", icon: WalletIcon },
  { href: "/profile", label: "Profile", icon: UserIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

const adminNavItem = { href: "/admin/users", label: "Admin Panel", icon: ShieldIcon };

export default function AppShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const avatarUrl = getProfileImageUrl(user?.profileImage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminSection = pathname.startsWith("/admin");
  const items = isAdminSection
    ? [adminNavItem]
    : user?.role === "admin"
      ? [...navItems, adminNavItem]
      : navItems;

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden w-60 flex-col border-r md:flex"
        style={{ background: "var(--bg-sidebar)", borderColor: "var(--border-light)" }}
      >
        <div className="px-5 py-5 border-b" style={{ borderColor: "var(--border-light)" }}>
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold"
              style={{ background: "var(--brand)", color: "var(--fg-inverse)" }}
            >
              M
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--fg)" }}>MediClick</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition"
                style={{
                  background: active ? "var(--brand-light)" : "transparent",
                  color: active ? "var(--brand)" : "var(--fg-secondary)",
                }}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition"
            style={{ color: "var(--fg-tertiary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <LogoutSmallIcon className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header
          className="flex items-center justify-between gap-4 border-b px-5 py-3"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border-light)" }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-md md:hidden transition"
              style={{ color: "var(--fg-secondary)" }}
              aria-label="Toggle menu"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                )}
              </svg>
            </button>

            <p className="page-title hidden sm:block">{title}</p>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Link href="/profile" className="flex items-center gap-2.5 rounded-md px-2 py-1.5 transition"
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <div className="hidden text-right sm:block">
                <p className="text-[13px] font-medium" style={{ color: "var(--fg)" }}>{user?.fullName || "..."}</p>
                <p className="text-[11px]" style={{ color: "var(--fg-tertiary)" }}>{user?.role === "admin" ? "Administrator" : "Member"}</p>
              </div>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.fullName || "Profile"}
                  className="h-8 w-8 rounded-full object-cover"
                  style={{ border: "1px solid var(--border)" }}
                />
              ) : (
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
                  style={{ background: "var(--brand)", color: "var(--fg-inverse)" }}
                >
                  {getInitials(user?.fullName)}
                </div>
              )}
            </Link>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.3)" }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <div
              className="absolute left-0 top-0 bottom-0 w-64 flex flex-col animate-fade-in"
              style={{ background: "var(--bg-sidebar)", borderRight: "1px solid var(--border-light)" }}
            >
              <div className="px-4 py-4 border-b flex items-center gap-2.5" style={{ borderColor: "var(--border-light)" }}>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold"
                  style={{ background: "var(--brand)", color: "var(--fg-inverse)" }}
                >
                  M
                </div>
                <p className="text-sm font-semibold" style={{ color: "var(--fg)" }}>MediClick</p>
              </div>
              <nav className="flex-1 px-3 py-3 space-y-0.5">
                {items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition"
                      style={{
                        background: active ? "var(--brand-light)" : "transparent",
                        color: active ? "var(--brand)" : "var(--fg-secondary)",
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="px-3 pb-4">
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition"
                  style={{ color: "var(--fg-tertiary)", background: "var(--bg-hover)" }}
                >
                  <LogoutSmallIcon className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-5 md:p-6" style={{ background: "var(--bg)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function SearchDoctorIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 11a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="2" />
      <path d="M4 19c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="17.5" cy="14.5" r="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M19.4 16.4L21 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 10h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 10h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M19.4 13a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.55V19a2 2 0 11-4 0v-.09a1.7 1.7 0 00-1-1.55 1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.7 1.7 0 00.34-1.87 1.7 1.7 0 00-1.55-1H3a2 2 0 110-4h.09a1.7 1.7 0 001.55-1 1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06a1.7 1.7 0 001.87.34h0A1.7 1.7 0 0010 3.09V3a2 2 0 114 0v.09a1.7 1.7 0 001 1.55 1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06a1.7 1.7 0 00-.34 1.87v0a1.7 1.7 0 001.55 1H21a2 2 0 110 4h-.09a1.7 1.7 0 00-1.55 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogoutSmallIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}