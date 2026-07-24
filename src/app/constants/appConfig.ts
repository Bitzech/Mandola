export const APP_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    ADMIN_DEFAULT_LIMIT: 10,
  },
  ROLE_IDS: {
    ADMIN: 1,
    SELLER: 2,
    CUSTOMER: 3,
  },
  ROLES: {
    ADMIN: "admin",
    SELLER: "seller",
    CUSTOMER: "customer",
  },
  DEBOUNCE_DELAY: 400,
} as const;
