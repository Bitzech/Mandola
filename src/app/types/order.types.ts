import { Product } from "./product.types";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Address {
  id?: number | string;
  user_id?: number;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  address_type?: "home" | "office" | "other";
  is_default?: boolean;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  variant_id?: number;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  size?: string;
  color?: string;
  product?: Product;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  seller_id?: number;
  subtotal: number;
  discount_amount?: number;
  tax_amount?: number;
  shipping_charge?: number;
  grand_total: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method?: string;
  shipping_address?: Address;
  items?: OrderItem[];
  created_at?: string;
  updated_at?: string;
}

export interface Shipment {
  id: number;
  shipment_number: string;
  order_id: number;
  courier_name: string;
  tracking_number?: string;
  awb_number?: string;
  status: string;
  shipped_at?: string;
  estimated_delivery_date?: string;
  delivered_at?: string;
}
