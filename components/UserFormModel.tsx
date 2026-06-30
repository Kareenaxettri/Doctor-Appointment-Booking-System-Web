"use client";

import { useEffect, useState } from "react";
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
  const [values, setValues] = useState<UserFormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialUser) {
      setValues({
        fullName: initialUser.fullName || "",
        email: initialUser.email || "",
        contactNumber: initialUser.contactNumber || "",
        gender: initialUser.gender || "male",
        role: initialUser.role || "user",
        password: "",
      });
    } else {
      setValues(emptyForm);
    }
  }, [initialUser]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#1d2b36]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-6">
        <h2 className="text-lg font-semibold text-[#1d2b36]">
          {mode === "create" ? "Add new user" : `Edit ${initialUser?.fullName || "user"}`}
        </h2>
        <p className="text-sm text-[#64748b] mt-1">
          {mode === "create"
            ? "Create an account for a new user or admin."
            : "Update this user's details."}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#1d2b36]">Full name</label>
            <input
              value={values.fullName}
              onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
              className="w-full rounded-lg border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#1d2b36] outline-none focus:ring-2 focus:ring-[#2f6f7e]/30 focus:border-[#2f6f7e]"
              placeholder="Jane Doe"
            />
            {errors.fullName && <p className="text-xs text-[#dc2626] mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#1d2b36]">Email</label>
            <input
              type="email"
              value={values.email}
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
              className="w-full rounded-lg border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#1d2b36] outline-none focus:ring-2 focus:ring-[#2f6f7e]/30 focus:border-[#2f6f7e]"
              placeholder="jane@example.com"
            />
            {errors.email && <p className="text-xs text-[#dc2626] mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[#1d2b36]">Contact number</label>
              <input
                value={values.contactNumber}
                onChange={(e) => setValues((v) => ({ ...v, contactNumber: e.target.value }))}
                className="w-full rounded-lg border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#1d2b36] outline-none focus:ring-2 focus:ring-[#2f6f7e]/30 focus:border-[#2f6f7e]"
                placeholder="98XXXXXXXX"
              />
              {errors.contactNumber && (
                <p className="text-xs text-[#dc2626] mt-1">{errors.contactNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[#1d2b36]">Gender</label>
              <select
                value={values.gender}
                onChange={(e) => setValues((v) => ({ ...v, gender: e.target.value }))}
                className="w-full rounded-lg border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#1d2b36] outline-none focus:ring-2 focus:ring-[#2f6f7e]/30 focus:border-[#2f6f7e] bg-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[#1d2b36]">Role</label>
              <select
                value={values.role}
                onChange={(e) =>
                  setValues((v) => ({ ...v, role: e.target.value as "user" | "admin" }))
                }
                className="w-full rounded-lg border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#1d2b36] outline-none focus:ring-2 focus:ring-[#2f6f7e]/30 focus:border-[#2f6f7e] bg-white"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[#1d2b36]">
                Password {mode === "edit" && <span className="text-[#64748b] font-normal">(optional)</span>}
              </label>
              <input
                type="password"
                value={values.password}
                onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
                className="w-full rounded-lg border border-[#e2e8f0] px-3.5 py-2.5 text-sm text-[#1d2b36] outline-none focus:ring-2 focus:ring-[#2f6f7e]/30 focus:border-[#2f6f7e]"
                placeholder={mode === "edit" ? "Leave blank to keep current" : "••••••••"}
              />
              {errors.password && <p className="text-xs text-[#dc2626] mt-1">{errors.password}</p>}
            </div>
          </div>

          {serverError && (
            <div className="rounded-lg bg-[#dc2626]/10 border border-[#dc2626]/20 text-[#dc2626] text-sm px-3.5 py-2.5">
              {serverError}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium border border-[#e2e8f0] text-[#1d2b36] hover:bg-[#f4f7fb] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg px-4 py-2.5 text-sm font-medium bg-[#2f6f7e] text-white hover:bg-[#3d8a9c] transition disabled:opacity-60"
            >
              {submitting ? "Saving…" : mode === "create" ? "Create user" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}