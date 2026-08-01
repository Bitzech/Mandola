import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { ApiResponse, PaginatedResponse } from "../types/api.types";

export const shipmentService = {
  /**
   * ── CUSTOMER SHIPMENT APIS ────────────────────────────────
   */
  async getShipments(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.SHIPMENTS.BASE, { params });
    return response.data;
  },

  async getShipmentById(id: string | number): Promise<ApiResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.SHIPMENTS.BY_ID(id));
    return response.data;
  },

  async trackShipment(id: string | number): Promise<ApiResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.SHIPMENTS.TRACK(id));
    return response.data;
  },

  /**
   * ── SELLER SHIPMENT APIS ──────────────────────────────────
   */
  async getSellerShipments(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.SHIPMENTS.SELLER_BASE, { params });
    return response.data;
  },

  async getSellerShipmentById(id: string | number): Promise<ApiResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.SHIPMENTS.SELLER_BY_ID(id));
    return response.data;
  },

  async createShipment(orderId: string | number, payload: any): Promise<ApiResponse<any>> {
    const response = await apiClient.post(API_ENDPOINTS.SHIPMENTS.SELLER_CREATE(orderId), payload);
    return response.data;
  },

  async updateShipmentStatus(id: string | number, payload: { status: string; location?: string; remarks?: string }): Promise<ApiResponse<any>> {
    const response = await apiClient.patch(API_ENDPOINTS.SHIPMENTS.SELLER_STATUS(id), payload);
    return response.data;
  },
};
