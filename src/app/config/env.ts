export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://mandola-backend.onrender.com/api/v1",
  APP_NAME: import.meta.env.VITE_APP_NAME || "Mandola",
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};
