import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { Product } from "../types/product.types";
import { ApiResponse } from "../types/api.types";

export const wishlistService = {
  async getWishlist(): Promise<ApiResponse<Product[]>> {
    const response = await apiClient.get(API_ENDPOINTS.WISHLIST.BASE);
    return response.data;
  },

  async addToWishlist(productId: number): Promise<ApiResponse> {
    const response = await apiClient.post(API_ENDPOINTS.WISHLIST.ITEMS, { product_id: productId });
    return response.data;
  },

  async removeFromWishlist(productId: number): Promise<ApiResponse> {
    const response = await apiClient.delete(API_ENDPOINTS.WISHLIST.BY_PRODUCT(productId));
    return response.data;
  },

  async checkWishlist(productId: number): Promise<ApiResponse<{ is_wishlisted: boolean }>> {
    const response = await apiClient.get(API_ENDPOINTS.WISHLIST.CHECK(productId));
    return response.data;
  },
};
