export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  status?: string | number;
  sort_order?: number;
  product_count?: number;
  products_count?: number;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  status?: string | number;
  product_count?: number;
  products_count?: number;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  status?: string | number;
}

export interface Collection {
  id: number;
  name: string;
  slug: string;
  banner?: string;
  image?: string;
  description?: string;
  status?: string | number;
}

export interface Color {
  id: number;
  name: string;
  code: string;
  slug?: string;
  hex_code?: string;
  status?: string | number;
}

export interface Size {
  id: number;
  name: string;
  code: string;
  slug?: string;
  status?: string | number;
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
  image_url?: string;
  image?: string;
  url?: string;
  is_primary?: boolean;
  sort_order?: number;
}

export interface Product {
  id: number;
  seller_id?: number;
  category_id?: number;
  sub_category_id?: number;
  brand_id?: number;
  collection_id?: number;
  name: string;
  slug: string;
  sku?: string;
  short_description?: string;
  description?: string;
  price: number;
  sale_price?: number;
  regular_price?: number;
  mrp?: number;
  stock?: number;
  stock_quantity?: number;
  thumbnail?: string;
  primary_image?: string;
  image?: string;
  brand_name?: string;
  category_name?: string;
  seller_name?: string;
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
  tags?: string[] | string;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  seller_id?: number | string;
  category_id?: number | string;
  sub_category_id?: number | string;
  brand_id?: number | string;
  collection_id?: number | string;
  search?: string;
  status?: string;
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
