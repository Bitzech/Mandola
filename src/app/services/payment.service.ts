import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { ApiResponse, PaginatedResponse } from "../types/api.types";

export const paymentService = {
  /**
   * Initiate a payment request for an order
   */
  async createPayment(payload: { order_id: number; gateway: string; payment_method: string }): Promise<ApiResponse<any>> {
    const response = await apiClient.post(API_ENDPOINTS.PAYMENTS.BASE, payload);
    return response.data;
  },

  /**
   * Verify gateway payment signature
   */
  async verifyPayment(payload: {
    payment_reference: string;
    gateway_order_id?: string;
    gateway_payment_id?: string;
    gateway_signature?: string;
  }): Promise<ApiResponse<any>> {
    const response = await apiClient.post(API_ENDPOINTS.PAYMENTS.VERIFY, payload);
    return response.data;
  },

  /**
   * Fetch listing of customer payments
   */
  async getPayments(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.PAYMENTS.BASE, { params });
    return response.data;
  },

  /**
   * Fetch payment details by Payment ID
   */
  async getPaymentById(id: string | number): Promise<ApiResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.PAYMENTS.BY_ID(id));
    return response.data;
  },

  /**
   * Fetch payment details by parent Order ID
   */
  async getPaymentByOrder(orderId: string | number): Promise<ApiResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.PAYMENTS.BY_ORDER(orderId));
    return response.data;
  },
};
