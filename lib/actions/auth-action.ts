"use server";

import {
  login,
  register,
  whoAmI,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
} from "@/lib/api/auth";

import {
  RegisterFormData,
  LoginFormData,
} from "@/app/(auth)/_components/schema";

import {
  setTokenCookie,
  storeUserData,
  getTokenCookie,
  getUserData,
} from "../cookies";

import { getApiErrorMessage } from "@/lib/utils";

export const handleRegisterUser = async (data: RegisterFormData) => {
  try {
    const result = await register(data);

    if (result.success) {
      return {
        success: true,
        message: result.message || "Registration successful",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Registration failed",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Registration failed"),
    };
  }
};

export const handleLoginUser = async (data: LoginFormData) => {
  try {
    const result = await login(data);

    if (result.success) {
      const user = result.data.user;
      const token = result.data.token;

      await setTokenCookie(token);
      await storeUserData(user);

      return {
        success: true,
        message: result.message,
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Login failed",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Login failed"),
    };
  }
};

export const handleGetCurrentUser = async () => {
  try {
    const token = await getTokenCookie();

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const result = await whoAmI(token);

    if (result.success) {
      return {
        success: true,
        message: result.message,
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to load user detail",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to load user detail"),
    };
  }
};

export const handleUpdateProfile = async (formData: FormData) => {
  try {
    const token = await getTokenCookie();

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const result = await updateProfile(token, formData);

    if (result.success) {
      if (result.data) {
        const existing = (await getUserData()) as Record<string, unknown> | null;
        const merged = { ...(existing || {}), ...result.data };
        if (!merged.profileImage && existing?.profileImage) {
          merged.profileImage = existing.profileImage;
        }
        await storeUserData(merged);
      }

      return {
        success: true,
        message: result.message,
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to update profile",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to update profile"),
    };
  }
};

export const handleUpdatePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const token = await getTokenCookie();

    if (!token) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const result = await updatePassword(token, data);

    if (result.success) {
      return {
        success: true,
        message: result.message || "Password updated successfully",
      };
    }

    return {
      success: false,
      message: result.message || "Failed to update password",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to update password"),
    };
  }
};

export const handleForgotPassword = async (email: string) => {
  try {
    const result = await forgotPassword(email);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to send reset email",
      };
    }

    return {
      success: true,
      message: result.message || "Password reset instructions sent to your email",
      // Only present when SMTP isn't configured on the backend (dev fallback).
      resetUrl: result.data?.resetUrl as string | undefined,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to send reset email"),
    };
  }
};

export const handleResetPassword = async (data: { token: string; newPassword: string }) => {
  try {
    const result = await resetPassword(data);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to reset password",
      };
    }

    return {
      success: true,
      message: result.message || "Password reset successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "Failed to reset password"),
    };
  }
};
