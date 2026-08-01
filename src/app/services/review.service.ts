import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { ApiResponse, PaginatedResponse } from "../types/api.types";

export interface ReviewPayload {
  order_item_id?: number;
  product_id?: number;
  rating?: number;
  title?: string;
  review?: string;
  is_anonymous?: boolean;
}

export const reviewService = {
  /**
   * List reviews with optional filter query parameters
   */
  async getReviews(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.REVIEWS.BASE, { params });
    return response.data;
  },

  /**
   * Fetch customer's own reviews
   */
  async getMyReviews(params?: any): Promise<PaginatedResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.REVIEWS.MY, { params });
    return response.data;
  },

  /**
   * Fetch reviews for a specific product
   */
  async getProductReviews(productId: string | number, params?: any): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.REVIEWS.BY_PRODUCT(productId), { params });
    return response.data;
  },

  /**
   * Fetch rating summary statistics for a product
   */
  async getProductRatingSummary(productId: string | number): Promise<ApiResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.REVIEWS.SUMMARY(productId));
    return response.data;
  },

  /**
   * Create a new product review
   */
  async createReview(payload: ReviewPayload): Promise<ApiResponse<any>> {
    const response = await apiClient.post(API_ENDPOINTS.REVIEWS.BASE, payload);
    return response.data;
  },

  /**
   * Update an existing product review
   */
  async updateReview(id: string | number, payload: Partial<ReviewPayload>): Promise<ApiResponse<any>> {
    const response = await apiClient.put(`${API_ENDPOINTS.REVIEWS.BASE}/${id}`, payload);
    return response.data;
  },

  /**
   * Delete a product review
   */
  async deleteReview(id: string | number): Promise<ApiResponse> {
    const response = await apiClient.delete(`${API_ENDPOINTS.REVIEWS.BASE}/${id}`);
    return response.data;
  },

  /**
   * Add a seller/admin reply to a review
   */
  async addReply(reviewId: string | number, reply: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post(API_ENDPOINTS.REVIEWS.REPLY(reviewId), { reply });
    return response.data;
  },

  /**
   * Moderate review approval status (Admin)
   */
  async approveReview(reviewId: string | number, status: string): Promise<ApiResponse<any>> {
    const response = await apiClient.patch(API_ENDPOINTS.REVIEWS.APPROVE(reviewId), { status });
    return response.data;
  },

  /**
   * Mark review as helpful
   */
  async markHelpful(reviewId: string | number): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`${API_ENDPOINTS.REVIEWS.BASE}/${reviewId}/helpful`);
    return response.data;
  },
};
