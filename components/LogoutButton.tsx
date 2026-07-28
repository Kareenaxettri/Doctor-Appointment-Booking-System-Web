"use client";

import { useAuth } from "@/lib/contexts/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={() => logout()}
      className="w-full rounded-md px-3 py-2 text-sm font-medium transition text-left"
      style={{ border: "1px solid var(--border-light)", background: "transparent", color: "var(--fg-secondary)" }}
    >
      Sign out
    </button>
  );
}
