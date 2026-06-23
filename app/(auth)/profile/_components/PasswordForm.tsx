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
      // same API + action as the profile update, just a different payload
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
    <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
      <h2 className="text-lg font-bold text-[#1d2b36] mb-6">
        Change Password
      </h2>

      {successMessage && (
        <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-700 text-sm">
          {successMessage}
        </div>
      )}
      {serverError && (
        <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-600 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Current Password
          </label>
          <input
            type="password"
            placeholder="Enter current password"
            {...register("currentPassword")}
            className="w-full bg-[#f4f7fb] border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#2f6f7e] focus:ring-2 focus:ring-[#2f6f7e]/20 transition"
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            New Password
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            {...register("newPassword")}
            className="w-full bg-[#f4f7fb] border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#2f6f7e] focus:ring-2 focus:ring-[#2f6f7e]/20 transition"
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            placeholder="Confirm new password"
            {...register("confirmNewPassword")}
            className="w-full bg-[#f4f7fb] border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#2f6f7e] focus:ring-2 focus:ring-[#2f6f7e]/20 transition"
          />
          {errors.confirmNewPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isPending}
          className="w-full bg-[#2f6f7e] hover:bg-[#285c68] text-white text-sm font-semibold rounded-2xl py-3 transition disabled:opacity-50"
        >
          {isPending ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
