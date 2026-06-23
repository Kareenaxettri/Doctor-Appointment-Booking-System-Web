"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getProfileImageUrl, getInitials } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Find Doctors", icon: SearchDoctorIcon },
  { href: "/appointments", label: "My Appointments", icon: CalendarIcon },
  { href: "/profile", label: "Profile", icon: UserIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

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

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex">
      {/* SIDEBAR */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-8 px-1">
          <div className="w-9 h-9 rounded-xl bg-[#2f6f7e] text-white flex items-center justify-center text-lg font-bold">
            +
          </div>
          <span className="text-lg font-bold text-[#1d2b36]">MediClick</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-[#2f6f7e] text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#1d2b36]"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl bg-[#f4f7fb] p-4">
          <p className="text-sm font-semibold text-[#1d2b36] mb-1">
            Need help?
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Our medical support team is available 24/7.
          </p>
          <button
            type="button"
            onClick={logout}
            className="w-full text-xs font-semibold text-white bg-[#2f6f7e] hover:bg-[#285c68] rounded-xl py-2 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR */}
        <header className="flex items-center gap-4 bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex-1 flex items-center gap-2 bg-[#f4f7fb] rounded-2xl px-4 py-2.5 max-w-md">
            <SearchIcon className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors, specializations, clinics..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
              disabled
            />
          </div>

          <button
            type="button"
            className="w-10 h-10 rounded-full bg-[#f4f7fb] flex items-center justify-center text-gray-500"
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5" />
          </button>

          <Link href="/profile" className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-[#1d2b36] leading-tight">
                {user?.fullName || "..."}
              </p>
              <p className="text-xs text-gray-400 leading-tight">
                {user?.role === "admin" ? "Administrator" : "Member"}
              </p>
            </div>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user?.fullName || "Profile"}
                className="w-10 h-10 rounded-full object-cover border border-gray-100"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#2f6f7e] text-white flex items-center justify-center text-sm font-semibold">
                {getInitials(user?.fullName)}
              </div>
            )}
          </Link>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <h1 className="text-sm font-medium text-gray-400 mb-4">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SearchDoctorIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M9 11a3 3 0 100-6 3 3 0 000 6z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 19c0-2.8 2.2-5 5-5s5 2.2 5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
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

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M19.4 13a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.55V19a2 2 0 11-4 0v-.09a1.7 1.7 0 00-1-1.55 1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.7 1.7 0 00.34-1.87 1.7 1.7 0 00-1.55-1H3a2 2 0 110-4h.09a1.7 1.7 0 001.55-1 1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06a1.7 1.7 0 001.87.34h0A1.7 1.7 0 0010 3.09V3a2 2 0 114 0v.09a1.7 1.7 0 001 1.55 1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06a1.7 1.7 0 00-.34 1.87v0a1.7 1.7 0 001.55 1H21a2 2 0 110 4h-.09a1.7 1.7 0 00-1.55 1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
