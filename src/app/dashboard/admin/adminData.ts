export type AdminSection =
  | "home" | "users" | "sellers" | "products" | "categories" | "brands"
  | "collections" | "orders" | "payments" | "wallet" | "settlements"
  | "returns" | "reviews" | "notifications" | "invoices" | "reports"
  | "settings" | "profile" | "change-password";

export type AdminNavigateFn = (section: AdminSection, id?: string) => void;

export const ADMIN_SECTION_LABELS: Record<AdminSection, string> = {
  "home":            "Dashboard",
  "users":           "Users",
  "sellers":         "Sellers",
  "products":        "Products",
  "categories":      "Categories",
  "brands":          "Brands",
  "collections":     "Collections",
  "orders":          "Orders",
  "payments":        "Payments",
  "wallet":          "Admin Wallet",
  "settlements":     "Seller Settlements",
  "returns":         "Returns & Refunds",
  "reviews":         "Reviews",
  "notifications":   "Notifications",
  "invoices":        "Invoices",
  "reports":         "Reports",
  "settings":        "Website Settings",
  "profile":         "Admin Profile",
  "change-password": "Change Password",
};

export const MOCK_ADMIN = {
  name: "Arjun Mandola",
  email: "admin@gmail.com",
  phone: "+91 99001 12345",
  role: "Super Admin",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  memberSince: "Jan 2022",
};

export const ADMIN_STATS = {
  totalCustomers: 12847,
  totalSellers: 342,
  totalProducts: 8921,
  activeProducts: 7834,
  pendingProducts: 187,
  todayOrders: 234,
  pendingOrders: 89,
  completedOrders: 118432,
  cancelledOrders: 3421,
  todayRevenue: 184200,
  monthlyRevenue: 4287500,
  platformCommission: 428750,
  pendingSettlements: 892400,
  returnRequests: 47,
  pendingRefunds: 23,
};

export const ADMIN_MONTHLY = [
  { month: "Jan", revenue: 2840000, orders: 1820, commission: 284000 },
  { month: "Feb", revenue: 3120000, orders: 2010, commission: 312000 },
  { month: "Mar", revenue: 2980000, orders: 1890, commission: 298000 },
  { month: "Apr", revenue: 3450000, orders: 2230, commission: 345000 },
  { month: "May", revenue: 3870000, orders: 2490, commission: 387000 },
  { month: "Jun", revenue: 3620000, orders: 2340, commission: 362000 },
  { month: "Jul", revenue: 4120000, orders: 2650, commission: 412000 },
  { month: "Aug", revenue: 4540000, orders: 2920, commission: 454000 },
  { month: "Sep", revenue: 4280000, orders: 2760, commission: 428000 },
  { month: "Oct", revenue: 4870000, orders: 3140, commission: 487000 },
  { month: "Nov", revenue: 5230000, orders: 3370, commission: 523000 },
  { month: "Dec", revenue: 4287500, orders: 2760, commission: 428750 },
];

export const TOP_CATEGORIES = [
  { name: "Sarees",      products: 2140, orders: 18420, revenue: 1284000 },
  { name: "Kurtas",      products: 1890, orders: 22810, revenue: 984000  },
  { name: "Lehengas",    products: 920,  orders: 8240,  revenue: 2140000 },
  { name: "Western",     products: 1240, orders: 14200, revenue: 742000  },
  { name: "Accessories", products: 1870, orders: 31200, revenue: 624000  },
];

export type AdminUser = {
  id: string; name: string; email: string; phone: string;
  status: "Active" | "Blocked"; orders: number; joined: string; avatar: string;
};

