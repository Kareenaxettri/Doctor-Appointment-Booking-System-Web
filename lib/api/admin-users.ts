import axiosInstance from "./axios-instance";
import { API } from "./endpoints";
import { getApiErrorMessage } from "@/lib/utils";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  contactNumber?: string;
  phone?: string | null;
  gender?: string;
  role: "user" | "admin";
  profileImage?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateUserPayload {
  fullName: string;
  email: string;
  contactNumber: string;
  gender?: string;
  password: string;
  role?: "user" | "admin";
}

export type UpdateUserPayload = Partial<Omit<CreateUserPayload, "password">> & {
  password?: string;
};

// GET /api/v1/admin/users?page=&limit=&search=  -> protected, admin only
export const fetchUsers = async (token: string, params: ListUsersParams) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.USERS, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search || undefined,
      },
    });
    return response.data as {
      success: boolean;
      message: string;
      data: AdminUser[];
      meta: PaginationMeta;
    };
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to load users"));
  }
};

// GET /api/v1/admin/users/:id -> protected, admin only
export const fetchUserById = async (token: string, id: string) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.USER_BY_ID(id), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as { success: boolean; message: string; data: AdminUser };
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to load user"));
  }
};

// POST /api/v1/admin/users -> protected, admin only
export const createUserAdmin = async (token: string, payload: CreateUserPayload) => {
  try {
    const response = await axiosInstance.post(API.ADMIN.USERS, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as { success: boolean; message: string; data: AdminUser };
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to create user"));
  }
};

// PATCH /api/v1/admin/users/:id -> protected, admin only
export const updateUserAdmin = async (token: string, id: string, payload: UpdateUserPayload) => {
  try {
    const response = await axiosInstance.patch(API.ADMIN.USER_BY_ID(id), payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as { success: boolean; message: string; data: AdminUser };
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to update user"));
  }
};

// DELETE /api/v1/admin/users/:id -> protected, admin only
export const deleteUserAdmin = async (token: string, id: string) => {
  try {
    const response = await axiosInstance.delete(API.ADMIN.USER_BY_ID(id), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as { success: boolean; message: string };
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to delete user"));
  }
};
