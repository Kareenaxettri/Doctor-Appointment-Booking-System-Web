import axiosInstance from "./axios-instance";
import { API } from "./endpoints";
import { getApiErrorMessage } from "@/lib/utils";

export interface Doctor {
  id: string;
  fullName?: string;
  name?: string;
  specialty?: string;
  specialization?: string;
  clinic?: string;
  clinicAddress?: string;
  photo?: string;
  profileImage?: string;
  rating?: number;
  experienceYears?: number;
  consultationFee?: number;
  contactNumber?: string;
  bio?: string;
  availability?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DoctorListParams {
  page?: number;
  limit?: number;
  search?: string;
  specialty?: string;
}

export const fetchDoctors = async (token: string, params: DoctorListParams = {}) => {
  try {
    const response = await axiosInstance.get(API.DOCTORS, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 12,
        search: params.search || undefined,
        specialty: params.specialty || undefined,
      },
    });

    return response.data as {
      success: boolean;
      message: string;
      data: Doctor[];
      meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to load doctors"));
  }
};

export const fetchDoctorById = async (token: string, id: string) => {
  try {
    const response = await axiosInstance.get(API.DOCTOR_BY_ID(id), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as { success: boolean; message: string; data: Doctor };
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to load doctor"));
  }
};

export const createDoctorAdmin = async (token: string, payload: FormData | Record<string, unknown>) => {
  try {
    const isFormData = payload instanceof FormData;
    const response = await axiosInstance.post(API.DOCTORS, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
    });
    return response.data as { success: boolean; message: string; data: Doctor };
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to create doctor"));
  }
};

export const updateDoctorAdmin = async (token: string, id: string, payload: FormData | Record<string, unknown>) => {
  try {
    const isFormData = payload instanceof FormData;
    const response = await axiosInstance.patch(API.DOCTOR_BY_ID(id), payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
    });
    return response.data as { success: boolean; message: string; data: Doctor };
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to update doctor"));
  }
};

export const deleteDoctorAdmin = async (token: string, id: string) => {
  try {
    const response = await axiosInstance.delete(API.DOCTOR_BY_ID(id), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as { success: boolean; message: string };
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to delete doctor"));
  }
};
