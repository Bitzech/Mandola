import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { AddToCartInput, UpdateCartItemInput } from "../types/cart.types";
import { ApiResponse } from "../types/api.types";

export interface CartResponseData {
  cart_summary: {
    id: number;
    user_id: number;
    total_items: number;
    subtotal: string | number;
    discount: string | number;
    tax: string | number;
    shipping_charge: string | number;
    grand_total: string | number;
  };
  items: any[];
}

export const cartService = {
  /**
   * Fetch customer's cart details including summary totals and item list
   */
  async getCart(): Promise<{ summary: any | null; items: any[] }> {
    try {
      const response = await apiClient.get<ApiResponse<CartResponseData>>(API_ENDPOINTS.CART.BASE);
      const data = response.data?.data;
      if (data) {
        return {
          summary: data.cart_summary || null,
          items: Array.isArray(data.items) ? data.items : [],
        };
      }
      return { summary: null, items: [] };
    } catch (error) {
      console.error("[cartService.getCart ERROR]", error);
      return { summary: null, items: [] };
    }
  },

  async getCartSummary(): Promise<{ summary: any | null; items: any[] }> {
    return this.getCart();
  },

  /**
   * Add a product variant to customer's cart
   */
  async addToCart(payload: AddToCartInput): Promise<ApiResponse> {
    const response = await apiClient.post(API_ENDPOINTS.CART.BASE, payload);
    return response.data;
  },

  /**
   * Update quantity for a specific variant in customer's cart
   */
  async updateCartItem(variantId: string | number, payload: UpdateCartItemInput): Promise<ApiResponse> {
    const response = await apiClient.put(API_ENDPOINTS.CART.BY_ITEM(variantId), payload);
    return response.data;
  },

  /**
   * Remove a specific variant item from customer's cart
   */
  async removeCartItem(variantId: string | number): Promise<ApiResponse> {
    const response = await apiClient.delete(API_ENDPOINTS.CART.BY_ITEM(variantId));
    return response.data;
  },

  /**
   * Clear all items from customer's shopping cart
   */
  async clearCart(): Promise<ApiResponse> {
    const response = await apiClient.delete(API_ENDPOINTS.CART.BASE);
    return response.data;
  },
};
