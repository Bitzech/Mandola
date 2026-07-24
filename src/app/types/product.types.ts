export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  status?: string | number;
  sort_order?: number;
  products_count?: number;
}

export interface SubCategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  status?: string | number;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  status?: string | number;
}

export interface Collection {
  id: number;
  name: string;
  slug: string;
  banner?: string;
  status?: string | number;
}

export interface Color {
  id: number;
  name: string;
  code: string;
  hex_code?: string;
}

export interface Size {
  id: number;
  name: string;
  code: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  color_id?: number;
  size_id?: number;
  sku: string;
  price: number;
  sale_price?: number;
  stock: number;
  status?: string;
  color?: Color;
  size?: Size;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_primary?: boolean;
  sort_order?: number;
}

export interface Product {
  id: number;
  seller_id?: number;
  category_id?: number;
  sub_category_id?: number;
  brand_id?: number;
  name: string;
  slug: string;
  sku?: string;
  short_description?: string;
  description?: string;
  price: number;
  sale_price?: number;
  stock?: number;
  thumbnail?: string;
  status?: string;
  approval_status?: string;
  featured?: boolean;
  is_new_arrival?: boolean;
  is_best_seller?: boolean;
  is_trending?: boolean;
  rating?: number;
  reviews_count?: number;
  category?: Category;
  brand?: Brand;
  variants?: ProductVariant[];
  images?: ProductImage[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category_id?: number;
  sub_category_id?: number;
  brand_id?: number;
  collection_id?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  size_id?: number;
  color_id?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  featured?: boolean;
  is_new_arrival?: boolean;
  is_trending?: boolean;
  is_best_seller?: boolean;
}
