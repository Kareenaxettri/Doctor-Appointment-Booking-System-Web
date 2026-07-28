"use client";

import { useState } from "react";
import Link from "next/link";
import { handleForgotPassword } from "@/lib/actions/auth-action";
import { forgotPasswordSchema } from "@/app/(auth)/_components/schema";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldError(null);

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message || "Enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await handleForgotPassword(email);

      if (res.success) {
        setMessage(
          "Password reset instructions have been sent to your email address. Please check your inbox and spam folder."
        );
        setResetLink(res.resetUrl || null);
        setEmail("");
        setRetryCount(0);
      } else {
        setError(res.message || "Failed to process your request. Please try again.");
        setRetryCount((c) => c + 1);
      }
    } catch {
      setError("A network error occurred. Please check your connection and try again.");
      setRetryCount((c) => c + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="w-full max-w-md space-y-6 rounded-lg p-8"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}
      >
        <div className="text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg"
            style={{ background: "var(--brand-light)", color: "var(--brand)" }}
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current" strokeWidth="2">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--fg)" }}>
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--fg-secondary)" }}>
            No worries! Enter your registered email address below and we&apos;ll send you a password reset link.
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
            {resetLink && (
              <div
                className="mt-3 rounded-md p-3"
                style={{ border: "1px solid var(--accent)", background: "var(--bg-surface)" }}
              >
                <p className="text-xs font-semibold" style={{ color: "var(--fg-secondary)" }}>
                  Dev mode: no email server is configured yet, so here&apos;s your reset link directly:
                </p>
                <Link
                  href={resetLink}
                  className="mt-1 block break-all text-xs font-medium underline"
                  style={{ color: "var(--brand)" }}
                >
                  {resetLink}
                </Link>
              </div>
            )}
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
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>{error}</p>
                {retryCount < 3 && (
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="mt-2 text-xs font-semibold underline"
                    style={{ color: "var(--brand)" }}
                  >
                    Try again
                  </button>
                )}
                {retryCount >= 3 && (
                  <p className="mt-1 text-xs" style={{ color: "var(--fg-tertiary)" }}>
                    Multiple failed attempts. Please verify your email or contact support.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--fg-secondary)" }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldError) setFieldError(null);
                }}
                placeholder="doctor@example.com"
                required
                autoComplete="email"
                className="w-full rounded-md px-4 py-3 text-sm outline-none transition"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--fg)",
                }}
              />
              {fieldError && (
                <p className="mt-1.5 text-xs" style={{ color: "var(--accent)" }}>{fieldError}</p>
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
                  Sending Reset Link...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}

        {message && (
          <div className="text-center">
            <p className="text-sm mb-4" style={{ color: "var(--fg-secondary)" }}>
              Didn&apos;t receive the email? Check your spam folder or try a different email.
            </p>
            <button
              type="button"
              onClick={() => {
                setMessage(null);
                setResetLink(null);
                setError(null);
              }}
              className="rounded-md px-6 py-3 text-sm font-semibold transition"
              style={{ border: "1px solid var(--border)", background: "var(--bg-surface)", color: "var(--fg)" }}
            >
              Send to a different email
            </button>
          </div>
        )}

        <div
          className="border-t pt-4 text-center text-sm"
          style={{ borderColor: "var(--border-light)", color: "var(--fg-secondary)" }}
        >
          Remember your password?{" "}
          <Link href="/login" className="font-bold" style={{ color: "var(--brand)" }}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
