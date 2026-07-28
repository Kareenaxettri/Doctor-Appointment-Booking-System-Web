"use server";

import { getTokenCookie } from "../cookies";
import { getApiErrorMessage } from "@/lib/utils";
import {
  createPayment,
  fetchPayments,
  updatePayment,
  deletePayment,
  type PaymentListParams,
} from "@/lib/api/payments";

export const handleListPayments = async (params: PaymentListParams = {}) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await fetchPayments(token, params);
    return {
      success: result.success,
      message: result.message,
      data: result.data,
      meta: result.meta,
    };
  } catch (error: unknown) {
    return { success: false, message: getApiErrorMessage(error, "Failed to load payments") };
  }
};

export const handleCreatePayment = async (payload: Record<string, unknown>) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await createPayment(token, payload);
    return { success: result.success, message: result.message, data: result.data };
  } catch (error: unknown) {
    return { success: false, message: getApiErrorMessage(error, "Failed to create payment") };
  }
};

export const handleUpdatePayment = async (id: string, payload: Record<string, unknown>) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await updatePayment(token, id, payload);
    return { success: result.success, message: result.message, data: result.data };
  } catch (error: unknown) {
    return { success: false, message: getApiErrorMessage(error, "Failed to update payment") };
  }
};

export const handleDeletePayment = async (id: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await deletePayment(token, id);
    return { success: result.success, message: result.message };
  } catch (error: unknown) {
    return { success: false, message: getApiErrorMessage(error, "Failed to delete payment") };
  }
};
