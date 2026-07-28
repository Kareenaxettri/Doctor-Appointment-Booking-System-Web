import axiosInstance from "./axios-instance";
import {API} from "./endpoints";
import { getApiErrorMessage } from "@/lib/utils";

interface AuthRegisterData {
  fullName: string;
  email: string;
  contactNumber: string;
  gender: string;
  password: string;
}

interface AuthLoginData {
  email: string;
  password: string;
}

export const register = async (data: AuthRegisterData) => {
    try{
        const response = 
            await axiosInstance.post(API.AUTH.REGISTER,data);
        return response.data;
    }catch(error:unknown){
        throw new Error(
          error instanceof Error ? error.message : 'Registration failed'
        );
    }
}

export const login = async (data: AuthLoginData) => {
    try{
        const response = 
            await axiosInstance.post(API.AUTH.LOGIN,data);
        return response.data;
    }catch(error:unknown){
        throw new Error(
          error instanceof Error ? error.message : 'Login failed'
        );
    }
}

// GET /api/v1/auth/whoami -> protected, needs Bearer token
export const whoAmI = async (token: string) => {
    try {
        const response = await axiosInstance.get(API.AUTH.WHOAMI, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: unknown) {
        throw new Error(getApiErrorMessage(error, 'Failed to load user detail'));
    }
}

// PATCH /api/v1/users/profile -> protected, multipart/form-data (multer on backend)
// `data` is a FormData instance built by the caller (text fields + optional profileImage file)
//
// NOTE: we intentionally use the native `fetch` API here instead of `axiosInstance`.
// Axios does not reliably set the `multipart/form-data; boundary=...` header when given
// a native (Web) FormData object on the server, which meant the uploaded photo (and
// sometimes the rest of the fields) never actually reached the backend. `fetch` handles
// native FormData correctly in both the browser and Node, so this avoids that issue.
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

export const updateProfile = async (token: string, data: FormData) => {
    try {
        const response = await fetch(`${BASE_URL}${API.AUTH.UPDATE}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: data,
        });

        const json = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(json?.message || "Failed to update profile");
        }

        return json;
    } catch (error: unknown) {
        throw new Error(getApiErrorMessage(error, 'Failed to update profile'));
    }
}

// PATCH /api/v1/auth/update-password -> protected, JSON body
export const updatePassword = async (
    token: string,
    data: { currentPassword: string; newPassword: string }
) => {
    try {
        const response = await axiosInstance.patch(API.AUTH.UPDATE_PASSWORD, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: unknown) {
        throw new Error(getApiErrorMessage(error, 'Failed to update password'));
    }
}

export const forgotPassword = async (email: string) => {
    try {
        const response = await axiosInstance.post(API.AUTH.FORGOT_PASSWORD, { email }, {
            timeout: 30000,
        });
        return response.data;
    } catch (error: unknown) {
        throw new Error(getApiErrorMessage(error, 'Failed to send password reset email'));
    }
}

export const resetPassword = async (data: { token: string; newPassword: string }) => {
    try {
        const response = await axiosInstance.post(API.AUTH.RESET_PASSWORD, data);
        return response.data;
    } catch (error: unknown) {
        throw new Error(getApiErrorMessage(error, 'Failed to reset password'));
    }
}
