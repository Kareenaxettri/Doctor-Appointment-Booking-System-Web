import axiosInstance from "./axios-instance";
import { API } from "./endpoints";
import { getApiErrorMessage } from "@/lib/utils";

export interface Payment {
  id: string;
  appointmentId?: string;
  userId?: string;
  doctorId?: string;
  patientName?: string | null;
  patientEmail?: string | null;
  doctorName?: string | null;
  amount?: number;
  paymentMethod?: string;
  status?: string;
  reference?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentListParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const fetchPayments = async (token: string, params: PaymentListParams = {}) => {
  try {
    const response = await axiosInstance.get(API.PAYMENTS, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 12,
        status: params.status || undefined,
      },
    });

    return response.data as {
      success: boolean;
      message: string;
      data: Payment[];
      meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to load payments"));
  }
};

export const createPayment = async (token: string, payload: Record<string, unknown>) => {
  try {
    const response = await axiosInstance.post(API.PAYMENTS, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as { success: boolean; message: string; data: Payment };
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to create payment"));
  }
};

export const updatePayment = async (token: string, id: string, payload: Record<string, unknown>) => {
  try {
    const response = await axiosInstance.patch(API.PAYMENT_BY_ID(id), payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as { success: boolean; message: string; data: Payment };
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to update payment"));
  }
};

export const deletePayment = async (token: string, id: string) => {
  try {
    const response = await axiosInstance.delete(API.PAYMENT_BY_ID(id), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as { success: boolean; message: string };
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to delete payment"));
  }
};
