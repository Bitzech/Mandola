import { u } from "../data";

export type DashboardSection =
  | "home" | "profile" | "orders" | "order-details" | "tracking"
  | "wishlist" | "addresses" | "notifications" | "reviews"
  | "invoices" | "change-password";

export type NavigateFn = (section: DashboardSection, orderId?: string) => void;

export interface OrderItem { name: string; img: string; qty: number; price: number; size: string; }
export interface TimelineStep { status: string; date: string; time: string; done: boolean; }

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  seller: string;
  amount: number;
  paymentStatus: "Paid" | "Pending" | "Failed";
  deliveryStatus: "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled";
  address: string;
  trackingNumber: string;
  courier: string;
  estimatedDelivery: string;
  timeline: TimelineStep[];
}

export interface Address {
  id: string; label: string; name: string; phone: string;
  line1: string; line2: string; city: string; state: string;
  pincode: string; isDefault: boolean;
}

export interface Notification {
  id: string; type: "order" | "offer" | "account" | "wishlist";
  title: string; message: string; time: string; read: boolean;
}

export interface Review {
  id: string; product: string; productImg: string;
  rating: number; title: string; body: string; date: string; helpful: number;
}

export interface WishlistItem {
  id: number; name: string; price: number; mrp: number; img: string; tag: string;
}

export const MOCK_USER = {
  name: "Priya Sharma",
  email: "user@gmail.com",
  phone: "+91 98765 43210",
  gender: "Female",
  dob: "1995-03-15",
  memberSince: "January 2024",
  avatar: u("1438761681033-6461ffad8d80", 200, 200),
  profileCompletion: 75,
  missingFields: ["Date of Birth", "Profile Picture"],
};

