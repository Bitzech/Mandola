import { AuthUser } from "./auth.types";
import { SellerProfile } from "./seller.types";

export interface AdminDashboardSummary {
  totalCustomers: number;
  totalSellers: number;
  totalProducts: number;
  activeProducts: number;
  pendingProducts: number;
  todayOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  todayRevenue: number;
  monthlyRevenue: number;
  platformCommission: number;
  pendingSettlements: number;
  returnRequests: number;
  pendingRefunds: number;
}

export interface AdminUserListItem extends AuthUser {
  status: "active" | "blocked";
  orders_count?: number;
  created_at?: string;
}

export interface AdminSellerListItem extends SellerProfile {
  products_count?: number;
  orders_count?: number;
  total_revenue?: number;
}

export interface SystemSetting {
  id: number;
  key: string;
  value: string;
  description?: string;
  type?: string;
}
