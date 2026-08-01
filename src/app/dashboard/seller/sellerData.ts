export type SellerSection =
  | "home" | "profile" | "products" | "add-product" | "inventory"
  | "orders" | "shipments" | "returns" | "payments" | "invoices"
  | "notifications" | "settings" | "change-password";

export type SellerNavigateFn = (section: SellerSection, id?: string) => void;

export const SELLER_SECTION_LABELS: Record<SellerSection, string> = {
  "home":            "Dashboard",
  "profile":         "My Profile",
  "products":        "Products",
  "add-product":     "Add Product",
  "inventory":       "Inventory",
  "orders":          "Orders",
  "shipments":       "Shipments",
  "returns":         "Returns",
  "payments":        "Payments & Settlements",
  "invoices":        "Invoices",
  "notifications":   "Notifications",
  "settings":        "Settings",
  "change-password": "Change Password",
};

export type SellerOrder = {
  id: string;
  customer: string;
  product: string;
  productImg: string;
  qty: number;
  amount: number;
  paymentStatus: "Paid" | "Pending" | "Refunded";
  orderStatus: "Pending" | "Confirmed" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
  address: string;
  tracking?: string;
  courier?: string;
};

export type SellerProduct = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  salePrice?: number;
  stock: number;
  status: "Active" | "Inactive" | "Out of Stock";
  img: string;
  sold: number;
};

export type SellerReturn = {
  id: string;
  orderId: string;
  customer: string;
  product: string;
  reason: string;
  status: "Requested" | "Approved" | "Rejected" | "Completed";
  date: string;
  amount: number;
  img: string;
};

export type Settlement = {
  id: string;
  period: string;
  orders: number;
  gross: number;
  fees: number;
  net: number;
  status: "Paid" | "Processing" | "Pending";
  date: string;
};

export type SellerNotification = {
  id: string;
  title: string;
  body: string;
  type: "order" | "payment" | "return" | "review" | "system";
  read: boolean;
  time: string;
};

export type SellerInvoice = {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending";
};

export const orderStatusColor = (s?: string) => {
  const status = (s || "").toLowerCase();
  if (status === "delivered")  return "bg-green-50 text-green-700";
  if (status === "shipped")    return "bg-blue-50 text-blue-700";
  if (status === "ready_to_ship" || status === "packed") return "bg-purple-50 text-purple-700";
  if (status === "confirmed" || status === "processing") return "bg-yellow-50 text-yellow-700";
  if (status === "pending")    return "bg-orange-50 text-orange-700";
  if (status === "cancelled")  return "bg-red-50 text-red-700";
  return "bg-gray-50 text-gray-700";
};

export const payStatusColor = (s?: string) => {
  const status = (s || "").toLowerCase();
  if (status === "paid")     return "bg-green-50 text-green-700";
  if (status === "pending")  return "bg-yellow-50 text-yellow-700";
  if (status === "refunded") return "bg-red-50 text-red-700";
  return "bg-gray-50 text-gray-700";
};

export const fmt = (n?: number | null) =>
  "₹" + Number(n || 0).toLocaleString("en-IN");
