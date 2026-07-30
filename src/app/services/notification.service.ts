import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { ApiResponse, PaginatedResponse } from "../types/api.types";

export interface NotificationItem {
  id: number;
  user_id: number;
  template_id?: number;
  title: string;
  message: string;
  notification_type: string;
  reference_table?: string;
  reference_id?: number;
  is_read: boolean | number;
  read_at?: string;
  created_at: string;
}

export const notificationService = {
  /**
   * Fetch paginated notifications for current user
   */
  async getNotifications(params?: any): Promise<PaginatedResponse<NotificationItem>> {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.BASE, { params });
    return response.data;
  },

  /**
   * Fetch notification by ID
   */
  async getNotificationById(id: string | number): Promise<ApiResponse<NotificationItem>> {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id));
    return response.data;
  },

  /**
   * Fetch unread notification summary count
   */
  async getNotificationSummary(): Promise<ApiResponse<{ unread_count: number }>> {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.SUMMARY);
    return response.data;
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(id: string | number): Promise<ApiResponse> {
    const response = await apiClient.patch(API_ENDPOINTS.NOTIFICATIONS.READ(id));
    return response.data;
  },

  /**
   * Mark all user notifications as read
   */
  async markAllAsRead(): Promise<ApiResponse> {
    const response = await apiClient.patch(API_ENDPOINTS.NOTIFICATIONS.READ_ALL);
    return response.data;
  },

  /**
   * Delete a notification
   */
  async deleteNotification(id: string | number): Promise<ApiResponse> {
    const response = await apiClient.delete(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id));
    return response.data;
  },

  /**
   * ── ADMIN NOTIFICATION APIS ─────────────────────────────
   */
  async createNotification(payload: { user_id?: number; template_id?: number; title: string; message: string; notification_type: string }): Promise<ApiResponse<NotificationItem>> {
    const response = await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.BASE, payload);
    return response.data;
  },

  async getTemplates(): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/templates`);
    return response.data;
  },

  async createTemplate(payload: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/templates`, payload);
    return response.data;
  },

  async updateTemplate(id: string | number, payload: any): Promise<ApiResponse<any>> {
    const response = await apiClient.put(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/templates/${id}`, payload);
    return response.data;
  },

  async getNotificationLogs(id: string | number): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/${id}/logs`);
    return response.data;
  },
};
