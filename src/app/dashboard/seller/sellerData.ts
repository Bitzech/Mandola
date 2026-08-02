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

export const SELLER_ORDERS: SellerOrder[] = [
  {
    id: "ORD-8821",
    customer: "Priya Sharma",
    product: "Sanskrit Devotional Copper Diya",
    productImg: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200",
    qty: 2,
    amount: 1499,
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    date: "14 Jul 2025",
    address: "B-402, Green Acres, Powai, Mumbai - 400076",
    tracking: "IND9823411",
    courier: "Delhivery",
  },
  {
    id: "ORD-8822",
    customer: "Amitav Ghosh",
    product: "Handcrafted Brass Bell",
    productImg: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=200",
    qty: 1,
    amount: 899,
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    date: "12 Jul 2025",
    address: "12/A Park Street, Kolkata - 700016",
    tracking: "IND9823412",
    courier: "BlueDart",
  },
  {
    id: "ORD-8823",
    customer: "Sunita Reddy",
    product: "Vedic Chanting Incense Set",
    productImg: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200",
    qty: 3,
    amount: 650,
    paymentStatus: "Pending",
    orderStatus: "Pending",
    date: "15 Jul 2025",
    address: "Plot 45, Jubilee Hills, Hyderabad - 500033",
  },
];

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
