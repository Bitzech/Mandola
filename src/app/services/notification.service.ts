import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { ApiResponse, PaginatedResponse } from "../types/api.types";

export const notificationService = {
  async getNotifications(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.BASE, { params });
    return response.data;
  },

  async getNotificationSummary(): Promise<ApiResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.SUMMARY);
    return response.data;
  },

  async markAsRead(id: string | number): Promise<ApiResponse> {
    const response = await apiClient.patch(API_ENDPOINTS.NOTIFICATIONS.READ(id));
    return response.data;
  },

  async markAllAsRead(): Promise<ApiResponse> {
    const response = await apiClient.patch(API_ENDPOINTS.NOTIFICATIONS.READ_ALL);
    return response.data;
  },

  async deleteNotification(id: string | number): Promise<ApiResponse> {
    const response = await apiClient.delete(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id));
    return response.data;
  },
};
