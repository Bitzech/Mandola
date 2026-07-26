import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { SellerProfile, SellerDashboardSummary, SellerOrder, SellerSettlement } from "../types/seller.types";
import { ApiResponse, PaginatedResponse } from "../types/api.types";

export const sellerService = {
  async getProfile(): Promise<ApiResponse<SellerProfile>> {
    const response = await apiClient.get(API_ENDPOINTS.SELLER.PROFILE);
    return response.data;
  },

  async updateProfile(data: Partial<SellerProfile>): Promise<ApiResponse<SellerProfile>> {
    const response = await apiClient.put(API_ENDPOINTS.SELLER.PROFILE, data);
    return response.data;
  },

  async getDashboardSummary(): Promise<ApiResponse<SellerDashboardSummary>> {
    const response = await apiClient.get(API_ENDPOINTS.SELLER.DASHBOARD_OVERVIEW);
    return response.data;
  },

  async getSellerOrders(params?: any): Promise<PaginatedResponse<SellerOrder>> {
    const response = await apiClient.get(API_ENDPOINTS.SELLER.ORDERS, { params });
    return response.data;
  },

  async updateOrderStatus(id: string | number, status: string): Promise<ApiResponse> {
    const response = await apiClient.patch(API_ENDPOINTS.SELLER.ORDER_STATUS(id), { status });
    return response.data;
  },

  async getSettlements(): Promise<ApiResponse<SellerSettlement[]>> {
    const response = await apiClient.get(API_ENDPOINTS.SELLER.SETTLEMENTS);
    return response.data;
  },
};