export const MOCK_ORDERS: Order[] = [
  {
    id: "MND-2025-001",
    date: "12 Jan 2025",
    items: [{ name: "Ivory Linen Co-ord Set", img: u("1652473291442-7a2e034a00d1", 120, 150), qty: 1, price: 2499, size: "M" }],
    seller: "Mandola Official",
    amount: 2499,
    paymentStatus: "Paid",
    deliveryStatus: "Delivered",
    address: "42, Lotus Heights, Bandra West, Mumbai - 400050",
    trackingNumber: "DTDC123456789",
    courier: "DTDC Courier",
    estimatedDelivery: "15 Jan 2025",
    timeline: [
      { status: "Order Placed",      date: "12 Jan 2025", time: "10:30 AM", done: true },
      { status: "Payment Confirmed", date: "12 Jan 2025", time: "10:32 AM", done: true },
      { status: "Processing",        date: "13 Jan 2025", time: "09:00 AM", done: true },
      { status: "Shipped",           date: "13 Jan 2025", time: "05:30 PM", done: true },
      { status: "Out for Delivery",  date: "15 Jan 2025", time: "08:00 AM", done: true },
      { status: "Delivered",         date: "15 Jan 2025", time: "01:45 PM", done: true },
    ],
  },
  {
    id: "MND-2025-002",
    date: "28 Jan 2025",
    items: [{ name: "Rose Bloom Anarkali", img: u("1617627143750-d86bc21e42bb", 120, 150), qty: 1, price: 3299, size: "S" }],
    seller: "Mandola Official",
    amount: 3299,
    paymentStatus: "Paid",
    deliveryStatus: "Shipped",
    address: "42, Lotus Heights, Bandra West, Mumbai - 400050",
    trackingNumber: "BLUE987654321",
    courier: "Bluedart Express",
    estimatedDelivery: "2 Feb 2025",
    timeline: [
      { status: "Order Placed",      date: "28 Jan 2025", time: "3:20 PM",  done: true },
      { status: "Payment Confirmed", date: "28 Jan 2025", time: "3:22 PM",  done: true },
      { status: "Processing",        date: "29 Jan 2025", time: "10:00 AM", done: true },
      { status: "Shipped",           date: "30 Jan 2025", time: "2:00 PM",  done: true },
      { status: "Out for Delivery",  date: "—",           time: "—",        done: false },
      { status: "Delivered",         date: "—",           time: "—",        done: false },
    ],
  },
  {
    id: "MND-2025-003",
    date: "5 Feb 2025",
    items: [
      { name: "Midnight Drape Gown",      img: u("1589212987511-4a924cb9d8ac", 120, 150), qty: 1, price: 4199, size: "M" },
      { name: "Coral Fusion Sharara Set", img: u("1651828855150-ba40f6870a53", 120, 150), qty: 1, price: 3799, size: "S" },
    ],
    seller: "Mandola Official",
    amount: 7998,
    paymentStatus: "Paid",
    deliveryStatus: "Processing",
    address: "42, Lotus Heights, Bandra West, Mumbai - 400050",
    trackingNumber: "EKRT456123789",
    courier: "Ecom Express",
    estimatedDelivery: "10 Feb 2025",
    timeline: [
      { status: "Order Placed",      date: "5 Feb 2025", time: "7:45 PM", done: true },
      { status: "Payment Confirmed", date: "5 Feb 2025", time: "7:47 PM", done: true },
      { status: "Processing",        date: "—",          time: "—",       done: false },
      { status: "Shipped",           date: "—",          time: "—",       done: false },
      { status: "Out for Delivery",  date: "—",          time: "—",       done: false },
      { status: "Delivered",         date: "—",          time: "—",       done: false },
    ],
  },
  {
    id: "MND-2024-098",
    date: "18 Dec 2024",
    items: [{ name: "Crimson Organza Lehenga", img: u("1756483510882-55bc1249642d", 120, 150), qty: 1, price: 8999, size: "M" }],
    seller: "Mandola Official",
    amount: 8999,
    paymentStatus: "Paid",
    deliveryStatus: "Delivered",
    address: "42, Lotus Heights, Bandra West, Mumbai - 400050",
    trackingNumber: "DTDC098765432",
    courier: "DTDC Courier",
    estimatedDelivery: "22 Dec 2024",
    timeline: [
      { status: "Order Placed",      date: "18 Dec 2024", time: "11:00 AM", done: true },
      { status: "Payment Confirmed", date: "18 Dec 2024", time: "11:02 AM", done: true },
      { status: "Processing",        date: "19 Dec 2024", time: "9:30 AM",  done: true },
      { status: "Shipped",           date: "20 Dec 2024", time: "4:00 PM",  done: true },
      { status: "Out for Delivery",  date: "22 Dec 2024", time: "9:00 AM",  done: true },
      { status: "Delivered",         date: "22 Dec 2024", time: "3:30 PM",  done: true },
    ],
  },
  {
    id: "MND-2024-076",
    date: "2 Nov 2024",
    items: [{ name: "Pearl White Wrap Dress", img: u("1664076458686-3449062080ac", 120, 150), qty: 1, price: 2199, size: "S" }],
    seller: "Mandola Official",
    amount: 2199,
    paymentStatus: "Paid",
    deliveryStatus: "Cancelled",
    address: "42, Lotus Heights, Bandra West, Mumbai - 400050",
    trackingNumber: "—",
    courier: "—",
    estimatedDelivery: "—",
    timeline: [
      { status: "Order Placed",      date: "2 Nov 2024", time: "6:15 PM",  done: true },
      { status: "Payment Confirmed", date: "2 Nov 2024", time: "6:17 PM",  done: true },
      { status: "Cancelled",         date: "3 Nov 2024", time: "10:00 AM", done: true },
    ],
  },
];

export const MOCK_WISHLIST: WishlistItem[] = [
  { id: 7,  name: "Sage Green Fusion Set",  price: 3599, mrp: 5200,  img: u("1739429942851-9083ee185d3d", 300, 400), tag: "Trending" },
  { id: 5,  name: "Crimson Organza Lehenga",price: 8999, mrp: 12000, img: u("1756483510882-55bc1249642d", 300, 400), tag: "Top Rated" },
  { id: 9,  name: "Blush Satin Midi Dress", price: 2899, mrp: 4200,  img: u("1700065404033-da12489d9738", 300, 400), tag: "New" },
  { id: 10, name: "Indigo Denim Co-ord",    price: 2699, mrp: 3800,  img: u("1629511565591-a1d494ad6c58", 300, 400), tag: "Trending" },
];

