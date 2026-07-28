export const API = {
  AUTH: {
    REGISTER: "/api/v1/auth/register",
    LOGIN: "/api/v1/auth/login",
    WHOAMI: "/api/v1/auth/whoami",
    UPDATE: "/api/v1/users/profile",
    UPDATE_PASSWORD: "/api/v1/auth/update-password",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    RESET_PASSWORD: "/api/v1/auth/reset-password",
  },
  ADMIN: {
    USERS: "/api/v1/admin/users",
    USER_BY_ID: (id: string) => `/api/v1/admin/users/${id}`,
  },
  DOCTORS: "/api/v1/doctors",
  DOCTOR_BY_ID: (id: string) => `/api/v1/doctors/${id}`,
  APPOINTMENTS: "/api/v1/appointments",
  APPOINTMENT_BY_ID: (id: string) => `/api/v1/appointments/${id}`,
  PAYMENTS: "/api/v1/payments",
  PAYMENT_BY_ID: (id: string) => `/api/v1/payments/${id}`,
};
