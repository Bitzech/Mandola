import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { SellerProfile, SellerOrder, SellerSettlement } from "../types/seller.types";
import { ApiResponse, PaginatedResponse } from "../types/api.types";

export const sellerService = {
  async getProfile(sellerId?: string | number): Promise<ApiResponse<SellerProfile>> {
    const url = sellerId ? API_ENDPOINTS.SELLER.PROFILE_BY_ID(sellerId) : API_ENDPOINTS.SELLER.PROFILE;
    const response = await apiClient.get(url);
    return response.data;
  },

  async updateProfile(data: Partial<SellerProfile>, sellerId?: string | number): Promise<ApiResponse<SellerProfile>> {
    const url = sellerId ? `/seller-profile/${sellerId}` : API_ENDPOINTS.SELLER.PROFILE;
    const response = await apiClient.put(url, data);
    return response.data;
  },

  // ── Seller Dashboard Aggregations ─────────────────────────
  async getOverview(): Promise<ApiResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.SELLER.DASHBOARD_OVERVIEW);
    return response.data;
  },

  async getRevenue(): Promise<ApiResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.SELLER.DASHBOARD_REVENUE);
    return response.data;
  },

  async getProductsStats(): Promise<ApiResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.SELLER.DASHBOARD_PRODUCTS);
    return response.data;
  },

  async getRecentOrders(params?: any): Promise<ApiResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.SELLER.DASHBOARD_RECENT_ORDERS, { params });
    return response.data;
  },

  async getTopProducts(params?: any): Promise<ApiResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.SELLER.DASHBOARD_TOP_PRODUCTS, { params });
    return response.data;
  },

  async getRecentReviews(params?: any): Promise<ApiResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.SELLER.DASHBOARD_REVIEWS, { params });
    return response.data;
  },

  async getDashboardNotifications(): Promise<ApiResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.SELLER.DASHBOARD_NOTIFICATIONS);
    return response.data;
  },

  async getCharts(params?: any): Promise<ApiResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.SELLER.DASHBOARD_CHARTS, { params });
    return response.data;
  },

  // ── Seller Sub-Orders ─────────────────────────────────────
  async getSellerOrders(params?: any): Promise<PaginatedResponse<SellerOrder>> {
    const response = await apiClient.get(API_ENDPOINTS.SELLER.ORDERS, { params });
    return response.data;
  },

  async getSellerOrderById(id: string | number): Promise<ApiResponse<SellerOrder>> {
    const response = await apiClient.get(API_ENDPOINTS.SELLER.ORDER_BY_ID(id));
    return response.data;
  },

  async updateOrderStatus(id: string | number, status: string): Promise<ApiResponse> {
    const response = await apiClient.patch(API_ENDPOINTS.SELLER.ORDER_STATUS(id), { status });
    return response.data;
  },

  async getOrderHistory(id: string | number): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get(API_ENDPOINTS.SELLER.ORDER_HISTORY(id));
    return response.data;
  },

  async getOrderPackages(id: string | number): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get(API_ENDPOINTS.SELLER.ORDER_PACKAGES(id));
    return response.data;
  },

  async createOrderPackage(id: string | number, payload: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post(API_ENDPOINTS.SELLER.ORDER_PACKAGES(id), payload);
    return response.data;
  },

  // ── Settlements ───────────────────────────────────────────
  async getSettlements(params?: any): Promise<ApiResponse<SellerSettlement[]>> {
    const response = await apiClient.get(API_ENDPOINTS.SELLER.SETTLEMENTS, { params });
    return response.data;
  },

  async getSettlementById(id: string | number): Promise<ApiResponse<SellerSettlement>> {
    const response = await apiClient.get(API_ENDPOINTS.SELLER.SETTLEMENT_BY_ID(id));
    return response.data;
  },
};
