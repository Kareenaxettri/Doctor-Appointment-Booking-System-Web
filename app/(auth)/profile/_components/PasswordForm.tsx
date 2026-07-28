"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  UpdatePasswordFormData,
  updatePasswordSchema,
} from "@/app/(auth)/_components/schema";
import { handleUpdatePassword } from "@/lib/actions/auth-action";

export default function PasswordForm() {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = (data: UpdatePasswordFormData) => {
    setServerError("");
    setSuccessMessage("");

    startTransition(async () => {
      const result = await handleUpdatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (result.success) {
        setSuccessMessage(result.message || "Password updated successfully");
        reset();
      } else {
        setServerError(result.message || "Failed to update password");
      }
    });
  };

  return (
    <div className="card p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: "var(--fg)" }}>Change Password</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--fg-secondary)" }}>Use a strong password to protect your healthcare account.</p>
      </div>

      {successMessage && (
        <div
          className="mb-4 rounded-2xl p-4 text-sm font-medium"
          style={{ background: "color-mix(in srgb, var(--success) 10%, transparent)", color: "var(--success)", border: "1px solid color-mix(in srgb, var(--success) 20%, transparent)" }}
        >
          {successMessage}
        </div>
      )}
      {serverError && (
        <div
          className="mb-4 rounded-2xl p-4 text-sm font-medium"
          style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}
        >
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--fg-secondary)" }}>
            Current Password
          </label>
          <input
            type="password"
            placeholder="Enter current password"
            {...register("currentPassword")}
            className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition"
            style={{ border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--fg)" }}
          />
          {errors.currentPassword && (
            <p className="mt-1 text-sm" style={{ color: "var(--accent)" }}>
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--fg-secondary)" }}>
            New Password
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            {...register("newPassword")}
            className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition"
            style={{ border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--fg)" }}
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm" style={{ color: "var(--accent)" }}>
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--fg-secondary)" }}>
            Confirm New Password
          </label>
          <input
            type="password"
            placeholder="Confirm new password"
            {...register("confirmNewPassword")}
            className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition"
            style={{ border: "1px solid var(--border)", background: "var(--bg-input)", color: "var(--fg)" }}
          />
          {errors.confirmNewPassword && (
            <p className="mt-1 text-sm" style={{ color: "var(--accent)" }}>
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isPending}
          className="w-full rounded-2xl px-4 py-3.5 text-sm font-bold transition disabled:opacity-60"
          style={{ background: "var(--brand)", color: "var(--fg-inverse)" }}
        >
          {isPending ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
