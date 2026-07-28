import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  || "http://localhost:8089";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        document.cookie = "auth_token=; path=/; max-age=0";
        document.cookie = "user_data=; path=/; max-age=0";
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
