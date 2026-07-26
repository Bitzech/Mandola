export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total?: number;
  total_items?: number;
  totalPages?: number;
  total_pages?: number;
}

export interface PaginatedData<T = any> {
  items: T[];
  pagination: PaginationMeta;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message?: string;
  data: PaginatedData<T> | T[];
  items?: T[];
  pagination?: PaginationMeta;
  [key: string]: any;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorPayload {
  success: false;
  message: string;
  errors?: ValidationErrorDetail[];
  statusCode?: number;
}
