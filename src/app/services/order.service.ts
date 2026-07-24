import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { Order, Address } from "../types/order.types";
import { ApiResponse, PaginatedResponse } from "../types/api.types";

export const orderService = {
  async placeOrder(payload: any): Promise<ApiResponse<Order>> {
    const response = await apiClient.post(API_ENDPOINTS.ORDERS.BASE, payload);
    return response.data;
  },

  async getOrders(params?: any): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.BASE, { params });
    return response.data;
  },

  async getOrderById(id: string | number): Promise<ApiResponse<Order>> {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.BY_ID(id));
    return response.data;
  },

  async cancelOrder(id: string | number, reason?: string): Promise<ApiResponse> {
    const response = await apiClient.patch(API_ENDPOINTS.ORDERS.CANCEL(id), { reason });
    return response.data;
  },

  async getAddresses(): Promise<ApiResponse<Address[]>> {
    const response = await apiClient.get(API_ENDPOINTS.ADDRESSES.BASE);
    return response.data;
  },

  async createAddress(address: Address): Promise<ApiResponse<Address>> {
    const response = await apiClient.post(API_ENDPOINTS.ADDRESSES.BASE, address);
    return response.data;
  },

  async updateAddress(id: string | number, address: Address): Promise<ApiResponse<Address>> {
    const response = await apiClient.put(API_ENDPOINTS.ADDRESSES.BY_ID(id), address);
    return response.data;
  },

  async deleteAddress(id: string | number): Promise<ApiResponse> {
    const response = await apiClient.delete(API_ENDPOINTS.ADDRESSES.BY_ID(id));
    return response.data;
  },

  async setDefaultAddress(id: string | number): Promise<ApiResponse> {
    const response = await apiClient.patch(API_ENDPOINTS.ADDRESSES.DEFAULT(id));
    return response.data;
  },
};
