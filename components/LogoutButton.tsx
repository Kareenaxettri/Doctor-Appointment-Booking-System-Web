"use client";

import { useAuth } from "@/lib/contexts/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={() => logout()}
      className="w-full rounded-lg border border-white/20 px-3 py-2 text-sm font-medium hover:bg-white/10 transition text-left"
    >
      Sign out
    </button>
  );
}
