"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  UpdateProfileFormData,
  updateProfileSchema,
} from "@/app/(auth)/_components/schema";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getInitials, getProfileImageUrl } from "@/lib/utils";

export type ProfileUser = {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  contactNumber?: string | null;
  gender?: "male" | "female" | "other" | null;
  profileImage?: string | null;
  role?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8089";

function getClientToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth_token="));
  return match ? match.split("=")[1] : null;
}

export default function ProfileForm({
  initialUser,
}: {
  initialUser: ProfileUser;
}) {
  const router = useRouter();
  const { setUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: initialUser.fullName ?? "",
      email: initialUser.email ?? "",
      contactNumber: initialUser.contactNumber ?? initialUser.phone ?? "",
      gender: (initialUser.gender as "male" | "female" | "other") ?? "male",
    },
  });

  const avatarSrc =
    imagePreview || getProfileImageUrl(initialUser.profileImage);

  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onCancel = () => {
    reset({
      fullName: initialUser.fullName ?? "",
      email: initialUser.email ?? "",
      contactNumber: initialUser.contactNumber ?? initialUser.phone ?? "",
      gender: (initialUser.gender as "male" | "female" | "other") ?? "male",
    });
    setImageFile(null);
    setImagePreview(null);
    setServerError("");
    setIsEditing(false);
  };

  const onSubmit = (data: UpdateProfileFormData) => {
    setServerError("");
    setSuccessMessage("");

    startTransition(async () => {
      try {
        const token = getClientToken();

        if (!token) {
          setServerError("Not authenticated. Please log in again.");
          return;
        }

        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        formData.append("contactNumber", data.contactNumber);
        formData.append("gender", data.gender);
        if (imageFile) {
          formData.append("profileImage", imageFile);
        }

        const res = await fetch(`${API_BASE}/api/v1/users/profile`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const result = await res.json();

        if (result.success) {
          setSuccessMessage(result.message || "Profile updated successfully");
          setIsEditing(false);
          setImageFile(null);
          setImagePreview(null);

          // Update AuthContext user so topbar avatar refreshes immediately
          setUser((prev: any) => ({
            ...prev,
            ...result.data,
          }));

          router.refresh();
        } else {
          setServerError(result.message || "Failed to update profile");
        }
      } catch (err: any) {
        setServerError(err?.message || "Something went wrong");
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[#1d2b36]">
          Personal Information
        </h2>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-sm font-semibold text-white bg-[#2f6f7e] hover:bg-[#285c68] rounded-full px-4 py-2 transition"
          >
            ✎ Edit Profile
          </button>
        )}
      </div>

      {successMessage && !isEditing && (
        <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-700 text-sm">
          {successMessage}
        </div>
      )}
      {serverError && (
        <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-600 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={initialUser.fullName}
                className="w-20 h-20 rounded-2xl object-cover border border-gray-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-[#2f6f7e] text-white flex items-center justify-center text-2xl font-semibold">
                {getInitials(initialUser.fullName)}
              </div>
            )}
            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#2f6f7e] text-white text-sm flex items-center justify-center border-2 border-white"
                aria-label="Change profile photo"
              >
                📷
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onPickImage}
              className="hidden"
            />
          </div>
          <div>
            <p className="font-semibold text-[#1d2b36]">
              {initialUser.fullName}
            </p>
            <p className="text-sm text-gray-400 capitalize">
              {initialUser.role || "Member"}
            </p>
            {isEditing && (
              <p className="text-xs text-gray-400 mt-1">
                Tap the camera icon to change your photo
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Full Name" error={errors.fullName?.message}>
            <input
              type="text"
              disabled={!isEditing}
              {...register("fullName")}
              className={inputClass(isEditing)}
            />
          </Field>

          <Field label="Email Address" error={errors.email?.message}>
            <input
              type="email"
              disabled={!isEditing}
              {...register("email")}
              className={inputClass(isEditing)}
            />
          </Field>

          <Field label="Phone Number" error={errors.contactNumber?.message}>
            <input
              type="text"
              disabled={!isEditing}
              {...register("contactNumber")}
              className={inputClass(isEditing)}
            />
          </Field>

          <Field label="Gender" error={errors.gender?.message}>
            <select
              disabled={!isEditing}
              {...register("gender")}
              className={inputClass(isEditing)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </div>

        {isEditing && (
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="bg-[#2f6f7e] hover:bg-[#285c68] text-white text-sm font-semibold rounded-2xl px-6 py-3 transition disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="text-sm font-semibold text-gray-500 border border-gray-200 rounded-2xl px-6 py-3 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

function inputClass(editable: boolean) {
  return `w-full rounded-2xl px-4 py-3 text-sm border outline-none transition ${
    editable
      ? "bg-[#f4f7fb] border-gray-200 text-gray-800 focus:border-[#2f6f7e] focus:ring-2 focus:ring-[#2f6f7e]/20"
      : "bg-white border-transparent text-[#1d2b36] font-medium"
  }`;
}