"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--fg-secondary)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--fg)] ${className || ""}`}
    >
      {theme === "light" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13.36 10.06A6 6 0 015.94 2.64 6 6 0 1013.36 10.06z" />
          <path d="M13.36 10.06V8.5A.5.5 0 0012.86 8h-1.5" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="8" r="3" />
          <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" />
        </svg>
      )}
    </button>
  );
}
