"use server";

import {
  fetchUsers,
  fetchUserById,
  createUserAdmin,
  updateUserAdmin,
  deleteUserAdmin,
  ListUsersParams,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/lib/api/admin-users";

import { getTokenCookie } from "../cookies";
import { getApiErrorMessage } from "@/lib/utils";

export const handleListUsers = async (params: ListUsersParams) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await fetchUsers(token, params);

    return {
      success: result.success,
      message: result.message,
      data: result.data,
      meta: result.meta,
    };
  } catch (error: unknown) {
    return { success: false, message: getApiErrorMessage(error, "Failed to load users") };
  }
};

export const handleGetUser = async (id: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await fetchUserById(token, id);
    return { success: result.success, message: result.message, data: result.data };
  } catch (error: unknown) {
    return { success: false, message: getApiErrorMessage(error, "Failed to load user") };
  }
};

export const handleCreateUser = async (payload: CreateUserPayload) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await createUserAdmin(token, payload);
    return { success: result.success, message: result.message, data: result.data };
  } catch (error: unknown) {
    return { success: false, message: getApiErrorMessage(error, "Failed to create user") };
  }
};

export const handleUpdateUser = async (id: string, payload: UpdateUserPayload) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await updateUserAdmin(token, id, payload);
    return { success: result.success, message: result.message, data: result.data };
  } catch (error: unknown) {
    return { success: false, message: getApiErrorMessage(error, "Failed to update user") };
  }
};

export const handleDeleteUser = async (id: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await deleteUserAdmin(token, id);
    return { success: result.success, message: result.message };
  } catch (error: unknown) {
    return { success: false, message: getApiErrorMessage(error, "Failed to delete user") };
  }
};
