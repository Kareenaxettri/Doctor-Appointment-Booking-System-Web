"use server";

import { getTokenCookie } from "../cookies";
import { getApiErrorMessage } from "@/lib/utils";
import {
  createAppointment,
  deleteAppointment,
  fetchAppointmentById,
  fetchAppointments,
  updateAppointment,
  type AppointmentListParams,
} from "@/lib/api/appointments";

export const handleListAppointments = async (params: AppointmentListParams = {}) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await fetchAppointments(token, params);
    return {
      success: result.success,
      message: result.message,
      data: result.data,
      meta: result.meta,
    };
  } catch (error: unknown) {
    return { success: false, message: getApiErrorMessage(error, "Failed to load appointments") };
  }
};

export const handleGetAppointment = async (id: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await fetchAppointmentById(token, id);
    return { success: result.success, message: result.message, data: result.data };
  } catch (error: unknown) {
    return { success: false, message: getApiErrorMessage(error, "Failed to load appointment") };
  }
};

export const handleCreateAppointment = async (payload: Record<string, unknown>) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await createAppointment(token, payload);
    return { success: result.success, message: result.message, data: result.data };
  } catch (error: unknown) {
    return { success: false, message: getApiErrorMessage(error, "Failed to create appointment") };
  }
};

export const handleUpdateAppointment = async (id: string, payload: Record<string, unknown>) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await updateAppointment(token, id, payload);
    return { success: result.success, message: result.message, data: result.data };
  } catch (error: unknown) {
    return { success: false, message: getApiErrorMessage(error, "Failed to update appointment") };
  }
};

export const handleDeleteAppointment = async (id: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await deleteAppointment(token, id);
    return { success: result.success, message: result.message };
  } catch (error: unknown) {
    return { success: false, message: getApiErrorMessage(error, "Failed to delete appointment") };
  }
};
