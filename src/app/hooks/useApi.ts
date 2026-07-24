import { useState, useCallback } from "react";
import { extractErrorMessage } from "../utils/errorExtractor";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T = any>(asyncFunction: (...args: any[]) => Promise<any>) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await asyncFunction(...args);
        const resultData = response?.data !== undefined ? response.data : response;
        setState({ data: resultData, loading: false, error: null });
        return resultData;
      } catch (err: any) {
        const message = extractErrorMessage(err);
        setState((prev) => ({ ...prev, loading: false, error: message }));
        throw err;
      }
    },
    [asyncFunction]
  );

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    setData: (data: T | null) => setState((prev) => ({ ...prev, data })),
  };
}
