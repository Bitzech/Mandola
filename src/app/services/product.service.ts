import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { Product, ProductQueryParams, ProductVariant, ProductImage } from "../types/product.types";
import { ApiResponse, PaginatedResponse } from "../types/api.types";

export const productService = {
  async getProducts(params?: ProductQueryParams): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BASE, { params });
    return response.data;
  },

  async getProductById(id: string | number): Promise<ApiResponse<Product>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BY_ID(id));
    return response.data;
  },

  async getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BY_SLUG(slug));
    return response.data;
  },

  async getProductImages(productId: string | number): Promise<ApiResponse<ProductImage[]>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.IMAGES(productId));
    return response.data;
  },

  async getProductVariants(productId: string | number): Promise<ApiResponse<ProductVariant[]>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.VARIANTS(productId));
    return response.data;
  },
};