export const MOCK_ADDRESSES: Address[] = [
  {
    id: "addr-1", label: "Home", name: "Priya Sharma", phone: "+91 98765 43210",
    line1: "42, Lotus Heights, Bandra West", line2: "Near Carter Road",
    city: "Mumbai", state: "Maharashtra", pincode: "400050", isDefault: true,
  },
  {
    id: "addr-2", label: "Office", name: "Priya Sharma", phone: "+91 98765 43210",
    line1: "7th Floor, Pinnacle Tower, BKC", line2: "",
    city: "Mumbai", state: "Maharashtra", pincode: "400051", isDefault: false,
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "order",   title: "Order Shipped!",         message: "Your order MND-2025-002 has been shipped. Track it now.",             time: "2 hours ago",  read: false },
  { id: "n2", type: "offer",   title: "Exclusive Offer For You",message: "Get 20% off on your next purchase. Use code PRIYA20.",               time: "1 day ago",    read: false },
  { id: "n3", type: "order",   title: "Order Delivered",        message: "Your order MND-2025-001 has been delivered. Hope you love it!",       time: "3 days ago",   read: true  },
  { id: "n4", type: "wishlist",title: "Wishlist Alert",         message: "Sage Green Fusion Set is almost sold out. Order now!",               time: "5 days ago",   read: true  },
  { id: "n5", type: "account", title: "Profile Incomplete",     message: "Complete your profile to get a ₹100 cashback voucher.",              time: "1 week ago",   read: true  },
  { id: "n6", type: "offer",   title: "New Collection Dropped!",message: "Discover our latest Summer 2025 collection. Shop now!",             time: "2 weeks ago",  read: true  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1", product: "Ivory Linen Co-ord Set",
    productImg: u("1652473291442-7a2e034a00d1", 100, 120),
    rating: 5, title: "Absolutely gorgeous!",
    body: "The fabric quality is exceptional. It fits perfectly and the color is exactly as shown. Got so many compliments at the party!",
    date: "20 Jan 2025", helpful: 12,
  },
  {
    id: "rev-2", product: "Crimson Organza Lehenga",
    productImg: u("1756483510882-55bc1249642d", 100, 120),
    rating: 4, title: "Beautiful lehenga, slightly large",
    body: "The embroidery work is stunning and the organza fabric drapes beautifully. Size runs slightly large — I'd suggest going one size down.",
    date: "28 Dec 2024", helpful: 8,
  },
];

export const RECENTLY_VIEWED = [
  { id: 6,  name: "Pearl White Wrap Dress",       price: 2199, mrp: 3200, img: u("1664076458686-3449062080ac", 300, 400) },
  { id: 11, name: "Terracotta Block Print Kurta", price: 1799, mrp: 2600, img: u("1630267693092-2ea1f7dcc9a5", 300, 400) },
  { id: 12, name: "Emerald Bodycon Dress",        price: 3199, mrp: 4800, img: u("1662532577856-e8ee8b138a8b", 300, 400) },
  { id: 8,  name: "Golden Hour Kurta",            price: 1999, mrp: 2999, img: u("1614940685083-c5409b57da6e", 300, 400) },
];

export const deliveryStatusColor = (s: Order["deliveryStatus"]) => {
  if (s === "Delivered")        return "bg-emerald-50 text-emerald-700";
  if (s === "Shipped")          return "bg-blue-50 text-blue-700";
  if (s === "Out for Delivery") return "bg-indigo-50 text-indigo-700";
  if (s === "Processing")       return "bg-amber-50 text-amber-700";
  if (s === "Cancelled")        return "bg-red-50 text-red-600";
  return "bg-gray-50 text-gray-600";
};

export const paymentStatusColor = (s: Order["paymentStatus"]) => {
  if (s === "Paid")    return "bg-emerald-50 text-emerald-700";
  if (s === "Pending") return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-600";
};
