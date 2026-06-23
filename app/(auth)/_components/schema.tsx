// app/(auth)/_components/schema.ts
import { z } from "zod";

// NOTE: fields here are kept in sync with the backend's Mongoose User model
// (fullName, contactNumber, email, gender, password are required there).
export const registerSchema = z.object({
    fullName: z.string("Full name must be string")
        .min(2, "Full name must be at least 2 characters long"),
    contactNumber: z.string("Phone number must be string")
        .min(7, "Enter a valid phone number"),
    email: z.email("Invalid email address"),
    gender: z.enum(["male", "female", "other"], "Please select a gender"),
    password: z.string("Password must be string")
        .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string("Confirm Password must be string")
        .min(6, "Confirm Password must be at least 6 characters long")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string("Password must be string")
        .min(6, "Password must be at least 6 characters long")
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Used on the Profile page to update personal information.
// profileImage is handled separately as a File (see ProfileForm) since
// react-hook-form + a single FileList field is awkward to validate with zod.
export const updateProfileSchema = z.object({
    fullName: z.string("Full name must be string")
        .min(2, "Full name must be at least 2 characters long"),
    email: z.email("Invalid email address"),
    contactNumber: z.string("Phone number must be string")
        .min(7, "Enter a valid phone number"),
    gender: z.enum(["male", "female", "other"], "Please select a gender"),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

// Used on the Profile page's "Change Password" form.
export const updatePasswordSchema = z.object({
    currentPassword: z.string("Current password must be string")
        .min(6, "Password must be at least 6 characters long"),
    newPassword: z.string("New password must be string")
        .min(6, "New password must be at least 6 characters long"),
    confirmNewPassword: z.string("Confirm password must be string")
        .min(6, "Confirm password must be at least 6 characters long"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"]
});

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
