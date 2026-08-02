import { ENV } from "../config/env";

/**
 * Formats product/category image URLs to ensure relative paths starting with /uploads
 * are properly prepended with the backend server host origin.
 */
export const formatImageUrl = (url?: string | null): string => {
  if (!url) {
    return "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=70";
  }
  if (url.startsWith("data:image/") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const apiBase = ENV.API_BASE_URL || "";
  const serverOrigin = apiBase.replace(/\/api\/v1\/?$/, "");
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${serverOrigin}${cleanPath}`;
};
