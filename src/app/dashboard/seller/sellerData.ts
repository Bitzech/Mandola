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

export const MOCK_SELLER = {
  name: "Priya Fashions",
  owner: "Priya Mehta",
  email: "seller@gmail.com",
  phone: "+91 98765 43210",
  gst: "27AAPFU0939F1ZV",
  rating: 4.7,
  totalRatings: 238,
  memberSince: "March 2022",
  verified: true,
  avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80",
  banner: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80",
  storeName: "Priya Fashions",
  address: "Shop 12, Fashion Street, Bandra West, Mumbai 400050",
  bank: { name: "HDFC Bank", account: "XXXX XXXX 4521", ifsc: "HDFC0001234" },
  profileCompletion: 88,
};

export const SELLER_STATS = {
  totalProducts: 142,
  activeProducts: 128,
  totalOrders: 1847,
  pendingOrders: 34,
  deliveredOrders: 1689,
  totalRevenue: 2847500,
  pendingSettlement: 184200,
  totalEarnings: 2663300,
};

export const MONTHLY_SALES = [
  { month: "Jan", revenue: 184000, orders: 98  },
  { month: "Feb", revenue: 210000, orders: 112 },
  { month: "Mar", revenue: 195000, orders: 104 },
  { month: "Apr", revenue: 228000, orders: 121 },
  { month: "May", revenue: 256000, orders: 138 },
  { month: "Jun", revenue: 241000, orders: 129 },
  { month: "Jul", revenue: 287000, orders: 153 },
  { month: "Aug", revenue: 312000, orders: 167 },
  { month: "Sep", revenue: 298000, orders: 159 },
  { month: "Oct", revenue: 334000, orders: 178 },
  { month: "Nov", revenue: 356000, orders: 190 },
  { month: "Dec", revenue: 146500, orders: 78  },
];

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
  { id: "#ORD-8841", customer: "Ananya Sharma", product: "Floral Silk Saree", productImg: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=80&q=70", qty: 1, amount: 4200, paymentStatus: "Paid",    orderStatus: "Shipped",   date: "12 Jul 2025", address: "42 Park Ave, Delhi", tracking: "BD7829182", courier: "Blue Dart" },
  { id: "#ORD-8840", customer: "Meera Iyer",   product: "Embroidered Kurti",  productImg: "https://images.unsplash.com/photo-1591130222377-15bc1f1b8bfc?w=80&q=70", qty: 2, amount: 3600, paymentStatus: "Paid",    orderStatus: "Delivered", date: "11 Jul 2025", address: "7 MG Road, Bengaluru", tracking: "DT5541908", courier: "Delhivery" },
  { id: "#ORD-8839", customer: "Sonal Verma",  product: "Banarasi Lehenga",   productImg: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=80&q=70", qty: 1, amount: 12800, paymentStatus: "Paid",   orderStatus: "Confirmed", date: "10 Jul 2025", address: "89 Park Street, Kolkata" },
  { id: "#ORD-8838", customer: "Ritu Singh",   product: "Cotton Kurta Set",   productImg: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=80&q=70", qty: 3, amount: 5400, paymentStatus: "Pending", orderStatus: "Pending",   date: "10 Jul 2025", address: "15 Anna Salai, Chennai" },
  { id: "#ORD-8837", customer: "Kavya Nair",   product: "Georgette Anarkali", productImg: "https://images.unsplash.com/photo-1559181567-c3190bba186d?w=80&q=70", qty: 1, amount: 2900, paymentStatus: "Paid",    orderStatus: "Packed",    date: "9 Jul 2025",  address: "23 Marine Drive, Mumbai" },
  { id: "#ORD-8836", customer: "Divya Reddy",  product: "Designer Blouse",    productImg: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=80&q=70", qty: 2, amount: 3200, paymentStatus: "Refunded", orderStatus: "Cancelled", date: "8 Jul 2025", address: "Hitech City, Hyderabad" },
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

export const SELLER_PRODUCTS: SellerProduct[] = [
  { id: "P001", name: "Floral Silk Saree",       sku: "SAR-FS-001", category: "Sarees",      price: 4200,  salePrice: 3800,  stock: 42,  status: "Active",       img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=70", sold: 187 },
  { id: "P002", name: "Embroidered Kurti Set",    sku: "KUR-EM-002", category: "Kurtas",      price: 1800,  salePrice: 1500,  stock: 8,   status: "Active",       img: "https://images.unsplash.com/photo-1591130222377-15bc1f1b8bfc?w=200&q=70", sold: 243 },
  { id: "P003", name: "Banarasi Lehenga Choli",  sku: "LEH-BN-003", category: "Lehengas",    price: 12800,                   stock: 0,   status: "Out of Stock", img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&q=70", sold: 52 },
  { id: "P004", name: "Cotton Kurta Set",         sku: "KUR-CT-004", category: "Kurtas",      price: 1800,                   stock: 145, status: "Active",       img: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=200&q=70", sold: 312 },
  { id: "P005", name: "Georgette Anarkali",       sku: "ANK-GE-005", category: "Anarkalis",   price: 2900,  salePrice: 2400,  stock: 6,   status: "Active",       img: "https://images.unsplash.com/photo-1559181567-c3190bba186d?w=200&q=70", sold: 98 },
  { id: "P006", name: "Chanderi Suit Set",        sku: "SUT-CH-006", category: "Suits",       price: 3400,                   stock: 23,  status: "Active",       img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&q=70", sold: 76 },
  { id: "P007", name: "Printed Palazzo Set",      sku: "PAL-PR-007", category: "Western",     price: 1600,  salePrice: 1299,  stock: 0,   status: "Inactive",     img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=200&q=70", sold: 134 },
  { id: "P008", name: "Silk Dupatta",             sku: "DUP-SK-008", category: "Accessories", price: 850,                    stock: 5,   status: "Active",       img: "https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?w=200&q=70", sold: 289 },
];

export const LOW_STOCK_PRODUCTS = SELLER_PRODUCTS.filter(p => p.stock > 0 && p.stock <= 10);

export const BEST_SELLING = [...SELLER_PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 5);

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

export const SELLER_RETURNS: SellerReturn[] = [
  { id: "RET-021", orderId: "#ORD-8812", customer: "Sneha Kulkarni", product: "Floral Silk Saree",  reason: "Size issue",           status: "Requested", date: "10 Jul 2025", amount: 4200, img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=80&q=70" },
  { id: "RET-020", orderId: "#ORD-8791", customer: "Lakshmi Rao",    product: "Cotton Kurta Set",   reason: "Wrong color received", status: "Approved",  date: "8 Jul 2025",  amount: 1800, img: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=80&q=70" },
  { id: "RET-019", orderId: "#ORD-8745", customer: "Pooja Sharma",   product: "Georgette Anarkali", reason: "Defective product",    status: "Completed", date: "5 Jul 2025",  amount: 2900, img: "https://images.unsplash.com/photo-1559181567-c3190bba186d?w=80&q=70" },
  { id: "RET-018", orderId: "#ORD-8712", customer: "Asha Patel",     product: "Embroidered Kurti",  reason: "Not as described",     status: "Rejected",  date: "2 Jul 2025",  amount: 1800, img: "https://images.unsplash.com/photo-1591130222377-15bc1f1b8bfc?w=80&q=70" },
];

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

export const SETTLEMENTS: Settlement[] = [
  { id: "SET-112", period: "1–15 Jun 2025",  orders: 87,  gross: 184200, fees: 9210,  net: 174990, status: "Paid",       date: "18 Jun 2025" },
  { id: "SET-111", period: "16–30 May 2025", orders: 79,  gross: 162400, fees: 8120,  net: 154280, status: "Paid",       date: "3 Jun 2025"  },
  { id: "SET-110", period: "1–15 May 2025",  orders: 93,  gross: 197600, fees: 9880,  net: 187720, status: "Paid",       date: "18 May 2025" },
  { id: "SET-109", period: "16–30 Apr 2025", orders: 68,  gross: 138700, fees: 6935,  net: 131765, status: "Paid",       date: "3 May 2025"  },
  { id: "SET-113", period: "16–30 Jun 2025", orders: 94,  gross: 198300, fees: 9915,  net: 188385, status: "Processing", date: "Pending"     },
  { id: "SET-114", period: "1–15 Jul 2025",  orders: 34,  gross: 71400,  fees: 3570,  net: 67830,  status: "Pending",   date: "Expected: 18 Jul 2025" },
];

export type SellerNotification = {
  id: string;
  title: string;
  body: string;
  type: "order" | "payment" | "return" | "review" | "system";
  read: boolean;
  time: string;
};

export const SELLER_NOTIFICATIONS: SellerNotification[] = [
  { id: "N1", title: "New Order Received",          body: "#ORD-8841 — Floral Silk Saree from Ananya Sharma",     type: "order",   read: false, time: "2 hrs ago"  },
  { id: "N2", title: "Return Request",              body: "RET-021 — Sneha Kulkarni requested a return",           type: "return",  read: false, time: "5 hrs ago"  },
  { id: "N3", title: "Payment Settled",             body: "₹1,74,990 credited for SET-112 (Jun 1–15)",             type: "payment", read: false, time: "1 day ago"  },
  { id: "N4", title: "New Review",                  body: "Meera Iyer left 5 stars on Embroidered Kurti Set",     type: "review",  read: true,  time: "2 days ago" },
  { id: "N5", title: "Low Stock Alert",             body: "Embroidered Kurti Set — only 8 units remaining",       type: "system",  read: true,  time: "3 days ago" },
  { id: "N6", title: "Product Approved",            body: "Chanderi Suit Set has been approved by the platform",  type: "system",  read: true,  time: "4 days ago" },
];

export type SellerInvoice = {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending";
};

export const SELLER_INVOICES: SellerInvoice[] = [
  { id: "INV-8841", orderId: "#ORD-8841", customer: "Ananya Sharma", amount: 4200,  date: "12 Jul 2025", status: "Paid"    },
  { id: "INV-8840", orderId: "#ORD-8840", customer: "Meera Iyer",    amount: 3600,  date: "11 Jul 2025", status: "Paid"    },
  { id: "INV-8839", orderId: "#ORD-8839", customer: "Sonal Verma",   amount: 12800, date: "10 Jul 2025", status: "Paid"    },
  { id: "INV-8838", orderId: "#ORD-8838", customer: "Ritu Singh",    amount: 5400,  date: "10 Jul 2025", status: "Pending" },
  { id: "INV-8837", orderId: "#ORD-8837", customer: "Kavya Nair",    amount: 2900,  date: "9 Jul 2025",  status: "Paid"    },
];

export const INVENTORY_HISTORY = [
  { date: "12 Jul 2025", product: "Floral Silk Saree",      sku: "SAR-FS-001", type: "Sale",     qty: -2,  balance: 42 },
  { date: "11 Jul 2025", product: "Embroidered Kurti Set",  sku: "KUR-EM-002", type: "Sale",     qty: -1,  balance: 8  },
  { date: "10 Jul 2025", product: "Cotton Kurta Set",       sku: "KUR-CT-004", type: "Restock",  qty: +50, balance: 145 },
  { date: "9 Jul 2025",  product: "Georgette Anarkali",     sku: "ANK-GE-005", type: "Sale",     qty: -3,  balance: 6  },
  { date: "8 Jul 2025",  product: "Silk Dupatta",           sku: "DUP-SK-008", type: "Return",   qty: +1,  balance: 5  },
  { date: "7 Jul 2025",  product: "Chanderi Suit Set",      sku: "SUT-CH-006", type: "Sale",     qty: -2,  balance: 23 },
];

export const SELLER_REVIEWS = [
  { id: "R1", customer: "Meera Iyer",    product: "Embroidered Kurti Set",  rating: 5, text: "Absolutely beautiful quality! The embroidery is stunning and the fabric feels luxurious. Will definitely order again.", date: "11 Jul 2025", replied: false },
  { id: "R2", customer: "Ananya Sharma", product: "Floral Silk Saree",      rating: 4, text: "Lovely saree, perfect for festive occasions. Colour is exactly as shown. Delivery was prompt.", date: "10 Jul 2025", replied: true  },
  { id: "R3", customer: "Kavya Nair",    product: "Georgette Anarkali",     rating: 5, text: "Exceeded my expectations! The fit is perfect and the georgette feels so light and breathable.", date: "9 Jul 2025",  replied: false },
  { id: "R4", customer: "Sonal Verma",   product: "Banarasi Lehenga Choli", rating: 3, text: "Good quality but delivery was delayed by 3 days. The product itself is beautiful though.", date: "5 Jul 2025",  replied: true  },
];

export const orderStatusColor = (s: string) => {
  if (s === "Delivered")  return "bg-green-50 text-green-700";
  if (s === "Shipped")    return "bg-blue-50 text-blue-700";
  if (s === "Packed")     return "bg-purple-50 text-purple-700";
  if (s === "Confirmed")  return "bg-yellow-50 text-yellow-700";
  if (s === "Pending")    return "bg-orange-50 text-orange-700";
  if (s === "Cancelled")  return "bg-red-50 text-red-700";
  return "bg-gray-50 text-gray-700";
};

export const payStatusColor = (s: string) => {
  if (s === "Paid")     return "bg-green-50 text-green-700";
  if (s === "Pending")  return "bg-yellow-50 text-yellow-700";
  if (s === "Refunded") return "bg-red-50 text-red-700";
  return "bg-gray-50 text-gray-700";
};

export const fmt = (n: number) =>
  "₹" + n.toLocaleString("en-IN");
