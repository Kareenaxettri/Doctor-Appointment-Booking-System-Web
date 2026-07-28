"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerSchema,
  RegisterFormData,
} from "@/app/(auth)/_components/schema";

import { handleRegisterUser } from "@/lib/actions/auth-action";
import ThemeToggle from "@/components/ThemeToggle";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    setError("");

    if (!agreedToTerms) {
      setError("You must agree to the terms and conditions to create an account.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await handleRegisterUser(data);

        if (result.success) {
          router.push("/login");
        } else {
          setError(result.message || "Registration failed");
        }
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "Registration failed");
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-md">
        <div className="card overflow-hidden">
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

          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold" style={{ color: "var(--fg)" }}>Create account</h1>
              <p className="mt-1 text-sm" style={{ color: "var(--fg-secondary)" }}>Join MediClick to book doctor appointments</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="rounded-md border px-3 py-2.5 text-sm" style={{ background: "#fef2f2", borderColor: "var(--accent)", color: "var(--accent)" }}>
                  {error}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-[13px] font-medium" style={{ color: "var(--fg-secondary)" }}>Full name</label>
                <input type="text" placeholder="Your full name" {...register("fullName")} className="input-field" />
                {errors.fullName && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs" style={{ color: "var(--accent)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium" style={{ color: "var(--fg-secondary)" }}>Email address</label>
                <input type="email" placeholder="you@example.com" {...register("email")} className="input-field" />
                {errors.email && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs" style={{ color: "var(--accent)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium" style={{ color: "var(--fg-secondary)" }}>Phone number</label>
                  <input type="text" placeholder="98XXXXXXXX" {...register("contactNumber")} className="input-field" />
                  {errors.contactNumber && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs" style={{ color: "var(--accent)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {errors.contactNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-medium" style={{ color: "var(--fg-secondary)" }}>Gender</label>
                  <select defaultValue="" {...register("gender")} className="input-field">
                    <option value="" disabled>Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs" style={{ color: "var(--accent)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium" style={{ color: "var(--fg-secondary)" }}>Password</label>
                <input type="password" placeholder="Create a password" {...register("password")} className="input-field" />
                {errors.password && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs" style={{ color: "var(--accent)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium" style={{ color: "var(--fg-secondary)" }}>Confirm password</label>
                <input type="password" placeholder="Repeat your password" {...register("confirmPassword")} className="input-field" />
                {errors.confirmPassword && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs" style={{ color: "var(--accent)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (error === "You must agree to the terms and conditions to create an account.") setError("");
                  }}
                  className="mt-0.5 h-4 w-4 rounded"
                  style={{ accentColor: "var(--brand)" }}
                />
                <span className="text-[13px]" style={{ color: "var(--fg-secondary)" }}>
                  I agree to the terms and conditions
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting || isPending}
                className="btn-primary w-full py-3"
              >
                {isPending ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm" style={{ color: "var(--fg-secondary)" }}>
              Already have an account?{" "}
              <Link href="/login" className="font-semibold" style={{ color: "var(--brand)" }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
