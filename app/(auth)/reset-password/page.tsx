"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { handleResetPassword } from "@/lib/actions/auth-action";
import { resetPasswordSchema } from "@/app/(auth)/_components/schema";

function PasswordRequirements({ password }: { password: string }) {
  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
  ];

  return (
    <ul className="mt-2 space-y-1">
      {requirements.map((req) => (
        <li key={req.label} className="flex items-center gap-1.5 text-xs">
          {req.met ? (
            <svg className="h-3.5 w-3.5" fill="none" stroke="var(--success)" viewBox="0 0 24 24" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" fill="none" stroke="var(--fg-tertiary)" viewBox="0 0 24 24" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
            </svg>
          )}
          <span style={{ color: req.met ? "var(--success)" : "var(--fg-tertiary)" }}>{req.label}</span>
        </li>
      ))}
    </ul>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!token) {
      setError("Invalid or missing password reset token.");
      return;
    }

    const parsed = resetPasswordSchema.safeParse({ newPassword, confirmPassword });
    if (!parsed.success) {
      const errors: typeof fieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as "newPassword" | "confirmPassword";
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const res = await handleResetPassword({ token, newPassword });
      setLoading(false);

      if (res.success) {
        setMessage("Your password has been reset successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login?reset=success");
        }, 2500);
      } else {
        setError(res.message || "Failed to reset password. The link may have expired.");
      }
    } catch {
      setLoading(false);
      setError("A network error occurred. Please check your connection and try again.");
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg"
          style={{ background: "var(--bg-surface)", color: "var(--accent)" }}
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current" strokeWidth="2">
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-xl font-bold" style={{ color: "var(--fg)" }}>Invalid Reset Link</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--fg-secondary)" }}>
          This password reset link is invalid or has expired. Please request a new link.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-block rounded-md px-6 py-3 text-sm font-bold text-white transition"
          style={{ background: "var(--brand)" }}
        >
          Request New Link
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center">
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg"
          style={{ background: "var(--brand-light)", color: "var(--brand)" }}
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current" strokeWidth="2">
            <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--fg)" }}>
          Create New Password
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--fg-secondary)" }}>
          Enter your new password below to secure your account.
        </p>
      </div>

      {message && (
        <div
          className="rounded-md p-4"
          style={{ border: "1px solid var(--success)", background: "var(--bg-surface)" }}
        >
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" stroke="var(--success)" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm font-medium" style={{ color: "var(--success)" }}>{message}</p>
          </div>
        </div>
      )}

      {error && (
        <div
          className="rounded-md p-4"
          style={{ border: "1px solid var(--accent)", background: "var(--bg-surface)" }}
        >
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" stroke="var(--accent)" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>{error}</p>
          </div>
        </div>
      )}

      {!message && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--fg-secondary)" }}>
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (fieldErrors.newPassword) setFieldErrors((p) => ({ ...p, newPassword: undefined }));
                }}
                placeholder="Enter new password"
                autoComplete="new-password"
                className="w-full rounded-md px-4 py-3 pr-11 text-sm outline-none transition"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--fg)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition"
                style={{ color: "var(--fg-tertiary)" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.newPassword && (
              <p className="mt-1.5 text-xs" style={{ color: "var(--accent)" }}>{fieldErrors.newPassword}</p>
            )}
            <PasswordRequirements password={newPassword} />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--fg-secondary)" }}>
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) setFieldErrors((p) => ({ ...p, confirmPassword: undefined }));
                }}
                placeholder="Re-enter new password"
                autoComplete="new-password"
                className="w-full rounded-md px-4 py-3 pr-11 text-sm outline-none transition"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--fg)",
                }}
              />
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1.5 text-xs" style={{ color: "var(--accent)" }}>{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md px-4 py-3.5 text-sm font-bold text-white transition disabled:opacity-60"
            style={{ background: "var(--brand)" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Resetting Password...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      )}

      <div
        className="border-t pt-4 text-center text-sm"
        style={{ borderColor: "var(--border-light)", color: "var(--fg-secondary)" }}
      >
        <Link href="/login" className="font-bold" style={{ color: "var(--brand)" }}>
          Back to Login
        </Link>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="w-full max-w-md space-y-6 rounded-lg p-8"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}
      >
        <Suspense fallback={<div className="flex flex-col items-center justify-center py-12" style={{ color: "var(--fg-secondary)" }}>
          <span className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-t-2" style={{ borderColor: "var(--border)", borderTopColor: "var(--brand)" }} />
          <p className="text-sm font-medium">Loading reset form...</p>
        </div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
