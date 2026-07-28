"use server";

import { getTokenCookie } from "../cookies";
import { getApiErrorMessage } from "@/lib/utils";
import {
  createDoctorAdmin,
  deleteDoctorAdmin,
  fetchDoctorById,
  fetchDoctors,
  updateDoctorAdmin,
  type DoctorListParams,
} from "@/lib/api/doctors";

export const handleListDoctors = async (params: DoctorListParams = {}) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await fetchDoctors(token, params);
    return {
      success: result.success,
      message: result.message,
      data: result.data,
      meta: result.meta,
    };
  } catch (error: unknown) {
    return { success: false, message: getApiErrorMessage(error, "Failed to load doctors") };
  }
};

export const handleGetDoctor = async (id: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await fetchDoctorById(token, id);
    return { success: result.success, message: result.message, data: result.data };
  } catch (error: unknown) {
    return { success: false, message: getApiErrorMessage(error, "Failed to load doctor") };
  }
};

export const handleCreateDoctor = async (payload: FormData | Record<string, unknown>) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await createDoctorAdmin(token, payload);
    return { success: result.success, message: result.message, data: result.data };
  } catch (error: unknown) {
    return { success: false, message: getApiErrorMessage(error, "Failed to create doctor") };
  }
};

export const handleUpdateDoctor = async (id: string, payload: FormData | Record<string, unknown>) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await updateDoctorAdmin(token, id, payload);
    return { success: result.success, message: result.message, data: result.data };
  } catch (error: unknown) {
    return { success: false, message: getApiErrorMessage(error, "Failed to update doctor") };
  }
};

export const handleDeleteDoctor = async (id: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await deleteDoctorAdmin(token, id);
    return { success: result.success, message: result.message };
  } catch (error: unknown) {
    return { success: false, message: getApiErrorMessage(error, "Failed to delete doctor") };
  }
};
