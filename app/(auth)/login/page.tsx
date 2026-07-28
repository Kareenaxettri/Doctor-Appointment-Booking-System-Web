"use client";

import Link from "next/link";
import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginFormData, loginSchema } from "@/app/(auth)/_components/schema";
import { handleLoginUser } from "@/lib/actions/auth-action";
import { useAuth } from "@/lib/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

function LoginForm() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";
  const { checkAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    setError("");

    startTransition(async () => {
      try {
        const result = await handleLoginUser(data);

        if (result.success) {
          await checkAuth();

          const role = result.data?.user?.role;

          if (role === "admin") {
            router.push("/admin/users");
          } else {
            router.push("/dashboard");
          }
        } else {
          setError(result.message || "Login failed");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Login failed";
        setError(message);
      }
    });
  };

  return (
    <div className="flex-1 p-8 md:p-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--fg)" }}>Welcome back</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--fg-secondary)" }}>Sign in to your MediClick account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {resetSuccess && (
          <div className="rounded-md border px-3 py-2.5 text-sm" style={{ background: "var(--brand-light)", borderColor: "var(--brand)", color: "var(--brand)" }}>
            Your password has been reset successfully. Please sign in with your new password.
          </div>
        )}

        {error && (
          <div className="rounded-md border px-3 py-2.5 text-sm" style={{ background: "#fef2f2", borderColor: "var(--accent)", color: "var(--accent)" }}>
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-[13px] font-medium" style={{ color: "var(--fg-secondary)" }}>
            Email address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
            className="input-field"
          />
          {errors.email && (
            <p className="mt-1.5 flex items-center gap-1 text-xs" style={{ color: "var(--accent)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-[13px] font-medium" style={{ color: "var(--fg-secondary)" }}>Password</label>
            <Link href="/forgot-password" className="text-xs font-medium" style={{ color: "var(--brand)" }}>
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            {...register("password")}
            className="input-field"
          />
          {errors.password && (
            <p className="mt-1.5 flex items-center gap-1 text-xs" style={{ color: "var(--accent)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isPending}
          className="btn-primary w-full py-3"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm" style={{ color: "var(--fg-secondary)" }}>
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold" style={{ color: "var(--brand)" }}>
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-md">
        <div className="card p-0 overflow-hidden">
          {/* Brand header */}
          <div className="border-b px-8 pt-8 pb-0" style={{ borderColor: "var(--border-light)" }}>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold"
                  style={{ background: "var(--brand)", color: "var(--fg-inverse)" }}
                >
                  M
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--fg)" }}>MediClick</span>
              </div>
              <ThemeToggle />
            </div>
          </div>

          <Suspense fallback={
            <div className="flex items-center justify-center p-12">
              <span className="h-6 w-6 animate-spin rounded-full border-2" style={{ borderColor: "var(--border)", borderTopColor: "var(--brand)" }} />
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
