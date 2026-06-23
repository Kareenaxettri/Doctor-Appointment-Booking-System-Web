import axiosInstance from "./axios-instance";
import {API} from "./endpoints";
import { getApiErrorMessage } from "@/lib/utils";

export const register = async (data: any) => {
    try{
        const response = 
            await axiosInstance.post(API.AUTH.REGISTER,data); // path,data
        return response.data; //response ko body
    

    }catch(error:Error | any){
        throw new Error(error?.response?.data?.message
        || 'Registration failed');
        //error?.response?.dataa -> response ko body
    }
}

export const login = async (data: any) => {
    try{
        const response = 
            await axiosInstance.post(API.AUTH.LOGIN,data); // path,data
        return response.data; //response ko body
    }catch(error:Error | any){
        throw new Error(error?.response?.data?.message
        || 'Login failed');
        //error?.response?.dataa -> response ko body
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

// PATCH /api/v1/auth/update -> protected, multipart/form-data (multer on backend)
// `data` is a FormData instance built by the caller (text fields + optional profileImage file)
export const updateProfile = async (token: string, data: FormData) => {
    try {
        const response = await axiosInstance.patch(API.AUTH.UPDATE, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                // Do not set Content-Type manually: axios detects FormData and
                // sets the correct multipart boundary automatically.
            },
        });
        return response.data;
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
