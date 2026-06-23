"use server";

import {
  login,
  register,
  whoAmI,
  updateProfile,
  updatePassword,
} from "@/lib/api/auth";

import {
  RegisterFormData,
  LoginFormData,
} from "@/app/(auth)/_components/schema";

import {
  setTokenCookie,
  storeUserData,
  getTokenCookie,
} from "../cookies";

import { getApiErrorMessage } from "@/lib/utils";

export const handleRegisterUser = async (data: RegisterFormData) => {
  try {
    const result = await register(data);

    if (result.success) {
      return {
        success: true,
        message: result.message,
        data: result.data,
      };
    }

    return {
      success: false,
      message: result.message || "Registration failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error?.message || "Registration failed",
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
  } catch (error: Error | any) {
    return {
      success: false,
      message: error?.message || "Login failed",
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
      message: getApiErrorMessage(
        error,
        "Failed to load user detail"
      ),
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
      await storeUserData(result.data);

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
      message: getApiErrorMessage(
        error,
        "Failed to update profile"
      ),
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
        message: result.message,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to update password",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(
        error,
        "Failed to update password"
      ),
    };
  }
};