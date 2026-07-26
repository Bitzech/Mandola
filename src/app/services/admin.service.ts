import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { ApiResponse, PaginatedResponse } from "../types/api.types";

export const adminService = {
  async getDashboard(params?: any): Promise<ApiResponse<any>> {
    const response = await apiClient.get("/admin/dashboard", { params });
    return response.data;
  },

  async getUsers(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.USERS, { params });
    return response.data;
  },

  async updateUserStatus(userId: string | number, status: string): Promise<ApiResponse<any>> {
    const response = await apiClient.patch(API_ENDPOINTS.ADMIN.USER_STATUS(userId), { status });
    return response.data;
  },

  async getSellers(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.SELLERS, { params });
    return response.data;
  },

  async createSeller(payload: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.SELLERS, payload);
    return response.data;
  },

  async updateSellerStatus(sellerId: string | number, status: string, rejection_reason?: string): Promise<ApiResponse<any>> {
    const response = await apiClient.patch(API_ENDPOINTS.ADMIN.SELLER_STATUS(sellerId), { seller_id: sellerId, status, rejection_reason });
    return response.data;
  },

  async getProducts(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.PRODUCTS, { params });
    return response.data;
  },

  async updateProductApproval(productId: string | number, status: string, rejection_reason?: string): Promise<ApiResponse<any>> {
    const response = await apiClient.patch(API_ENDPOINTS.ADMIN.PRODUCT_APPROVAL(productId), { status, rejection_reason });
    return response.data;
  },

  async getOrders(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.ORDERS, { params });
    return response.data;
  },

  async getPayments(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.PAYMENTS, { params });
    return response.data;
  },

  async getSettlements(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.SETTLEMENTS, { params });
    return response.data;
  },

  async updateSettlementStatus(id: string | number, status: string): Promise<ApiResponse<any>> {
    const response = await apiClient.patch(`/admin/settlements/${id}/status`, { status });
    return response.data;
  },

  async getReturns(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.RETURNS, { params });
    return response.data;
  },

  async updateReturnStatus(id: string | number, status: string, admin_notes?: string): Promise<ApiResponse<any>> {
    const response = await apiClient.patch(`/admin/returns/${id}/status`, { status, admin_notes });
    return response.data;
  },

  async getReports(params?: any): Promise<ApiResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.REPORTS_SALES, { params });
    return response.data;
  },

  async getSettings(): Promise<ApiResponse<any>> {
    const response = await apiClient.get("/admin/system-settings");
    return response.data;
  },

  async updateSetting(id: string | number, value: string): Promise<ApiResponse<any>> {
    const response = await apiClient.put(`/admin/system-settings/${id}`, { value });
    return response.data;
  },
};
