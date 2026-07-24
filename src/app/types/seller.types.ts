import { Order } from "./order.types";
import { Product } from "./product.types";

export interface SellerProfile {
  id: number;
  user_id: number;
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  gstin?: string;
  pan_number?: string;
  store_name: string;
  description?: string;
  logo?: string;
  banner?: string;
  address?: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  created_at?: string;
}

export interface SellerDashboardSummary {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  pendingSettlement: number;
  totalEarnings: number;
}

export interface SellerSettlement {
  id: number;
  settlement_number: string;
  seller_id: number;
  period: string;
  orders_count: number;
  gross_amount: number;
  platform_fees: number;
  net_amount: number;
  status: "pending" | "processing" | "paid";
  due_date?: string;
  created_at?: string;
}

export interface SellerOrder extends Order {
  seller_order_id?: number;
  commission_amount?: number;
  net_seller_amount?: number;
}
