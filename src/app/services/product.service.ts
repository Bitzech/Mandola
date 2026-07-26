import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { Product, ProductQueryParams, ProductVariant, ProductImage } from "../types/product.types";
import { ApiResponse, PaginatedResponse } from "../types/api.types";

export const productService = {
  /**
   * ── 1. PRODUCT APIS ──────────────────────────────────────
   */
  async getProducts(params?: ProductQueryParams): Promise<any> {
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

  async createProduct(payload: any): Promise<ApiResponse<Product>> {
    const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.BASE, payload);
    return response.data;
  },

  async updateProduct(id: string | number, payload: any): Promise<ApiResponse<Product>> {
    const response = await apiClient.put(API_ENDPOINTS.PRODUCTS.BY_ID(id), payload);
    return response.data;
  },

  async deleteProduct(id: string | number): Promise<ApiResponse> {
    const response = await apiClient.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
    return response.data;
  },

  async changeProductStatus(id: string | number, status: string): Promise<ApiResponse<Product>> {
    const response = await apiClient.patch(API_ENDPOINTS.PRODUCTS.STATUS(id), { status });
    return response.data;
  },

  /**
   * ── 2. PRODUCT IMAGE APIS ──────────────────────────────────
   */
  async getProductImages(productId: string | number): Promise<ApiResponse<ProductImage[]>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.IMAGES(productId));
    return response.data;
  },

  async addProductImage(productId: string | number, payload: { image: string; alt_text?: string; is_primary?: boolean }): Promise<ApiResponse<ProductImage>> {
    const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.IMAGES(productId), payload);
    return response.data;
  },

  async deleteProductImage(productId: string | number, imageId: string | number): Promise<ApiResponse> {
    const response = await apiClient.delete(`${API_ENDPOINTS.PRODUCTS.IMAGES(productId)}/${imageId}`);
    return response.data;
  },

  async setPrimaryImage(productId: string | number, imageId: string | number): Promise<ApiResponse<ProductImage>> {
    const response = await apiClient.patch(API_ENDPOINTS.PRODUCTS.IMAGE_PRIMARY(productId, imageId));
    return response.data;
  },

  /**
   * ── 3. PRODUCT VARIANT APIS ────────────────────────────────
   */
  async getProductVariants(productId: string | number): Promise<ApiResponse<ProductVariant[]>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.VARIANTS(productId));
    return response.data;
  },

  async getVariantById(productId: string | number, variantId: string | number): Promise<ApiResponse<ProductVariant>> {
    const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.VARIANTS(productId)}/${variantId}`);
    return response.data;
  },

  async createProductVariant(productId: string | number, payload: any): Promise<ApiResponse<ProductVariant>> {
    const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.VARIANTS(productId), payload);
    return response.data;
  },

  async updateProductVariant(productId: string | number, variantId: string | number, payload: any): Promise<ApiResponse<ProductVariant>> {
    const response = await apiClient.put(`${API_ENDPOINTS.PRODUCTS.VARIANTS(productId)}/${variantId}`, payload);
    return response.data;
  },

  async deleteProductVariant(productId: string | number, variantId: string | number): Promise<ApiResponse> {
    const response = await apiClient.delete(`${API_ENDPOINTS.PRODUCTS.VARIANTS(productId)}/${variantId}`);
    return response.data;
  },

  async updateVariantStock(productId: string | number, variantId: string | number, stock: number): Promise<ApiResponse<ProductVariant>> {
    const response = await apiClient.patch(API_ENDPOINTS.PRODUCTS.VARIANT_STOCK(productId, variantId), { stock });
    return response.data;
  },

  /**
   * ── 4. PRODUCT ATTRIBUTE APIS ──────────────────────────────
   */
  async getProductAttributes(): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCT_ATTRIBUTES.BASE);
    return response.data;
  },

  async getProductAttributeById(id: string | number): Promise<ApiResponse<any>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCT_ATTRIBUTES.BY_ID(id));
    return response.data;
  },

  async createProductAttribute(payload: { name: string; description?: string }): Promise<ApiResponse<any>> {
    const response = await apiClient.post(API_ENDPOINTS.PRODUCT_ATTRIBUTES.BASE, payload);
    return response.data;
  },

  async updateProductAttribute(id: string | number, payload: any): Promise<ApiResponse<any>> {
    const response = await apiClient.put(API_ENDPOINTS.PRODUCT_ATTRIBUTES.BY_ID(id), payload);
    return response.data;
  },

  async deleteProductAttribute(id: string | number): Promise<ApiResponse> {
    const response = await apiClient.delete(API_ENDPOINTS.PRODUCT_ATTRIBUTES.BY_ID(id));
    return response.data;
  },

  /**
   * ── 5. PRODUCT ATTRIBUTE VALUE APIS ────────────────────────
   */
  async getProductAttributeValues(productId: string | number): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCT_ATTRIBUTE_VALUES.BY_PRODUCT(productId));
    return response.data;
  },

  async createProductAttributeValue(payload: { product_id: number; attribute_id: number; value: string }): Promise<ApiResponse<any>> {
    const response = await apiClient.post(API_ENDPOINTS.PRODUCT_ATTRIBUTE_VALUES.BASE, payload);
    return response.data;
  },

  async bulkAssignAttributeValues(payload: { product_id: number; attributes: Array<{ attribute_id: number; value: string }> }): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`${API_ENDPOINTS.PRODUCT_ATTRIBUTE_VALUES.BASE}/bulk`, payload);
    return response.data;
  },
};
