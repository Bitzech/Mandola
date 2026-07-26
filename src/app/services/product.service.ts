import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { Product, ProductQueryParams, ProductVariant, ProductImage } from "../types/product.types";
import { ApiResponse, PaginatedResponse } from "../types/api.types";

export const productService = {
  /**
   * Fetch paginated products list with query filters
   */
  async getProducts(params?: ProductQueryParams): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BASE, { params });
    return response.data;
  },

  /**
   * Fetch product details by ID
   */
  async getProductById(id: string | number): Promise<ApiResponse<Product>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BY_ID(id));
    return response.data;
  },

  /**
   * Fetch product details by unique slug
   */
  async getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.BY_SLUG(slug));
    return response.data;
  },

  /**
   * Fetch gallery images of a product
   */
  async getProductImages(productId: string | number): Promise<ApiResponse<ProductImage[]>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.IMAGES(productId));
    return response.data;
  },

  /**
   * Fetch variants of a product
   */
  async getProductVariants(productId: string | number): Promise<ApiResponse<ProductVariant[]>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.VARIANTS(productId));
    return response.data;
  },

  /**
   * Fetch master product attributes list
   */
  async getProductAttributes(): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCT_ATTRIBUTES.BASE);
    return response.data;
  },

  /**
   * Fetch attribute values associated with a product
   */
  async getProductAttributeValues(productId: string | number): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCT_ATTRIBUTE_VALUES.BY_PRODUCT(productId));
    return response.data;
  },
};
