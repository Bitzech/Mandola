import { apiClient, clearAuthStorage } from "./apiClient";
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

  async refreshToken(refreshToken: string): Promise<ApiResponse> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refresh_token: refreshToken,
    });
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

  async forgotPassword(email: string): Promise<ApiResponse> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  async resetPassword(payload: { token: string; password: string; confirm_password?: string }): Promise<ApiResponse> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload);
    return response.data;
  },

  async getMe(): Promise<ApiResponse<AuthUser>> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      return response.data;
    } catch {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
      return response.data;
    }
  },

  async getProfile(): Promise<ApiResponse<AuthUser>> {
    return this.getMe();
  },

  async updateProfile(payload: Partial<AuthUser>): Promise<ApiResponse<AuthUser>> {
    const response = await apiClient.put(API_ENDPOINTS.AUTH.PROFILE, payload);
    return response.data;
  },

  async changePassword(payload: { current_password?: string; currentPassword?: string; new_password?: string; newPassword?: string; confirm_password?: string }): Promise<ApiResponse> {
    const response = await apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
    return response.data;
  },

  async logout(): Promise<ApiResponse> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      return response.data;
    } catch (err) {
      // Return synthetic success on network error during logout
      return { success: true, message: "Logged out locally" };
    } finally {
      clearAuthStorage();
    }
  },
};
