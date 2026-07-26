import { Product, ProductVariant } from "./product.types";

export interface CartItem {
  id: number;
  cart_id?: number;
  product_id: number;
  variant_id?: number;
  quantity: number;
  price: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface CartSummary {
  items: CartItem[];
  item_count?: number;
  total_items?: number;
  count?: number;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  grand_total: number;
  [key: string]: any;
}

export interface AddToCartInput {
  product_id?: number;
  variant_id?: number;
  product_variant_id?: number;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}
