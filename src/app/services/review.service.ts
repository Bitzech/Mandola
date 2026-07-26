import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { ApiResponse, PaginatedResponse } from "../types/api.types";

export interface ReviewPayload {
  product_id?: number;
  rating?: number;
  title?: string;
  comment?: string;
  review_text?: string;
  images?: string[];
}

export const reviewService = {
  async getReviews(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.REVIEWS.BASE, { params });
    return response.data;
  },

  async getMyReviews(params?: any): Promise<PaginatedResponse<any>> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS.MY, { params });
      return response.data;
    } catch {
      // Fallback if GET /reviews/my falls back to GET /reviews
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS.BASE, { params });
      return response.data;
    }
  },

  async getProductReviews(productId: string | number, params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.REVIEWS.BY_PRODUCT(productId), { params });
    return response.data;
  },

  async createReview(payload: ReviewPayload): Promise<ApiResponse<any>> {
    const response = await apiClient.post(API_ENDPOINTS.REVIEWS.BASE, payload);
    return response.data;
  },

  async updateReview(id: string | number, payload: Partial<ReviewPayload>): Promise<ApiResponse<any>> {
    const response = await apiClient.put(API_ENDPOINTS.REVIEWS.BASE + `/${id}`, payload);
    return response.data;
  },

  async deleteReview(id: string | number): Promise<ApiResponse> {
    const response = await apiClient.delete(API_ENDPOINTS.REVIEWS.BASE + `/${id}`);
    return response.data;
  },
};
