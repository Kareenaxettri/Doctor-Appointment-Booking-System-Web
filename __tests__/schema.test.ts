import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  updatePasswordSchema,
} from "@/app/(auth)/_components/schema";

describe("Zod Schemas", () => {
  describe("loginSchema", () => {
    it("accepts valid login data", () => {
      const result = loginSchema.safeParse({ email: "test@example.com", password: "secret123" });
      expect(result.success).toBe(true);
    });

    it("rejects invalid email", () => {
      const result = loginSchema.safeParse({ email: "not-an-email", password: "secret123" });
      expect(result.success).toBe(false);
    });

    it("rejects short password", () => {
      const result = loginSchema.safeParse({ email: "test@example.com", password: "12345" });
      expect(result.success).toBe(false);
    });
  });

  describe("registerSchema", () => {
    it("accepts valid registration data", () => {
      const result = registerSchema.safeParse({
        fullName: "John Doe",
        email: "john@example.com",
        contactNumber: "9841234567",
        gender: "male",
        password: "Password1",
        confirmPassword: "Password1",
      });
      expect(result.success).toBe(true);
    });

    it("rejects mismatched passwords", () => {
      const result = registerSchema.safeParse({
        fullName: "John Doe",
        email: "john@example.com",
        contactNumber: "9841234567",
        gender: "male",
        password: "Password1",
        confirmPassword: "Password2",
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing fields", () => {
      const result = registerSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe("forgotPasswordSchema", () => {
    it("accepts valid email", () => {
      const result = forgotPasswordSchema.safeParse({ email: "user@example.com" });
      expect(result.success).toBe(true);
    });

    it("rejects invalid email", () => {
      const result = forgotPasswordSchema.safeParse({ email: "invalid" });
      expect(result.success).toBe(false);
    });
  });

  describe("resetPasswordSchema", () => {
    it("accepts valid new password", () => {
      const result = resetPasswordSchema.safeParse({
        newPassword: "StrongPass1",
        confirmPassword: "StrongPass1",
      });
      expect(result.success).toBe(true);
    });

    it("rejects weak password (no uppercase)", () => {
      const result = resetPasswordSchema.safeParse({
        newPassword: "weakpass1",
        confirmPassword: "weakpass1",
      });
      expect(result.success).toBe(false);
    });

    it("rejects weak password (no number)", () => {
      const result = resetPasswordSchema.safeParse({
        newPassword: "WeakPassword",
        confirmPassword: "WeakPassword",
      });
      expect(result.success).toBe(false);
    });

    it("rejects mismatched passwords", () => {
      const result = resetPasswordSchema.safeParse({
        newPassword: "StrongPass1",
        confirmPassword: "StrongPass2",
      });
      expect(result.success).toBe(false);
    });

    it("rejects password shorter than 8 chars", () => {
      const result = resetPasswordSchema.safeParse({
        newPassword: "Sho1",
        confirmPassword: "Sho1",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updateProfileSchema", () => {
    it("accepts valid profile data", () => {
      const result = updateProfileSchema.safeParse({
        fullName: "Jane Doe",
        email: "jane@example.com",
        contactNumber: "9841234567",
        gender: "female",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid gender value", () => {
      const result = updateProfileSchema.safeParse({
        fullName: "Jane Doe",
        email: "jane@example.com",
        contactNumber: "9841234567",
        gender: "invalid",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updatePasswordSchema", () => {
    it("accepts valid password update", () => {
      const result = updatePasswordSchema.safeParse({
        currentPassword: "OldPass1",
        newPassword: "NewPass1",
        confirmNewPassword: "NewPass1",
      });
      expect(result.success).toBe(true);
    });

    it("rejects mismatched new passwords", () => {
      const result = updatePasswordSchema.safeParse({
        currentPassword: "OldPass1",
        newPassword: "NewPass1",
        confirmNewPassword: "NewPass2",
      });
      expect(result.success).toBe(false);
    });

    it("rejects weak new password", () => {
      const result = updatePasswordSchema.safeParse({
        currentPassword: "OldPass1",
        newPassword: "weak",
        confirmNewPassword: "weak",
      });
      expect(result.success).toBe(false);
    });
  });
});
