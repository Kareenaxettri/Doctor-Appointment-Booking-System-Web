"use client";

import { useState } from "react";
import { AdminUser } from "@/lib/api/admin-users";

export interface UserFormValues {
  fullName: string;
  email: string;
  contactNumber: string;
  gender: string;
  role: "user" | "admin";
  password: string;
}

interface Props {
  mode: "create" | "edit";
  initialUser?: AdminUser | null;
  submitting: boolean;
  serverError?: string | null;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
}

const emptyForm: UserFormValues = {
  fullName: "",
  email: "",
  contactNumber: "",
  gender: "male",
  role: "user",
  password: "",
};

export default function UserFormModal({
  mode,
  initialUser,
  submitting,
  serverError,
  onClose,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<UserFormValues>(() => {
    if (initialUser) {
      return {
        fullName: initialUser.fullName || "",
        email: initialUser.email || "",
        contactNumber: initialUser.contactNumber || "",
        gender: initialUser.gender || "male",
        role: initialUser.role || "user",
        password: "",
      };
    }
    return emptyForm;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!values.fullName.trim()) next.fullName = "Full name is required";
    if (!values.email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "Enter a valid email address";
    }
    if (!values.contactNumber.trim() || values.contactNumber.trim().length < 7) {
      next.contactNumber = "Enter a valid contact number";
    }
    if (mode === "create" && values.password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }
    if (mode === "edit" && values.password && values.password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  };

  const inputStyle = {
    border: "1px solid var(--border)",
    background: "var(--bg-surface)",
    color: "var(--fg)",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.4)" }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md rounded-lg p-6"
        style={{ background: "var(--bg-surface-raised)", border: "1px solid var(--border-light)", boxShadow: "var(--shadow-sm)" }}
      >
        <h2 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>
          {mode === "create" ? "Add new user" : `Edit ${initialUser?.fullName || "user"}`}
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--fg-secondary)" }}>
          {mode === "create"
            ? "Create an account for a new user or admin."
            : "Update this user's details."}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--fg)" }}>Full name</label>
            <input
              value={values.fullName}
              onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
              className="w-full rounded-md px-3.5 py-2.5 text-sm outline-none"
              style={inputStyle}
              placeholder="Jane Doe"
            />
            {errors.fullName && <p className="text-xs mt-1" style={{ color: "var(--accent)" }}>{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--fg)" }}>Email</label>
            <input
              type="email"
              value={values.email}
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
              className="w-full rounded-md px-3.5 py-2.5 text-sm outline-none"
              style={inputStyle}
              placeholder="jane@example.com"
            />
            {errors.email && <p className="text-xs mt-1" style={{ color: "var(--accent)" }}>{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--fg)" }}>Contact number</label>
              <input
                value={values.contactNumber}
                onChange={(e) => setValues((v) => ({ ...v, contactNumber: e.target.value }))}
                className="w-full rounded-md px-3.5 py-2.5 text-sm outline-none"
                style={inputStyle}
                placeholder="98XXXXXXXX"
              />
              {errors.contactNumber && (
                <p className="text-xs mt-1" style={{ color: "var(--accent)" }}>{errors.contactNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--fg)" }}>Gender</label>
              <select
                value={values.gender}
                onChange={(e) => setValues((v) => ({ ...v, gender: e.target.value }))}
                className="w-full rounded-md px-3.5 py-2.5 text-sm outline-none"
                style={inputStyle}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--fg)" }}>Role</label>
              <select
                value={values.role}
                onChange={(e) =>
                  setValues((v) => ({ ...v, role: e.target.value as "user" | "admin" }))
                }
                className="w-full rounded-md px-3.5 py-2.5 text-sm outline-none"
                style={inputStyle}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--fg)" }}>
                Password {mode === "edit" && <span style={{ color: "var(--fg-secondary)", fontWeight: 400 }}>(optional)</span>}
              </label>
              <input
                type="password"
                value={values.password}
                onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
                className="w-full rounded-md px-3.5 py-2.5 text-sm outline-none"
                style={inputStyle}
                placeholder={mode === "edit" ? "Leave blank to keep current" : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
              />
              {errors.password && <p className="text-xs mt-1" style={{ color: "var(--accent)" }}>{errors.password}</p>}
            </div>
          </div>

          {serverError && (
            <div
              className="rounded-md text-sm px-3.5 py-2.5"
              style={{ background: "var(--accent)", opacity: 0.1, color: "var(--accent)" }}
            >
              {serverError}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2.5 text-sm font-medium transition"
              style={{ border: "1px solid var(--border)", background: "var(--bg-surface)", color: "var(--fg)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md px-4 py-2.5 text-sm font-medium text-white transition disabled:opacity-60"
              style={{ background: "var(--brand)" }}
            >
              {submitting ? "Saving\u2026" : mode === "create" ? "Create user" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
