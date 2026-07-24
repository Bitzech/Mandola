import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { CartItem, CartSummary, AddToCartInput, UpdateCartItemInput } from "../types/cart.types";
import { ApiResponse } from "../types/api.types";

export const cartService = {
  async getCart(): Promise<ApiResponse<CartItem[]>> {
    const response = await apiClient.get(API_ENDPOINTS.CART.BASE);
    return response.data;
  },

  async getCartSummary(): Promise<ApiResponse<CartSummary>> {
    const response = await apiClient.get(API_ENDPOINTS.CART.SUMMARY);
    return response.data;
  },

  async addToCart(payload: AddToCartInput): Promise<ApiResponse<CartItem>> {
    const response = await apiClient.post(API_ENDPOINTS.CART.ITEMS, payload);
    return response.data;
  },

  async updateCartItem(itemId: string | number, payload: UpdateCartItemInput): Promise<ApiResponse<CartItem>> {
    const response = await apiClient.put(API_ENDPOINTS.CART.BY_ITEM(itemId), payload);
    return response.data;
  },

  async removeCartItem(itemId: string | number): Promise<ApiResponse> {
    const response = await apiClient.delete(API_ENDPOINTS.CART.BY_ITEM(itemId));
    return response.data;
  },

  async clearCart(): Promise<ApiResponse> {
    const response = await apiClient.delete(API_ENDPOINTS.CART.BASE);
    return response.data;
  },
};
