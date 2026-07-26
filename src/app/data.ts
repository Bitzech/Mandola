export const u = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;

export const NAV_ITEMS = [
  { label: "New Arrivals", sub: ["Just In", "This Week", "Trending Now", "Birthday Outfits", "Vacation Looks", "Beach Wear"] },
  { label: "Casual Wear", sub: ["T-Shirts", "Crop Tops", "Casual Tops", "Shirts", "Jeans", "Jeggings", "Palazzo Pants", "Shorts"] },
  { label: "Party Wear", sub: ["One Piece Dresses", "Satin Dresses", "Jumpsuits", "Off Shoulder Tops", "Mini Skirts", "Bodycon Dresses"] },
  { label: "Ethnic Wear", sub: ["Sarees", "Kurtas", "Lehengas", "Anarkali"] },
  { label: "Indo-Western", sub: ["Co-ord Sets", "Korean Style Outfits", "Denim Sets", "Oversized Shirts", "Cargo Pants", "Denim Fashion"] },
  { label: "Office Wear", sub: ["Blazers", "Formal Trousers", "Solid Shirts", "Midi Dresses", "Straight Pants"] },
  { label: "Trending", sub: ["Co-ord Sets", "Korean Style Outfits", "Denim Sets", "Oversized Shirts", "Cargo Pants", "Dresses"] },
  { label: "Sale", sub: ["Up to 40% Off", "Clearance", "Last Sizes"] },
];

export const CATEGORIES = [
  { name: "Casual Wear", tagline: "Effortless everyday style", img: u("1562572159-4efc207f5aff", 600, 800), alt: "Woman in casual wear" },
  { name: "Party Wear", tagline: "Dress to dazzle", img: u("1700065404033-da12489d9738", 600, 800), alt: "Woman in party dress" },
  { name: "Ethnic Wear", tagline: "Roots in every thread", img: u("1617627143750-d86bc21e42bb", 600, 800), alt: "Woman in ethnic saree" },
  { name: "Indo-Western", tagline: "East meets West", img: u("1629511565591-a1d494ad6c58", 600, 800), alt: "Woman in indo-western outfit" },
];

export const PRODUCTS = [
  { id: 1, name: "Ivory Linen Co-ord Set", price: 2499, mrp: 3999, img1: u("1652473291442-7a2e034a00d1", 500, 650), img2: u("1562572159-4efc207f5aff", 500, 650), colors: ["#FAF7F4", "#D4145A", "#1A1A1A"], tag: "New" },
  { id: 2, name: "Rose Bloom Anarkali", price: 3299, mrp: 4999, img1: u("1617627143750-d86bc21e42bb", 500, 650), img2: u("1614940685083-c5409b57da6e", 500, 650), colors: ["#D4145A", "#8B2252", "#FAF7F4"], tag: "Bestseller" },
  { id: 3, name: "Midnight Drape Gown", price: 4199, mrp: 6500, img1: u("1589212987511-4a924cb9d8ac", 500, 650), img2: u("1700065404033-da12489d9738", 500, 650), colors: ["#1A1A1A", "#2C2C2C", "#6E6E6E"], tag: "New" },
  { id: 4, name: "Coral Fusion Sharara Set", price: 3799, mrp: 5499, img1: u("1651828855150-ba40f6870a53", 500, 650), img2: u("1662532577856-e8ee8b138a8b", 500, 650), colors: ["#E07050", "#D4145A", "#FAF7F4"], tag: "Trending" },
];

export const BEST_SELLERS = [
  { name: "Crimson Organza Lehenga", price: 8999, img: u("1756483510882-55bc1249642d", 400, 540), tag: "Top Rated" },
  { name: "Pearl White Wrap Dress", price: 2199, img: u("1664076458686-3449062080ac", 400, 540), tag: "Best Seller" },
  { name: "Sage Green Fusion Set", price: 3599, img: u("1739429942851-9083ee185d3d", 400, 540), tag: "Trending" },
  { name: "Golden Hour Kurta", price: 1999, img: u("1614940685083-c5409b57da6e", 400, 540), tag: "Fan Favourite" },
];

export const REVIEWS = [
  { name: "Priya Sharma", city: "Mumbai", rating: 5, text: "Absolutely obsessed with my Mandola order. The fabric quality is unreal — it feels exactly as premium as it looks. Will never shop anywhere else.", product: "Ivory Linen Co-ord Set", avatar: u("1438761681033-6461ffad8d80", 80, 80) },
  { name: "Ananya Krishnan", city: "Bangalore", rating: 5, text: "I wore the Rose Bloom Anarkali to my cousin's wedding and received compliments all evening. Mandola just gets Indian women.", product: "Rose Bloom Anarkali", avatar: u("1494790108377-be9c29b29330", 80, 80) },
  { name: "Ishaan Mehta", city: "Delhi", rating: 5, text: "Gifted the Midnight Drape Gown to my wife — she cried. The packaging alone is five stars. Mandola is luxury, redefined.", product: "Midnight Drape Gown", avatar: u("1500648767791-00dcc994a43e", 80, 80) },
];

