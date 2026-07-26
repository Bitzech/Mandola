import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { ApiResponse } from "../types/api.types";

export const wishlistService = {
  /**
   * Fetch customer's wishlist items
   */
  async getWishlist(): Promise<any[]> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(API_ENDPOINTS.WISHLIST.BASE);
      const data = response.data?.data;
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.items)) return data.items;
      return [];
    } catch (error) {
      console.error("[wishlistService.getWishlist ERROR]", error);
      return [];
    }
  },

  /**
   * Add a product to customer's wishlist
   */
  async addToWishlist(productId: number): Promise<ApiResponse> {
    const response = await apiClient.post(API_ENDPOINTS.WISHLIST.BASE, { product_id: Number(productId) });
    return response.data;
  },

  /**
   * Remove a product from customer's wishlist
   */
  async removeFromWishlist(productId: number): Promise<ApiResponse> {
    const response = await apiClient.delete(API_ENDPOINTS.WISHLIST.BY_PRODUCT(productId));
    return response.data;
  },

  /**
   * Check if a specific product is in customer's wishlist
   */
  async checkWishlist(productId: number): Promise<boolean> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(API_ENDPOINTS.WISHLIST.CHECK(productId));
      return Boolean(response.data?.data?.is_wishlisted);
    } catch (error) {
      return false;
    }
  },
};
