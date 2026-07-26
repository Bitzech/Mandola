import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { Category, SubCategory, Brand, Collection } from "../types/product.types";
import { ApiResponse } from "../types/api.types";

export const categoryService = {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.BASE);
    return response.data;
  },

  async getCategoryById(id: string | number): Promise<ApiResponse<Category>> {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.BY_ID(id));
    return response.data;
  },

  async createCategory(payload: { name: string; description?: string }): Promise<ApiResponse<Category>> {
    const response = await apiClient.post(API_ENDPOINTS.CATEGORIES.BASE, payload);
    return response.data;
  },

  async updateCategory(id: string | number, payload: { name?: string; status?: string }): Promise<ApiResponse<Category>> {
    const response = await apiClient.put(API_ENDPOINTS.CATEGORIES.BY_ID(id), payload);
    return response.data;
  },

  async deleteCategory(id: string | number): Promise<ApiResponse> {
    const response = await apiClient.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
    return response.data;
  },

  async getSubCategories(): Promise<ApiResponse<SubCategory[]>> {
    const response = await apiClient.get(API_ENDPOINTS.SUB_CATEGORIES.BASE);
    return response.data;
  },

  async getSubCategoriesByCategory(categoryId: string | number): Promise<ApiResponse<SubCategory[]>> {
    const response = await apiClient.get(API_ENDPOINTS.SUB_CATEGORIES.BY_CATEGORY(categoryId));
    return response.data;
  },

  async getBrands(): Promise<ApiResponse<Brand[]>> {
    const response = await apiClient.get(API_ENDPOINTS.BRANDS.BASE);
    return response.data;
  },

  async createBrand(payload: { name: string; logo?: string; description?: string }): Promise<ApiResponse<Brand>> {
    const response = await apiClient.post(API_ENDPOINTS.BRANDS.BASE, payload);
    return response.data;
  },

  async deleteBrand(id: string | number): Promise<ApiResponse> {
    const response = await apiClient.delete(API_ENDPOINTS.BRANDS.BY_ID(id));
    return response.data;
  },

  async getCollections(): Promise<ApiResponse<Collection[]>> {
    const response = await apiClient.get(API_ENDPOINTS.COLLECTIONS.BASE);
    return response.data;
  },

  async createCollection(payload: { name: string; description?: string }): Promise<ApiResponse<Collection>> {
    const response = await apiClient.post(API_ENDPOINTS.COLLECTIONS.BASE, payload);
    return response.data;
  },

  async deleteCollection(id: string | number): Promise<ApiResponse> {
    const response = await apiClient.delete(API_ENDPOINTS.COLLECTIONS.BY_ID(id));
    return response.data;
  },
};