export const LOOKBOOK = [
  u("1664076458686-3449062080ac", 400, 400),
  u("1617627143750-d86bc21e42bb", 400, 400),
  u("1662532577856-e8ee8b138a8b", 400, 400),
  u("1700065404033-da12489d9738", 400, 400),
  u("1629511565591-a1d494ad6c58", 400, 400),
  u("1651828855150-ba40f6870a53", 400, 400),
  u("1652473291442-7a2e034a00d1", 400, 400),
  u("1614940685083-c5409b57da6e", 400, 400),
];

export const ALL_PRODUCTS = [
  { id: 1, name: "Ivory Linen Co-ord Set", price: 2499, mrp: 3999, img1: u("1652473291442-7a2e034a00d1", 500, 650), img2: u("1562572159-4efc207f5aff", 500, 650), colors: ["#FAF7F4", "#D4145A", "#1A1A1A"], tag: "New" },
  { id: 2, name: "Rose Bloom Anarkali", price: 3299, mrp: 4999, img1: u("1617627143750-d86bc21e42bb", 500, 650), img2: u("1614940685083-c5409b57da6e", 500, 650), colors: ["#D4145A", "#8B2252", "#FAF7F4"], tag: "Bestseller" },
  { id: 3, name: "Midnight Drape Gown", price: 4199, mrp: 6500, img1: u("1589212987511-4a924cb9d8ac", 500, 650), img2: u("1700065404033-da12489d9738", 500, 650), colors: ["#1A1A1A", "#2C2C2C", "#6E6E6E"], tag: "New" },
  { id: 4, name: "Coral Fusion Sharara Set", price: 3799, mrp: 5499, img1: u("1651828855150-ba40f6870a53", 500, 650), img2: u("1662532577856-e8ee8b138a8b", 500, 650), colors: ["#E07050", "#D4145A", "#FAF7F4"], tag: "Trending" },
  { id: 5, name: "Crimson Organza Lehenga", price: 8999, mrp: 12000, img1: u("1756483510882-55bc1249642d", 500, 650), img2: u("1756483510864-5bc7bdc3cf22", 500, 650), colors: ["#C0002A", "#FAF7F4", "#1A1A1A"], tag: "Top Rated" },
  { id: 6, name: "Pearl White Wrap Dress", price: 2199, mrp: 3200, img1: u("1664076458686-3449062080ac", 500, 650), img2: u("1629511565591-a1d494ad6c58", 500, 650), colors: ["#FAF7F4", "#E8E0D8", "#1A1A1A"], tag: "Best Seller" },
  { id: 7, name: "Sage Green Fusion Set", price: 3599, mrp: 5200, img1: u("1739429942851-9083ee185d3d", 500, 650), img2: u("1651828855150-ba40f6870a53", 500, 650), colors: ["#6B8C6B", "#FAF7F4", "#D4145A"], tag: "Trending" },
  { id: 8, name: "Golden Hour Kurta", price: 1999, mrp: 2999, img1: u("1614940685083-c5409b57da6e", 500, 650), img2: u("1617627143750-d86bc21e42bb", 500, 650), colors: ["#C8960C", "#FAF7F4", "#1A1A1A"], tag: "Fan Favourite" },
  { id: 9, name: "Blush Satin Midi Dress", price: 2899, mrp: 4200, img1: u("1700065404033-da12489d9738", 500, 650), img2: u("1589212987511-4a924cb9d8ac", 500, 650), colors: ["#F4A0A0", "#FAF7F4", "#1A1A1A"], tag: "New" },
  { id: 10, name: "Indigo Denim Co-ord", price: 2699, mrp: 3800, img1: u("1629511565591-a1d494ad6c58", 500, 650), img2: u("1652473291442-7a2e034a00d1", 500, 650), colors: ["#3B4F8C", "#1A1A1A", "#FAF7F4"], tag: "Trending" },
  { id: 11, name: "Terracotta Block Print Kurta", price: 1799, mrp: 2600, img1: u("1630267693092-2ea1f7dcc9a5", 500, 650), img2: u("1614940685083-c5409b57da6e", 500, 650), colors: ["#C25B3F", "#FAF7F4", "#8B2252"], tag: "Ethnic" },
  { id: 12, name: "Emerald Bodycon Dress", price: 3199, mrp: 4800, img1: u("1662532577856-e8ee8b138a8b", 500, 650), img2: u("1700065404033-da12489d9738", 500, 650), colors: ["#2D6A4F", "#FAF7F4", "#D4145A"], tag: "Party" },
];

export type Page = { category: string; sub: string } | null;
export type ProductType = typeof ALL_PRODUCTS[0];
