import { useState, useCallback } from "react";
import { extractErrorMessage } from "../utils/errorExtractor";
import { PaginationMeta } from "../types/api.types";

interface UsePaginatedApiOptions {
  initialPage?: number;
  initialLimit?: number;
  initialFilters?: Record<string, any>;
}

export function usePaginatedApi<T = any>(
  fetchFunction: (params: any) => Promise<any>,
  options: UsePaginatedApiOptions = {}
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(options.initialPage || 1);
  const [limit, setLimit] = useState<number>(options.initialLimit || 10);
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, any>>(options.initialFilters || {});
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: options.initialPage || 1,
    limit: options.initialLimit || 10,
    total: 0,
    totalPages: 1,
  });

  const fetchData = useCallback(
    async (overrideParams: Record<string, any> = {}) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = {
          page,
          limit,
          ...(search ? { search } : {}),
          ...filters,
          ...overrideParams,
        };

        const response = await fetchFunction(queryParams);
        const resData = response?.data || response;

        let resultItems: T[] = [];
        let meta: PaginationMeta = { page, limit, total: 0, totalPages: 1 };

        if (Array.isArray(resData)) {
          resultItems = resData;
          meta.total = resData.length;
        } else if (resData?.items && Array.isArray(resData.items)) {
          resultItems = resData.items;
          if (resData.pagination) {
            meta = {
              ...resData.pagination,
              totalPages: resData.pagination.totalPages || resData.pagination.total_pages || 1,
            };
          }
        } else if (response?.items && Array.isArray(response.items)) {
          resultItems = response.items;
          if (response.pagination) {
            meta = response.pagination;
          }
        }

        setItems(resultItems);
        setPagination(meta);
        setLoading(false);
        return { items: resultItems, pagination: meta };
      } catch (err: any) {
        const msg = extractErrorMessage(err);
        setError(msg);
        setLoading(false);
        throw err;
      }
    },
    [fetchFunction, page, limit, search, filters]
  );

  const nextPage = () => {
    if (page < (pagination.totalPages || pagination.total_pages || 1)) {
      setPage((p) => p + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  };

  const updateFilters = (newFilters: Record<string, any>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const updateSearch = (query: string) => {
    setSearch(query);
    setPage(1);
  };

  return {
    items,
    loading,
    error,
    page,
    limit,
    search,
    filters,
    pagination,
    fetchData,
    setPage,
    setLimit,
    updateSearch,
    updateFilters,
    nextPage,
    prevPage,
  };
}
