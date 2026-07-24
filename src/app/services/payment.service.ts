import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { ApiResponse } from "../types/api.types";

export const paymentService = {
  async createPayment(payload: { order_id: number; gateway: string; payment_method: string }): Promise<ApiResponse> {
    const response = await apiClient.post(API_ENDPOINTS.PAYMENTS.BASE, payload);
    return response.data;
  },

  async verifyPayment(payload: {
    payment_reference: string;
    gateway_order_id?: string;
    gateway_payment_id?: string;
    gateway_signature?: string;
  }): Promise<ApiResponse> {
    const response = await apiClient.post(API_ENDPOINTS.PAYMENTS.VERIFY, payload);
    return response.data;
  },

  async getPaymentByOrder(orderId: string | number): Promise<ApiResponse> {
    const response = await apiClient.get(API_ENDPOINTS.PAYMENTS.BY_ORDER(orderId));
    return response.data;
  },
};
