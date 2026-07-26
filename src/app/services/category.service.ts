import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { Category, SubCategory, Brand, Collection } from "../types/product.types";
import { ApiResponse } from "../types/api.types";

// In-memory cache for fast frontend responses
let categoriesCache: Category[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 30000; // 30 seconds

export const categoryService = {
  /**
   * Fetch all active categories from backend
   */
  async getCategories(forceRefresh = false): Promise<Category[]> {
    const now = Date.now();
    if (!forceRefresh && categoriesCache && (now - cacheTimestamp < CACHE_TTL_MS)) {
      return categoriesCache;
    }

    try {
      const response = await apiClient.get<ApiResponse<Category[]>>(API_ENDPOINTS.CATEGORIES.BASE);
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("[categoryService.getCategories ERROR]", error);
      return categoriesCache || [];
    }
  },

  /**
   * Fetch category details by ID
   */
  async getCategoryById(id: string | number): Promise<Category | null> {
    try {
      const response = await apiClient.get<ApiResponse<Category>>(API_ENDPOINTS.CATEGORIES.BY_ID(id));
      return response.data?.data || null;
    } catch (error) {
      console.error("[categoryService.getCategoryById ERROR]", error);
      return null;
    }
  },

  /**
   * Fetch all sub-categories (with optional query filters like category_id, limit=100)
   */
  async getSubCategories(params?: Record<string, any>): Promise<SubCategory[]> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(API_ENDPOINTS.SUB_CATEGORIES.BASE, {
        params: { limit: 100, ...params }
      });
      const data = response.data?.data;
      if (Array.isArray(data)) {
        return data;
      }
      if (data && Array.isArray(data.items)) {
        return data.items;
      }
      return [];
    } catch (error) {
      console.error("[categoryService.getSubCategories ERROR]", error);
      return [];
    }
  },

  /**
   * Fetch sub-categories belonging to a parent category
   */
  async getSubCategoriesByCategory(categoryId: string | number): Promise<SubCategory[]> {
    try {
      return await this.getSubCategories({ category_id: categoryId });
    } catch (error) {
      console.error("[categoryService.getSubCategoriesByCategory ERROR]", error);
      return [];
    }
  },

  /**
   * Optimized: Fetch categories and all sub-categories in parallel (Only 2 HTTP requests!)
   */
  async getCategoriesWithSubCategories(forceRefresh = false): Promise<Category[]> {
    const now = Date.now();
    if (!forceRefresh && categoriesCache && (now - cacheTimestamp < CACHE_TTL_MS)) {
      return categoriesCache;
    }

    try {
      // 2 parallel HTTP calls instead of 13+ sequential/individual calls
      const [categories, allSubCategories] = await Promise.all([
        this.getCategories(forceRefresh),
        this.getSubCategories({ limit: 100 })
      ]);

      if (!categories || categories.length === 0) return [];

      // Group sub-categories by category_id in memory
      const subMap = new Map<number, SubCategory[]>();
      allSubCategories.forEach((sub) => {
        const catId = Number(sub.category_id);
        if (!subMap.has(catId)) {
          subMap.set(catId, []);
        }
        subMap.get(catId)!.push(sub);
      });

      const result = categories.map((cat) => ({
        ...cat,
        subCategories: subMap.get(Number(cat.id)) || []
      }));

      categoriesCache = result;
      cacheTimestamp = Date.now();
      return result;
    } catch (error) {
      console.error("[categoryService.getCategoriesWithSubCategories ERROR]", error);
      return categoriesCache || [];
    }
  },

  async getBrands(): Promise<Brand[]> {
    try {
      const response = await apiClient.get<ApiResponse<Brand[]>>(API_ENDPOINTS.BRANDS.BASE);
      return response.data?.data || [];
    } catch (error) {
      console.error("[categoryService.getBrands ERROR]", error);
      return [];
    }
  },

  async getCollections(): Promise<Collection[]> {
    try {
      const response = await apiClient.get<ApiResponse<Collection[]>>(API_ENDPOINTS.COLLECTIONS.BASE);
      return response.data?.data || [];
    } catch (error) {
      console.error("[categoryService.getCollections ERROR]", error);
      return [];
    }
  },
};
