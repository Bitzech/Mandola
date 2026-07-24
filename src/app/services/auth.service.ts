import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { LoginCredentials, RegisterPayload, AuthUser } from "../types/auth.types";
import { ApiResponse } from "../types/api.types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  async register(payload: RegisterPayload): Promise<ApiResponse> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
    return response.data;
  },

  async sendOTP(identifier: string, type = "verify_email"): Promise<ApiResponse> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.SEND_OTP, { identifier, type });
    return response.data;
  },

  async verifyOTP(identifier: string, otp: string, type = "verify_email"): Promise<ApiResponse> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, { identifier, otp, type });
    return response.data;
  },

  async getMe(): Promise<ApiResponse<AuthUser>> {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  async changePassword(payload: any): Promise<ApiResponse> {
    const response = await apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
    return response.data;
  },
};
