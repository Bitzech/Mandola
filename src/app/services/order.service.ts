import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { Order, Address } from "../types/order.types";
import { ApiResponse } from "../types/api.types";

export const orderService = {
  /**
   * Place order from current cart
   */
  async placeOrder(payload: any): Promise<ApiResponse<Order>> {
    const response = await apiClient.post(API_ENDPOINTS.ORDERS.BASE, payload);
    return response.data;
  },

  /**
   * Fetch customer's orders list with optional pagination & status filters
   */
  async getOrders(params?: any): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.BASE, { params });
    return response.data;
  },

  /**
   * Fetch complete details of a single order by ID or Order Number
   */
  async getOrderById(id: string | number): Promise<ApiResponse<Order>> {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.BY_ID(id));
    return response.data;
  },

  /**
   * Cancel an eligible order
   */
  async cancelOrder(id: string | number, reason?: string): Promise<ApiResponse> {
    const response = await apiClient.patch(API_ENDPOINTS.ORDERS.CANCEL(id), { reason });
    return response.data;
  },

  /**
   * Fetch order status timeline history
   */
  async getStatusHistory(id: string | number): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.TIMELINE(id));
    return response.data;
  },

  /**
   * Update order status (Admin & Seller)
   */
  async updateOrderStatus(id: string | number, order_status: string, remarks?: string): Promise<ApiResponse> {
    const response = await apiClient.patch(`/orders/${id}/status`, { order_status, remarks });
    return response.data;
  },

  /**
   * Fetch customer saved addresses
   */
  async getAddresses(): Promise<ApiResponse<Address[]>> {
    const response = await apiClient.get(API_ENDPOINTS.ADDRESSES.BASE);
    return response.data;
  },

  /**
   * Create new address
   */
  async createAddress(address: Address): Promise<ApiResponse<Address>> {
    const response = await apiClient.post(API_ENDPOINTS.ADDRESSES.BASE, address);
    return response.data;
  },

  /**
   * Update address by ID
   */
  async updateAddress(id: string | number, address: Address): Promise<ApiResponse<Address>> {
    const response = await apiClient.put(API_ENDPOINTS.ADDRESSES.BY_ID(id), address);
    return response.data;
  },

  /**
   * Delete address by ID
   */
  async deleteAddress(id: string | number): Promise<ApiResponse> {
    const response = await apiClient.delete(API_ENDPOINTS.ADDRESSES.BY_ID(id));
    return response.data;
  },

  /**
   * Set default address
   */
  async setDefaultAddress(id: string | number): Promise<ApiResponse> {
    const response = await apiClient.patch(API_ENDPOINTS.ADDRESSES.DEFAULT(id));
    return response.data;
  },
};
