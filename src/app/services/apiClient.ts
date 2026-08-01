import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ENV } from "../config/env";
import { STORAGE_KEYS } from "../constants/storageKeys";

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor: attach Access Token & log outgoing payload
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data) {
      console.log(`[API Outgoing Payload] ${config.method?.toUpperCase()} ${config.url}:`, config.data);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle token refresh on 401 & log errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    if (error.response) {
      console.error(
        `[API Error Response ${error.response.status}] ${error.config?.url}:`,
        error.response.data
      );
    }
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (
        originalRequest.url?.includes("/auth/refresh-token") ||
        originalRequest.url?.includes("/auth/login")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken =
        localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ||
        sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        isRefreshing = false;
        clearAuthStorage();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${ENV.API_BASE_URL}/auth/refresh-token`, {
          refresh_token: refreshToken,
        });

        const newAccessToken =
          data?.access_token ||
          data?.accessToken ||
          data?.data?.access_token ||
          data?.tokens?.access_token ||
          data?.data?.tokens?.access_token;

        const newRefreshToken =
          data?.refresh_token ||
          data?.refreshToken ||
          data?.data?.refresh_token ||
          data?.tokens?.refresh_token ||
          data?.data?.tokens?.refresh_token ||
          refreshToken;

        if (newAccessToken) {
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
          }

          apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          processQueue(null, newAccessToken);
          isRefreshing = false;
          return apiClient(originalRequest);
        } else {
          throw new Error("No access token returned during refresh");
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;
        clearAuthStorage();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export function clearAuthStorage() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.ROLE);
  localStorage.removeItem(STORAGE_KEYS.ROLE_ID);
  sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.LEGACY_AUTH);
}

export function formatApiErrorMessage(err: any): string {
  const data = err?.response?.data;
  if (data) {
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const details = data.errors
        .map((e: any) => {
          if (typeof e === "string") return `- ${e}`;
          if (e && typeof e === "object") {
            const fieldPrefix = e.field ? `${e.field}: ` : "";
            return `- ${fieldPrefix}${e.message || JSON.stringify(e)}`;
          }
          return `- ${String(e)}`;
        })
        .join("\n");
      return `Validation Failed:\n${details}`;
    }
    if (data.errors && typeof data.errors === "object") {
      const e = data.errors;
      const fieldPrefix = e.field ? `${e.field}: ` : "";
      return `Validation Failed:\n- ${fieldPrefix}${e.message || JSON.stringify(e)}`;
    }
    if (data.message && data.message !== "Validation failed") {
      return data.message;
    }
  }
  return err?.message || "An unexpected error occurred.";
}

// Backward compatibility export alias
export const api = apiClient;