export const ADMIN_USERS: AdminUser[] = [
  { id: "U001", name: "Ananya Sharma",  email: "ananya@example.com",  phone: "+91 98765 43210", status: "Active",  orders: 14, joined: "12 Mar 2024", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=70" },
  { id: "U002", name: "Meera Iyer",     email: "meera@example.com",   phone: "+91 87654 32109", status: "Active",  orders: 8,  joined: "5 Apr 2024",  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=70" },
  { id: "U003", name: "Ritu Singh",     email: "ritu@example.com",    phone: "+91 76543 21098", status: "Blocked", orders: 2,  joined: "20 Jan 2024", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&q=70" },
  { id: "U004", name: "Kavya Nair",     email: "kavya@example.com",   phone: "+91 65432 10987", status: "Active",  orders: 21, joined: "8 Feb 2024",  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=70" },
  { id: "U005", name: "Sonal Verma",    email: "sonal@example.com",   phone: "+91 54321 09876", status: "Active",  orders: 6,  joined: "14 May 2024", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&q=70" },
  { id: "U006", name: "Divya Reddy",    email: "divya@example.com",   phone: "+91 43210 98765", status: "Active",  orders: 17, joined: "2 Jun 2024",  avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=60&q=70" },
];

export type AdminSeller = {
  id: string; name: string; store: string; email: string; phone: string;
  status: "Approved" | "Pending" | "Rejected" | "Suspended";
  products: number; orders: number; revenue: number; joined: string; avatar: string;
};

export const ADMIN_SELLERS: AdminSeller[] = [
  { id: "S001", name: "Priya Mehta",    store: "Priya Fashions",    email: "seller@gmail.com",    phone: "+91 98765 43210", status: "Approved",  products: 142, orders: 1847, revenue: 2847500, joined: "Mar 2022", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=60&q=70" },
  { id: "S002", name: "Sunita Joshi",   store: "Ethnic Elegance",   email: "sunita@example.com",  phone: "+91 87654 32109", status: "Approved",  products: 98,  orders: 1243, revenue: 1920000, joined: "Jun 2022", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&q=70" },
  { id: "S003", name: "Kavitha Rao",    store: "Silk Route",        email: "kavitha@example.com", phone: "+91 76543 21098", status: "Pending",   products: 0,   orders: 0,    revenue: 0,       joined: "10 Jul 2025", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&q=70" },
  { id: "S004", name: "Rekha Sharma",   store: "Rekha Collections", email: "rekha@example.com",   phone: "+91 65432 10987", status: "Pending",   products: 0,   orders: 0,    revenue: 0,       joined: "11 Jul 2025", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&q=70" },
  { id: "S005", name: "Neha Gupta",     store: "Neha Trends",       email: "neha@example.com",    phone: "+91 54321 09876", status: "Suspended", products: 54,  orders: 421,  revenue: 624000,  joined: "Sep 2022", avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=60&q=70" },
  { id: "S006", name: "Pooja Agarwal",  store: "Puja Styles",       email: "pooja@example.com",   phone: "+91 43210 98765", status: "Rejected",  products: 0,   orders: 0,    revenue: 0,       joined: "1 Jul 2025", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=70" },
];

export type AdminProduct = {
  id: string; name: string; seller: string; category: string;
  price: number; stock: number;
  status: "Approved" | "Pending" | "Rejected";
  img: string; sku: string;
};

export const ADMIN_PRODUCTS: AdminProduct[] = [
  { id: "P001", name: "Floral Silk Saree",       seller: "Priya Fashions",    category: "Sarees",    price: 4200,  stock: 42, status: "Approved", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=80&q=70", sku: "SAR-FS-001" },
  { id: "P002", name: "Embroidered Kurti Set",    seller: "Ethnic Elegance",   category: "Kurtas",    price: 1800,  stock: 8,  status: "Approved", img: "https://images.unsplash.com/photo-1591130222377-15bc1f1b8bfc?w=80&q=70", sku: "KUR-EM-002" },
  { id: "P003", name: "Banarasi Lehenga Choli",  seller: "Priya Fashions",    category: "Lehengas",  price: 12800, stock: 0,  status: "Pending",  img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=80&q=70", sku: "LEH-BN-003" },
  { id: "P004", name: "Cotton Kurta Set",         seller: "Silk Route",        category: "Kurtas",    price: 1800,  stock: 145,status: "Pending",  img: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=80&q=70", sku: "KUR-CT-004" },
  { id: "P005", name: "Georgette Anarkali",       seller: "Ethnic Elegance",   category: "Anarkalis", price: 2900,  stock: 6,  status: "Approved", img: "https://images.unsplash.com/photo-1559181567-c3190bba186d?w=80&q=70", sku: "ANK-GE-005" },
  { id: "P006", name: "Designer Block Print Kurti", seller: "Neha Trends",    category: "Kurtas",    price: 2200,  stock: 0,  status: "Rejected", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=80&q=70", sku: "KUR-BP-006" },
];

export type AdminOrder = {
  id: string; customer: string; seller: string; product: string; productImg: string;
  amount: number; payStatus: "Paid" | "Pending" | "Refunded";
  orderStatus: "Pending" | "Confirmed" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
  date: string; commission: number;
};

export const ADMIN_ORDERS: AdminOrder[] = [
  { id: "#ORD-9841", customer: "Ananya Sharma", seller: "Priya Fashions",   product: "Floral Silk Saree",      productImg: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=60&q=70", amount: 4200,  payStatus: "Paid",    orderStatus: "Shipped",   date: "12 Jul 2025", commission: 420  },
  { id: "#ORD-9840", customer: "Meera Iyer",    seller: "Ethnic Elegance",  product: "Embroidered Kurti Set",  productImg: "https://images.unsplash.com/photo-1591130222377-15bc1f1b8bfc?w=60&q=70", amount: 3600,  payStatus: "Paid",    orderStatus: "Delivered", date: "11 Jul 2025", commission: 360  },
  { id: "#ORD-9839", customer: "Sonal Verma",   seller: "Priya Fashions",   product: "Banarasi Lehenga",       productImg: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=60&q=70", amount: 12800, payStatus: "Paid",    orderStatus: "Confirmed", date: "10 Jul 2025", commission: 1280 },
  { id: "#ORD-9838", customer: "Ritu Singh",    seller: "Silk Route",       product: "Cotton Kurta Set",       productImg: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=60&q=70", amount: 5400,  payStatus: "Pending", orderStatus: "Pending",   date: "10 Jul 2025", commission: 540  },
  { id: "#ORD-9837", customer: "Kavya Nair",    seller: "Ethnic Elegance",  product: "Georgette Anarkali",     productImg: "https://images.unsplash.com/photo-1559181567-c3190bba186d?w=60&q=70", amount: 2900,  payStatus: "Paid",    orderStatus: "Packed",    date: "9 Jul 2025",  commission: 290  },
  { id: "#ORD-9836", customer: "Divya Reddy",   seller: "Priya Fashions",   product: "Designer Blouse",        productImg: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=60&q=70", amount: 3200,  payStatus: "Refunded",orderStatus: "Cancelled", date: "8 Jul 2025",  commission: 0    },
];

export const ADMIN_NOTIFICATIONS = [
  { id: "N1", title: "New Seller Registration",    body: "Kavitha Rao applied to become a seller",                type: "seller",  read: false, time: "1 hr ago"   },
  { id: "N2", title: "Product Approval Needed",    body: "Banarasi Lehenga Choli pending review from Priya Fashions", type: "product", read: false, time: "2 hrs ago"  },
  { id: "N3", title: "Return Request",             body: "#RET-021 — Sneha Kulkarni requested a return",          type: "return",  read: false, time: "4 hrs ago"  },
  { id: "N4", title: "Settlement Due",             body: "Priya Fashions — ₹1,74,990 settlement pending",         type: "payment", read: true,  time: "1 day ago"  },
  { id: "N5", title: "Low Stock Alert",            body: "Embroidered Kurti Set — 8 units remaining",             type: "system",  read: true,  time: "2 days ago" },
  { id: "N6", title: "New Order",                  body: "#ORD-9841 placed by Ananya Sharma",                     type: "order",   read: true,  time: "2 days ago" },
];

export const ADMIN_RETURNS = [
  { id: "RET-021", orderId: "#ORD-9812", customer: "Sneha Kulkarni", seller: "Priya Fashions", product: "Floral Silk Saree", reason: "Size issue",          status: "Requested" as const, amount: 4200, date: "10 Jul 2025", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=60&q=70" },
  { id: "RET-020", orderId: "#ORD-9791", customer: "Lakshmi Rao",    seller: "Ethnic Elegance", product: "Cotton Kurta Set",  reason: "Wrong colour",       status: "Approved"  as const, amount: 1800, date: "8 Jul 2025",  img: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=60&q=70" },
  { id: "RET-019", orderId: "#ORD-9745", customer: "Pooja Sharma",   seller: "Ethnic Elegance", product: "Georgette Anarkali",reason: "Defective product",   status: "Completed" as const, amount: 2900, date: "5 Jul 2025",  img: "https://images.unsplash.com/photo-1559181567-c3190bba186d?w=60&q=70" },
  { id: "RET-018", orderId: "#ORD-9712", customer: "Asha Patel",     seller: "Priya Fashions",  product: "Embroidered Kurti", reason: "Not as described",   status: "Rejected"  as const, amount: 1800, date: "2 Jul 2025",  img: "https://images.unsplash.com/photo-1591130222377-15bc1f1b8bfc?w=60&q=70" },
];

export const ADMIN_REVIEWS = [
  { id: "R1", customer: "Meera Iyer",    product: "Embroidered Kurti Set", seller: "Ethnic Elegance", rating: 5, text: "Absolutely beautiful quality!", date: "11 Jul 2025", reported: false },
  { id: "R2", customer: "Ananya Sharma", product: "Floral Silk Saree",     seller: "Priya Fashions",  rating: 4, text: "Lovely saree, prompt delivery.", date: "10 Jul 2025", reported: true  },
  { id: "R3", customer: "Kavya Nair",    product: "Georgette Anarkali",    seller: "Ethnic Elegance", rating: 5, text: "Exceeded my expectations!",       date: "9 Jul 2025",  reported: false },
  { id: "R4", customer: "Sonal Verma",   product: "Banarasi Lehenga",      seller: "Priya Fashions",  rating: 3, text: "Good quality but delayed.",        date: "5 Jul 2025",  reported: false },
];

export const ADMIN_INVOICES = [
  { id: "INV-9841", orderId: "#ORD-9841", customer: "Ananya Sharma", seller: "Priya Fashions",  amount: 4200,  commission: 420,  date: "12 Jul 2025", type: "Customer" as const },
  { id: "INV-9840", orderId: "#ORD-9840", customer: "Meera Iyer",    seller: "Ethnic Elegance", amount: 3600,  commission: 360,  date: "11 Jul 2025", type: "Customer" as const },
  { id: "INV-9839", orderId: "#ORD-9839", customer: "Sonal Verma",   seller: "Priya Fashions",  amount: 12800, commission: 1280, date: "10 Jul 2025", type: "Seller"   as const },
  { id: "INV-9838", orderId: "#ORD-9838", customer: "Ritu Singh",    seller: "Silk Route",      amount: 5400,  commission: 540,  date: "10 Jul 2025", type: "Customer" as const },
];

export const ADMIN_SETTLEMENTS = [
  { id: "SET-112", seller: "Priya Fashions",  period: "1–15 Jun 2025",  orders: 87,  gross: 184200, fees: 18420,  net: 165780, status: "Pending"    as const, due: "18 Jul 2025" },
  { id: "SET-111", seller: "Ethnic Elegance", period: "16–30 May 2025", orders: 62,  gross: 124800, fees: 12480,  net: 112320, status: "Completed"  as const, due: "Paid 3 Jun"  },
  { id: "SET-110", seller: "Silk Route",      period: "1–15 May 2025",  orders: 34,  gross: 68200,  fees: 6820,   net: 61380,  status: "Pending"    as const, due: "18 Jul 2025" },
  { id: "SET-109", seller: "Priya Fashions",  period: "16–30 Apr 2025", orders: 79,  gross: 162400, fees: 16240,  net: 146160, status: "Completed"  as const, due: "Paid 3 May"  },
];

export const CATEGORIES = [
  { id: "C1", name: "Sarees",      slug: "sarees",      products: 2140, status: "Active",   img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=60&q=70" },
  { id: "C2", name: "Kurtas",      slug: "kurtas",      products: 1890, status: "Active",   img: "https://images.unsplash.com/photo-1591130222377-15bc1f1b8bfc?w=60&q=70" },
  { id: "C3", name: "Lehengas",    slug: "lehengas",    products: 920,  status: "Active",   img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=60&q=70" },
  { id: "C4", name: "Anarkalis",   slug: "anarkalis",   products: 640,  status: "Active",   img: "https://images.unsplash.com/photo-1559181567-c3190bba186d?w=60&q=70" },
  { id: "C5", name: "Western",     slug: "western",     products: 1240, status: "Active",   img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=60&q=70" },
  { id: "C6", name: "Accessories", slug: "accessories", products: 1870, status: "Inactive", img: "https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?w=60&q=70" },
];

export const BRANDS = [
  { id: "B1", name: "Mandola Originals", products: 412, status: "Active"   },
  { id: "B2", name: "Silk Heritage",     products: 284, status: "Active"   },
  { id: "B3", name: "Ethnic Vibes",      products: 198, status: "Active"   },
  { id: "B4", name: "Boho Chic",         products: 124, status: "Inactive" },
  { id: "B5", name: "Royal Weaves",      products: 89,  status: "Active"   },
];

export const COLLECTIONS = [
  { id: "COL1", name: "Summer Festive",    products: 24, status: "Active",   banner: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&q=70" },
  { id: "COL2", name: "Bridal Trousseau",  products: 18, status: "Active",   banner: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&q=70" },
  { id: "COL3", name: "Office Wear Edit",  products: 32, status: "Inactive", banner: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=200&q=70" },
  { id: "COL4", name: "New Arrivals",      products: 48, status: "Active",   banner: "https://images.unsplash.com/photo-1559181567-c3190bba186d?w=200&q=70" },
];

export const ADMIN_PAYMENTS = [
  { id: "TXN-4421", orderId: "#ORD-9841", customer: "Ananya Sharma", amount: 4200,  gateway: "Razorpay", status: "Success"  as const, date: "12 Jul 2025" },
  { id: "TXN-4420", orderId: "#ORD-9840", customer: "Meera Iyer",    amount: 3600,  gateway: "Razorpay", status: "Success"  as const, date: "11 Jul 2025" },
  { id: "TXN-4419", orderId: "#ORD-9839", customer: "Sonal Verma",   amount: 12800, gateway: "UPI",      status: "Success"  as const, date: "10 Jul 2025" },
  { id: "TXN-4418", orderId: "#ORD-9838", customer: "Ritu Singh",    amount: 5400,  gateway: "COD",      status: "Pending"  as const, date: "10 Jul 2025" },
  { id: "TXN-4417", orderId: "#ORD-9836", customer: "Divya Reddy",   amount: 3200,  gateway: "Razorpay", status: "Refunded" as const, date: "8 Jul 2025"  },
];

export const WALLET_TRANSACTIONS = [
  { id: "W001", type: "Commission",  description: "#ORD-9841 commission",       amount: 420,  balance: 2847320, date: "12 Jul 2025" },
  { id: "W002", type: "Commission",  description: "#ORD-9840 commission",       amount: 360,  balance: 2846900, date: "11 Jul 2025" },
  { id: "W003", type: "Settlement",  description: "Paid to Priya Fashions",     amount: -165780, balance: 2846540, date: "3 Jun 2025" },
  { id: "W004", type: "Commission",  description: "#ORD-9839 commission",       amount: 1280, balance: 3012320, date: "10 Jul 2025" },
  { id: "W005", type: "Refund",      description: "Refund for #ORD-9836",       amount: -3200,balance: 3011040, date: "8 Jul 2025"  },
];

export const fmt = (n: number | string | null | undefined) => {
  const num = Number(n) || 0;
  return "₹" + Math.abs(num).toLocaleString("en-IN");
};

export const orderStatusColor = (s: string) => {
  const status = (s || "").toLowerCase();
  if (status === "delivered")        return "bg-green-50 text-green-700";
  if (status === "shipped")           return "bg-blue-50 text-blue-700";
  if (status === "packed")            return "bg-purple-50 text-purple-700";
  if (status === "confirmed")         return "bg-yellow-50 text-yellow-700";
  if (status === "pending")           return "bg-orange-50 text-orange-700";
  if (status === "out_for_delivery")  return "bg-sky-50 text-sky-700";
  if (status === "processing")        return "bg-indigo-50 text-indigo-700";
  if (status === "cancelled")         return "bg-red-50 text-red-700";
  if (status === "returned")          return "bg-rose-50 text-rose-700";
  return "bg-gray-50 text-gray-700";
};

export const payStatusColor = (s: string) => {
  const status = (s || "").toLowerCase();
  if (status === "success" || status === "paid" || status === "completed") return "bg-green-50 text-green-700";
  if (status === "pending")  return "bg-yellow-50 text-yellow-700";
  if (status === "refunded") return "bg-red-50 text-red-700";
  if (status === "failed")   return "bg-red-100 text-red-800";
  return "bg-gray-50 text-gray-700";
};

export const sellerStatusColor = (s: string) => {
  if (s === "Approved")  return "bg-green-50 text-green-700";
  if (s === "Pending")   return "bg-amber-50 text-amber-700";
  if (s === "Rejected")  return "bg-red-50 text-red-700";
  if (s === "Suspended") return "bg-gray-100 text-gray-500";
  return "";
};
