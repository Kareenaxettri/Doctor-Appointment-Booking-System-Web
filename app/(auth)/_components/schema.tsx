import { z } from "zod";

// ---- Login ----
export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginFormData = z.infer<typeof loginSchema>;

// ---- Register ----
export const registerSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Enter a valid email address"),
    contactNumber: z.string().min(7, "Contact number is required"),
    gender: z.string().min(1, "Gender is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterFormData = z.infer<typeof registerSchema>;

// ---- Update profile (matches ProfileForm.tsx fields) ----
export const updateProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  contactNumber: z.string().min(7, "Enter a valid contact number"),
  gender: z.enum(["male", "female", "other"]),
});
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

// ---- Update password (matches PasswordForm.tsx fields) ----
export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmNewPassword: z.string().min(6, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
