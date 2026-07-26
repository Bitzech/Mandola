import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { ApiResponse, PaginatedResponse } from "../types/api.types";

export const shipmentService = {
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
};
