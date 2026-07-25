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

  async getCollections(): Promise<ApiResponse<Collection[]>> {
    const response = await apiClient.get(API_ENDPOINTS.COLLECTIONS.BASE);
    return response.data;
  },
};
