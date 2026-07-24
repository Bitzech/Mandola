import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { AdminDashboardSummary, AdminUserListItem, AdminSellerListItem } from "../types/admin.types";
import { ApiResponse, PaginatedResponse } from "../types/api.types";

export const adminService = {
  async getDashboardSummary(): Promise<ApiResponse<AdminDashboardSummary>> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.HOMEPAGE_SUMMARY);
    return response.data;
  },

  async getUsers(params?: any): Promise<PaginatedResponse<AdminUserListItem>> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.USERS, { params });
    return response.data;
  },

  async updateUserStatus(userId: string | number, status: "active" | "blocked"): Promise<ApiResponse> {
    const response = await apiClient.patch(API_ENDPOINTS.ADMIN.USER_STATUS(userId), { status });
    return response.data;
  },

  async getSellers(params?: any): Promise<PaginatedResponse<AdminSellerListItem>> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.SELLERS, { params });
    return response.data;
  },

  async updateSellerStatus(sellerId: string | number, status: string): Promise<ApiResponse> {
    const response = await apiClient.patch(API_ENDPOINTS.ADMIN.SELLER_STATUS(sellerId), { status });
    return response.data;
  },
};
