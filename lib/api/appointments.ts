import axiosInstance from "./axios-instance";
import { API } from "./endpoints";
import { getApiErrorMessage } from "@/lib/utils";

export interface Appointment {
  id: string;
  patient?: string;
  patientName?: string;
  patientEmail?: string;
  doctor?: string;
  doctorName?: string;
  specialty?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  amount?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentListParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export const fetchAppointments = async (token: string, params: AppointmentListParams = {}) => {
  try {
    const response = await axiosInstance.get(API.APPOINTMENTS, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 12,
        status: params.status || undefined,
        search: params.search || undefined,
      },
    });

    return response.data as {
      success: boolean;
      message: string;
      data: Appointment[];
      meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to load appointments"));
  }
};

export const fetchAppointmentById = async (token: string, id: string) => {
  try {
    const response = await axiosInstance.get(API.APPOINTMENT_BY_ID(id), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as { success: boolean; message: string; data: Appointment };
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to load appointment"));
  }
};

export const createAppointment = async (token: string, payload: Record<string, unknown>) => {
  try {
    const response = await axiosInstance.post(API.APPOINTMENTS, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as { success: boolean; message: string; data: Appointment };
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to create appointment"));
  }
};

export const updateAppointment = async (token: string, id: string, payload: Record<string, unknown>) => {
  try {
    const response = await axiosInstance.patch(API.APPOINTMENT_BY_ID(id), payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as { success: boolean; message: string; data: Appointment };
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to update appointment"));
  }
};

export const deleteAppointment = async (token: string, id: string) => {
  try {
    const response = await axiosInstance.delete(API.APPOINTMENT_BY_ID(id), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as { success: boolean; message: string };
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to delete appointment"));
  }
};
