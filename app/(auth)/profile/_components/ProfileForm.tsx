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
import { handleUpdateProfile } from "@/lib/actions/auth-action";

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
  const [imgError, setImgError] = useState(false);
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

  const avatarSrc = imagePreview || getProfileImageUrl(initialUser.profileImage);
  const showAvatarImage = Boolean(avatarSrc) && !imgError;

  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setServerError("Image must be less than 5MB");
      return;
    }
    setImgError(false);
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
    setImgError(false);
    setServerError("");
    setIsEditing(false);
  };

  const onSubmit = (data: UpdateProfileFormData) => {
    setServerError("");
    setSuccessMessage("");

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        formData.append("contactNumber", data.contactNumber);
        formData.append("gender", data.gender);
        if (imageFile) {
          formData.append("profileImage", imageFile);
        }

        const result = await handleUpdateProfile(formData);

        if (result.success) {
          setSuccessMessage(result.message || "Profile updated successfully");
          setIsEditing(false);

          const serverImageUrl = result.data?.profileImage
            ? getProfileImageUrl(result.data.profileImage)
            : null;
          setImgError(false);
          setImagePreview(serverImageUrl || (imageFile ? URL.createObjectURL(imageFile) : null));
          setImageFile(serverImageUrl ? null : imageFile);

          if (result.data) {
            setUser((prev) => ({
              ...prev,
              ...result.data,
            }));
          }

          router.refresh();
        } else {
          setServerError(result.message || "Failed to update profile");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setServerError(message);
      }
    });
  };

  return (
    <div className="card p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold" style={{ color: "var(--fg)" }}>Personal Information</h2>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="btn-primary btn-hover-scale rounded-full px-5 py-2 text-sm"
          >
            Edit Profile
          </button>
        )}
      </div>

      {successMessage && !isEditing && (
        <div
          className="mb-4 p-3 rounded-xl text-sm font-medium"
          style={{ background: "color-mix(in srgb, var(--success) 10%, transparent)", color: "var(--success)", border: "1px solid color-mix(in srgb, var(--success) 20%, transparent)" }}
        >
          {successMessage}
        </div>
      )}
      {serverError && (
        <div
          className="mb-4 p-3 rounded-xl text-sm font-medium"
          style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}
        >
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {showAvatarImage ? (
              <img
                src={avatarSrc as string}
                alt={initialUser.fullName}
                onError={() => setImgError(true)}
                className="w-20 h-20 rounded-2xl object-cover avatar-hover"
                style={{ border: "2px solid var(--border-light)" }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-semibold avatar-hover"
                style={{ background: "var(--brand)", color: "var(--fg-inverse)" }}
              >
                {getInitials(initialUser.fullName)}
              </div>
            )}
            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full text-white text-sm flex items-center justify-center"
                style={{ background: "var(--brand)", border: "2px solid var(--bg-surface)" }}
                aria-label="Change profile photo"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
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
            <p className="font-semibold" style={{ color: "var(--fg)" }}>{initialUser.fullName}</p>
            <p className="text-sm capitalize" style={{ color: "var(--fg-tertiary)" }}>{initialUser.role || "Member"}</p>
            {isEditing && (
              <p className="text-xs mt-1" style={{ color: "var(--fg-tertiary)" }}>Tap the camera icon to change your photo</p>
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
              style={isEditing
                ? { background: "var(--bg-input)", borderColor: "var(--border)", color: "var(--fg)" }
                : { background: "var(--bg-surface)", color: "var(--fg)" }
              }
            />
          </Field>

          <Field label="Email Address" error={errors.email?.message}>
            <input
              type="email"
              disabled={!isEditing}
              {...register("email")}
              className={inputClass(isEditing)}
              style={isEditing
                ? { background: "var(--bg-input)", borderColor: "var(--border)", color: "var(--fg)" }
                : { background: "var(--bg-surface)", color: "var(--fg)" }
              }
            />
          </Field>

          <Field label="Phone Number" error={errors.contactNumber?.message}>
            <input
              type="text"
              disabled={!isEditing}
              {...register("contactNumber")}
              className={inputClass(isEditing)}
              style={isEditing
                ? { background: "var(--bg-input)", borderColor: "var(--border)", color: "var(--fg)" }
                : { background: "var(--bg-surface)", color: "var(--fg)" }
              }
            />
          </Field>

          <Field label="Gender" error={errors.gender?.message}>
            <select
              disabled={!isEditing}
              {...register("gender")}
              className={inputClass(isEditing)}
              style={isEditing
                ? { background: "var(--bg-input)", borderColor: "var(--border)", color: "var(--fg)" }
                : { background: "var(--bg-surface)", color: "var(--fg)" }
              }
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
              className="btn-primary rounded-2xl px-6 py-3 text-sm disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="btn-secondary rounded-2xl px-6 py-3 text-sm"
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
      <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--fg-tertiary)" }}>
        {label}
      </label>
      {children}
      {error && <p className="text-sm mt-1" style={{ color: "var(--accent)" }}>{error}</p>}
    </div>
  );
}

function inputClass(editable: boolean) {
  return `w-full rounded-2xl px-4 py-3 text-sm border outline-none transition ${
    editable
      ? "focus:ring-2"
      : "border-transparent font-medium"
  }`;
}
