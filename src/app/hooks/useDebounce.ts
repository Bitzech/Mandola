import { useState, useEffect } from "react";
import { APP_CONFIG } from "../constants/appConfig";

export function useDebounce<T>(value: T, delay: number = APP_CONFIG.DEBOUNCE_DELAY): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
