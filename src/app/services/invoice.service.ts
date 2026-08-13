import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { ApiResponse, PaginatedResponse } from "../types/api.types";

export const invoiceService = {
  async getInvoices(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.INVOICES.BASE, { params });
    return response.data;
  },

  async getInvoiceById(id: string | number): Promise<ApiResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.INVOICES.BY_ID(id));
    return response.data;
  },

  async downloadInvoice(id: string | number): Promise<ApiResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.INVOICES.DOWNLOAD(id));
    return response.data;
  },

  async generateInvoice(orderId: string | number): Promise<any> {
    const response = await apiClient.post(`/admin/invoices/${orderId}/generate`);
    return response.data?.data || response.data;
  },
};
