import image_image_1 from '@/imports/image-1.png'
import { useState, useEffect, useRef } from "react";
import {
  Search, Heart, User, ShoppingBag, Menu, X,
  ArrowRight, Star, Instagram, ChevronDown,
  Home, LayoutGrid, ShoppingCart,
  RefreshCw, Shield, Truck, Quote, Award, Phone
} from "lucide-react";
import logoImg from "@/imports/image.png";

// ── Image helpers ────────────────────────────────────────────────────────────
const u = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;

// ── Data ─────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "New Arrivals", sub: ["Just In", "This Week", "Trending Now", "Birthday Outfits", "Vacation Looks", "Beach Wear"] },
  { label: "Casual Wear", sub: ["T-Shirts", "Crop Tops", "Casual Tops", "Shirts", "Jeans", "Jeggings", "Palazzo Pants", "Shorts"] },
  { label: "Party Wear", sub: ["One Piece Dresses", "Satin Dresses", "Jumpsuits", "Off Shoulder Tops", "Mini Skirts", "Bodycon Dresses"] },
  { label: "Ethnic Wear", sub: ["Sarees", "Kurtas", "Lehengas", "Anarkali"] },
  { label: "Indo-Western", sub: ["Co-ord Sets", "Korean Style Outfits", "Denim Sets", "Oversized Shirts", "Cargo Pants", "Denim Fashion"] },
  { label: "Office Wear", sub: ["Blazers", "Formal Trousers", "Solid Shirts", "Midi Dresses", "Straight Pants"] },
  { label: "Trending", sub: ["Co-ord Sets", "Korean Style Outfits", "Denim Sets", "Oversized Shirts", "Cargo Pants", "Dresses"] },
  { label: "Sale", sub: ["Up to 40% Off", "Clearance", "Last Sizes"] },
];

const CATEGORIES = [
  {
    name: "Casual Wear",
    tagline: "Effortless everyday style",
    img: u("1562572159-4efc207f5aff", 600, 800),
    alt: "Woman in casual wear",
  },
  {
    name: "Party Wear",
    tagline: "Dress to dazzle",
    img: u("1700065404033-da12489d9738", 600, 800),
    alt: "Woman in party dress",
  },
  {
    name: "Ethnic Wear",
    tagline: "Roots in every thread",
    img: u("1617627143750-d86bc21e42bb", 600, 800),
    alt: "Woman in ethnic saree",
  },
  {
    name: "Indo-Western",
    tagline: "East meets West",
    img: u("1629511565591-a1d494ad6c58", 600, 800),
    alt: "Woman in indo-western outfit",
  },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Ivory Linen Co-ord Set",
    price: 2499,
    mrp: 3999,
    img1: u("1652473291442-7a2e034a00d1", 500, 650),
    img2: u("1562572159-4efc207f5aff", 500, 650),
    colors: ["#FAF7F4", "#D4145A", "#1A1A1A"],
    tag: "New",
  },
  {
    id: 2,
    name: "Rose Bloom Anarkali",
    price: 3299,
    mrp: 4999,
    img1: u("1617627143750-d86bc21e42bb", 500, 650),
    img2: u("1614940685083-c5409b57da6e", 500, 650),
    colors: ["#D4145A", "#8B2252", "#FAF7F4"],
    tag: "Bestseller",
  },
  {
    id: 3,
    name: "Midnight Drape Gown",
    price: 4199,
    mrp: 6500,
    img1: u("1589212987511-4a924cb9d8ac", 500, 650),
    img2: u("1700065404033-da12489d9738", 500, 650),
    colors: ["#1A1A1A", "#2C2C2C", "#6E6E6E"],
    tag: "New",
  },
  {
    id: 4,
    name: "Coral Fusion Sharara Set",
    price: 3799,
    mrp: 5499,
    img1: u("1651828855150-ba40f6870a53", 500, 650),
    img2: u("1662532577856-e8ee8b138a8b", 500, 650),
    colors: ["#E07050", "#D4145A", "#FAF7F4"],
    tag: "Trending",
  },
];

const BEST_SELLERS = [
  { name: "Crimson Organza Lehenga", price: 8999, img: u("1756483510882-55bc1249642d", 400, 540), tag: "Top Rated" },
  { name: "Pearl White Wrap Dress", price: 2199, img: u("1664076458686-3449062080ac", 400, 540), tag: "Best Seller" },
  { name: "Sage Green Fusion Set", price: 3599, img: u("1739429942851-9083ee185d3d", 400, 540), tag: "Trending" },
  { name: "Golden Hour Kurta", price: 1999, img: u("1614940685083-c5409b57da6e", 400, 540), tag: "Fan Favourite" },
];

const REVIEWS = [
  {
    name: "Priya Sharma",
    city: "Mumbai",
    rating: 5,
    text: "Absolutely obsessed with my Mandola order. The fabric quality is unreal — it feels exactly as premium as it looks. Will never shop anywhere else.",
    product: "Ivory Linen Co-ord Set",
    avatar: u("1438761681033-6461ffad8d80", 80, 80),
  },
  {
    name: "Ananya Krishnan",
    city: "Bangalore",
    rating: 5,
    text: "I wore the Rose Bloom Anarkali to my cousin's wedding and received compliments all evening. Mandola just gets Indian women.",
    product: "Rose Bloom Anarkali",
    avatar: u("1494790108377-be9c29b29330", 80, 80),
  },
  {
    name: "Ishaan Mehta",
    city: "Delhi",
    rating: 5,
    text: "Gifted the Midnight Drape Gown to my wife — she cried. The packaging alone is five stars. Mandola is luxury, redefined.",
    product: "Midnight Drape Gown",
    avatar: u("1500648767791-00dcc994a43e", 80, 80),
  },
];

const LOOKBOOK = [
  u("1664076458686-3449062080ac", 400, 400),
  u("1617627143750-d86bc21e42bb", 400, 400),
  u("1662532577856-e8ee8b138a8b", 400, 400),
  u("1700065404033-da12489d9738", 400, 400),
  u("1629511565591-a1d494ad6c58", 400, 400),
  u("1651828855150-ba40f6870a53", 400, 400),
  u("1652473291442-7a2e034a00d1", 400, 400),
  u("1614940685083-c5409b57da6e", 400, 400),
];

const WHY_ITEMS = [
  { icon: <Award size={28} strokeWidth={1.5} />, title: "Premium Quality", desc: "Ethically sourced fabrics, masterfully crafted for lasting wear." },
  { icon: <RefreshCw size={28} strokeWidth={1.5} />, title: "Easy Returns", desc: "15-day hassle-free returns, no questions asked." },
  { icon: <Shield size={28} strokeWidth={1.5} />, title: "Secure Payments", desc: "100% safe checkout with encrypted payment gateways." },
  { icon: <Truck size={28} strokeWidth={1.5} />, title: "Fast Delivery", desc: "Pan-India delivery in 3–5 business days." },
];

const ALL_PRODUCTS = [
  { id: 1,  name: "Ivory Linen Co-ord Set",       price: 2499, mrp: 3999, img1: u("1652473291442-7a2e034a00d1",500,650), img2: u("1562572159-4efc207f5aff",500,650), colors:["#FAF7F4","#D4145A","#1A1A1A"], tag:"New" },
  { id: 2,  name: "Rose Bloom Anarkali",           price: 3299, mrp: 4999, img1: u("1617627143750-d86bc21e42bb",500,650), img2: u("1614940685083-c5409b57da6e",500,650), colors:["#D4145A","#8B2252","#FAF7F4"], tag:"Bestseller" },
  { id: 3,  name: "Midnight Drape Gown",           price: 4199, mrp: 6500, img1: u("1589212987511-4a924cb9d8ac",500,650), img2: u("1700065404033-da12489d9738",500,650), colors:["#1A1A1A","#2C2C2C","#6E6E6E"], tag:"New" },
  { id: 4,  name: "Coral Fusion Sharara Set",      price: 3799, mrp: 5499, img1: u("1651828855150-ba40f6870a53",500,650), img2: u("1662532577856-e8ee8b138a8b",500,650), colors:["#E07050","#D4145A","#FAF7F4"], tag:"Trending" },
  { id: 5,  name: "Crimson Organza Lehenga",       price: 8999, mrp:12000, img1: u("1756483510882-55bc1249642d",500,650), img2: u("1756483510864-5bc7bdc3cf22",500,650), colors:["#C0002A","#FAF7F4","#1A1A1A"], tag:"Top Rated" },
  { id: 6,  name: "Pearl White Wrap Dress",        price: 2199, mrp: 3200, img1: u("1664076458686-3449062080ac",500,650), img2: u("1629511565591-a1d494ad6c58",500,650), colors:["#FAF7F4","#E8E0D8","#1A1A1A"], tag:"Best Seller" },
  { id: 7,  name: "Sage Green Fusion Set",         price: 3599, mrp: 5200, img1: u("1739429942851-9083ee185d3d",500,650), img2: u("1651828855150-ba40f6870a53",500,650), colors:["#6B8C6B","#FAF7F4","#D4145A"], tag:"Trending" },
  { id: 8,  name: "Golden Hour Kurta",             price: 1999, mrp: 2999, img1: u("1614940685083-c5409b57da6e",500,650), img2: u("1617627143750-d86bc21e42bb",500,650), colors:["#C8960C","#FAF7F4","#1A1A1A"], tag:"Fan Favourite" },
  { id: 9,  name: "Blush Satin Midi Dress",        price: 2899, mrp: 4200, img1: u("1700065404033-da12489d9738",500,650), img2: u("1589212987511-4a924cb9d8ac",500,650), colors:["#F4A0A0","#FAF7F4","#1A1A1A"], tag:"New" },
  { id: 10, name: "Indigo Denim Co-ord",           price: 2699, mrp: 3800, img1: u("1629511565591-a1d494ad6c58",500,650), img2: u("1652473291442-7a2e034a00d1",500,650), colors:["#3B4F8C","#1A1A1A","#FAF7F4"], tag:"Trending" },
  { id: 11, name: "Terracotta Block Print Kurta",  price: 1799, mrp: 2600, img1: u("1630267693092-2ea1f7dcc9a5",500,650), img2: u("1614940685083-c5409b57da6e",500,650), colors:["#C25B3F","#FAF7F4","#8B2252"], tag:"Ethnic" },
  { id: 12, name: "Emerald Bodycon Dress",         price: 3199, mrp: 4800, img1: u("1662532577856-e8ee8b138a8b",500,650), img2: u("1700065404033-da12489d9738",500,650), colors:["#2D6A4F","#FAF7F4","#D4145A"], tag:"Party" },
];

type Page = { category: string; sub: string } | null;

// ── CategoryPage ──────────────────────────────────────────────────────────────
function CategoryPage({ page, onBack, onNavigate }: { page: NonNullable<Page>; onBack: () => void; onNavigate: (category: string, sub: string) => void }) {
  const [sortBy, setSortBy] = useState("featured");
  const [priceFilter, setPriceFilter] = useState("all");
  const [wished, setWished] = useState<Set<number>>(new Set());

  const sorted = [...ALL_PRODUCTS].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "newest") return b.id - a.id;
    return 0;
  }).filter(p => {
    if (priceFilter === "under2k") return p.price < 2000;
    if (priceFilter === "2k-4k") return p.price >= 2000 && p.price <= 4000;
    if (priceFilter === "above4k") return p.price > 4000;
    return true;
  });

  const navItem = NAV_ITEMS.find(n => n.category === page.category || n.label === page.category);

  return (
    <div className="min-h-screen bg-white">
      {/* Category hero banner */}
      <div className="relative h-48 md:h-64 overflow-hidden bg-[#faf7f4] flex items-end">
        <div className="absolute inset-0" style={{background: "linear-gradient(135deg, #faf7f4 0%, #fce8ef 40%, #f5e6ec 70%, #faf0f5 100%)"}}>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20" style={{background:"radial-gradient(circle, #d4145a 0%, transparent 70%)", transform:"translate(30%, -30%)"}} />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full opacity-10" style={{background:"radial-gradient(circle, #d4145a 0%, transparent 70%)", transform:"translateY(40%)"}} />
          <div className="absolute top-1/2 left-0 w-48 h-48 rounded-full opacity-15" style={{background:"radial-gradient(circle, #c8175c 0%, transparent 70%)", transform:"translate(-40%, -50%)"}} />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:"repeating-linear-gradient(0deg,#1a1a1a 0,#1a1a1a 1px,transparent 0,transparent 50%),repeating-linear-gradient(90deg,#1a1a1a 0,#1a1a1a 1px,transparent 0,transparent 50%)", backgroundSize:"40px 40px"}} />
        </div>
        <div className="relative z-10 px-8 md:px-20 pb-8 w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-3">
            <button onClick={onBack} className="hover:text-[#d4145a] transition-colors">Home</button>
            <span>/</span>
            <span className="text-[#1a1a1a] font-semibold">{page.category}</span>
            {page.sub !== page.category && (
              <>
                <span>/</span>
                <span className="text-[#d4145a]">{page.sub}</span>
              </>
            )}
          </nav>
          <h1 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a]">{page.sub}</h1>
          <p className="text-[#6e6e6e] text-sm mt-1 font-light">{sorted.length} styles available</p>
        </div>
      </div>

      {/* Filters + grid */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10">
        {/* Sub-category pills */}
        {navItem && (
          <div className="flex flex-wrap gap-2 mb-8">
            {navItem.sub.map(s => (
              <button
                key={s}
                onClick={() => onNavigate(page.category, s)}
                className={`px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase border transition-colors ${s === page.sub ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a]"}`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Sort + filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-5 border-b border-[#ececec]">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] font-medium">Filter:</span>
            {[["all","All Prices"],["under2k","Under ₹2,000"],["2k-4k","₹2,000–₹4,000"],["above4k","Above ₹4,000"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setPriceFilter(val)}
                className={`text-[10px] tracking-wide px-3 py-1 border transition-colors ${priceFilter === val ? "bg-[#d4145a] text-white border-[#d4145a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a]"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs border border-[#ececec] px-3 py-1.5 text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-7">
          {sorted.map(p => {
            const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
            const isWished = wished.has(p.id);
            return (
              <div key={p.id} className="group">
                <div className="relative overflow-hidden bg-[#faf7f4] aspect-[3/4]">
                  <img src={p.img1} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {p.tag && (
                    <span className="absolute top-3 left-3 text-[9px] font-semibold tracking-[0.15em] uppercase bg-white text-[#1a1a1a] px-2.5 py-1">{p.tag}</span>
                  )}
                  <span className="absolute top-3 right-10 text-[9px] font-semibold bg-[#d4145a] text-white px-2 py-1">-{discount}%</span>
                  <button onClick={() => setWished(w => { const n = new Set(w); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })} className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm">
                    <Heart size={13} strokeWidth={1.5} className={isWished ? "fill-[#d4145a] text-[#d4145a]" : "text-[#6e6e6e]"} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] text-white text-center py-2.5 text-[10px] tracking-[0.15em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300 cursor-pointer">
                    Add to Bag
                  </div>
                </div>
                <div className="pt-3">
                  <p className="text-sm font-medium text-[#1a1a1a] leading-snug mb-1">{p.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">₹{p.price.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-[#6e6e6e] line-through">₹{p.mrp.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {p.colors.map((c,i) => <div key={i} className="w-3 h-3 rounded-full border border-[#ececec]" style={{backgroundColor:c}} />)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Components ───────────────────────────────────────────────────────────────

function ProductCard({ p }: { p: typeof PRODUCTS[0] }) {
  const [hovered, setHovered] = useState(false);
  const [wished, setWished] = useState(false);
  const [quickView, setQuickView] = useState(false);

  const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);

  return (
    <>
      <div
        className="group relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image container */}
        <div className="relative overflow-hidden bg-[#faf7f4] aspect-[3/4]">
          <img
            src={hovered ? p.img2 : p.img1}
            alt={p.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />

          {/* Tag */}
          {p.tag && (
            <span className="absolute top-3 left-3 text-[10px] font-semibold tracking-[0.15em] uppercase bg-white text-[#1a1a1a] px-2.5 py-1">
              {p.tag}
            </span>
          )}

          {/* Discount */}
          <span className="absolute top-3 right-12 text-[10px] font-semibold tracking-[0.1em] bg-[#d4145a] text-white px-2 py-1">
            -{discount}%
          </span>

          {/* Wishlist */}
          <button
            onClick={() => setWished(!wished)}
            className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm"
          >
            <Heart
              size={14}
              strokeWidth={1.5}
              className={wished ? "fill-[#d4145a] text-[#d4145a]" : "text-[#6e6e6e]"}
            />
          </button>

          {/* Quick View */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-[#1a1a1a] text-white text-center py-3 text-xs font-medium tracking-[0.15em] uppercase cursor-pointer transition-transform duration-300 ${hovered ? "translate-y-0" : "translate-y-full"}`}
            onClick={() => setQuickView(true)}
          >
            Quick View
          </div>
        </div>

        {/* Info */}
        <div className="pt-4 pb-2">
          <h3 className="text-sm font-medium text-[#1a1a1a] tracking-wide leading-snug mb-1.5">{p.name}</h3>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-base font-semibold text-[#1a1a1a]">₹{p.price.toLocaleString("en-IN")}</span>
            <span className="text-sm text-[#6e6e6e] line-through">₹{p.mrp.toLocaleString("en-IN")}</span>
          </div>
          {/* Colors */}
          <div className="flex items-center gap-1.5">
            {p.colors.map((c, i) => (
              <div
                key={i}
                className="w-3.5 h-3.5 rounded-full border border-[#ececec] cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setQuickView(false)}>
          <div className="bg-white max-w-2xl w-full p-8 relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4" onClick={() => setQuickView(false)}><X size={18} /></button>
            <div className="flex gap-6">
              <img src={p.img1} alt={p.name} className="w-52 h-72 object-cover flex-shrink-0" />
              <div className="flex-1 pt-2">
                <h3 className="font-['Playfair_Display'] text-2xl font-semibold mb-2">{p.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-semibold">₹{p.price.toLocaleString("en-IN")}</span>
                  <span className="text-sm text-[#6e6e6e] line-through">₹{p.mrp.toLocaleString("en-IN")}</span>
                  <span className="text-xs font-semibold text-[#d4145a]">-{discount}%</span>
                </div>
                <button className="w-full bg-[#1a1a1a] text-white py-3 text-sm tracking-widest uppercase hover:bg-[#d4145a] transition-colors">
                  Add to Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

type ProductType = typeof ALL_PRODUCTS[0];

// ── ProductDetailPage ─────────────────────────────────────────────────────────
function ProductDetailPage({ product, onBack, onProductClick, onAddToBag }: {
  product: ProductType;
  onBack: () => void;
  onProductClick: (p: ProductType) => void;
  onAddToBag: () => void;
}) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>("description");
  const [added, setAdded] = useState(false);

  const images = [product.img1, product.img2, product.img1.replace("500,650","600,750"), product.img2.replace("500,650","600,750")];
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const related = ALL_PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

  const handleAddToBag = () => {
    if (!selectedSize) return;
    onAddToBag();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const details = [
    { title: "Description", content: `The ${product.name} is crafted from premium quality fabric, designed for the modern Indian woman who values both style and comfort. Each piece is carefully constructed with attention to detail, ensuring a flattering silhouette and lasting wear.` },
    { title: "Size & Fit", content: "Model is 5'7\" wearing size S. We recommend ordering your true size. Refer to our size chart for exact measurements. Fabric has a slight stretch for a comfortable fit." },
    { title: "Material & Care", content: "100% Premium Fabric (as labeled). Dry clean recommended. Do not bleach. Iron on low heat. Store in a cool, dry place." },
    { title: "Delivery & Returns", content: "Free delivery on orders above ₹999. Standard delivery in 3–5 business days. Express delivery available. 15-day hassle-free returns for unworn, unwashed items with tags intact." },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="px-6 md:px-12 py-4 border-b border-[#ececec] max-w-[1440px] mx-auto">
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">
          <button onClick={onBack} className="hover:text-[#d4145a] transition-colors">Home</button>
          <span>/</span>
          <button onClick={onBack} className="hover:text-[#d4145a] transition-colors">Collections</button>
          <span>/</span>
          <span className="text-[#1a1a1a] font-semibold">{product.name}</span>
        </nav>
      </div>

      {/* Main product area */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 lg:gap-24">

          {/* Left: Image gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 h-20 md:w-20 md:h-24 overflow-hidden border-2 transition-colors ${activeImg === i ? "border-[#1a1a1a]" : "border-transparent"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {/* Main image */}
            <div className="flex-1 relative bg-[#faf7f4] aspect-[3/4] overflow-hidden">
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover transition-opacity duration-300" />
              {product.tag && (
                <span className="absolute top-4 left-4 text-[9px] font-semibold tracking-[0.15em] uppercase bg-white text-[#1a1a1a] px-3 py-1.5">{product.tag}</span>
              )}
              <span className="absolute top-4 right-4 text-[9px] font-semibold bg-[#d4145a] text-white px-2.5 py-1.5">-{discount}%</span>
            </div>
          </div>

          {/* Right: Product info */}
          <div className="flex flex-col">
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1a1a1a] leading-tight mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {Array.from({length:5}).map((_,i) => <Star key={i} size={13} className="fill-[#d4145a] text-[#d4145a]" />)}
              </div>
              <span className="text-xs text-[#6e6e6e] tracking-wide">4.9 (128 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#ececec]">
              <span className="font-['Playfair_Display'] text-3xl font-bold text-[#1a1a1a]">₹{product.price.toLocaleString("en-IN")}</span>
              <span className="text-base text-[#6e6e6e] line-through">₹{product.mrp.toLocaleString("en-IN")}</span>
              <span className="text-xs font-semibold text-[#d4145a] bg-[#fce8ef] px-2 py-0.5">{discount}% OFF</span>
            </div>

            {/* Color */}
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1a1a1a] mb-3">
                Colour: <span className="font-normal text-[#6e6e6e]">{selectedColor}</span>
              </p>
              <div className="flex gap-2.5">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c ? "border-[#1a1a1a] scale-110" : "border-[#ececec] hover:border-[#6e6e6e]"}`}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1a1a1a]">
                  Size: <span className="font-normal text-[#6e6e6e]">{selectedSize || "Select a size"}</span>
                </p>
                <button className="text-[10px] tracking-wide text-[#d4145a] underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-10 text-xs font-medium border transition-all ${selectedSize === s ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!selectedSize && <p className="text-[10px] text-[#d4145a] mt-2 tracking-wide">Please select a size to continue</p>}
            </div>

            {/* Qty + CTA */}
            <div className="flex gap-3 mb-4">
              <div className="flex items-center border border-[#ececec]">
                <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-10 h-12 text-[#6e6e6e] hover:text-[#d4145a] transition-colors text-lg">−</button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(q => q+1)} className="w-10 h-12 text-[#6e6e6e] hover:text-[#d4145a] transition-colors text-lg">+</button>
              </div>
              <button
                onClick={handleAddToBag}
                className={`flex-1 py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 ${added ? "bg-[#d4145a] text-white" : selectedSize ? "bg-[#1a1a1a] text-white hover:bg-[#d4145a]" : "bg-[#ececec] text-[#9e9e9e] cursor-not-allowed"}`}
              >
                {added ? "✓ Added to Bag!" : "Add to Bag"}
              </button>
              <button
                onClick={() => setWished(w => !w)}
                className={`w-12 h-12 border flex items-center justify-center transition-all ${wished ? "border-[#d4145a] text-[#d4145a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a]"}`}
              >
                <Heart size={18} strokeWidth={1.5} className={wished ? "fill-[#d4145a]" : ""} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 py-5 border-t border-[#ececec] mb-6">
              {[
                { icon: <Truck size={16} strokeWidth={1.5} />, text: "Free Delivery above ₹999" },
                { icon: <RefreshCw size={16} strokeWidth={1.5} />, text: "15-Day Easy Returns" },
                { icon: <Shield size={16} strokeWidth={1.5} />, text: "Secure Checkout" },
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1.5">
                  <span className="text-[#d4145a]">{b.icon}</span>
                  <span className="text-[9px] text-[#6e6e6e] tracking-wide leading-tight">{b.text}</span>
                </div>
              ))}
            </div>

            {/* Accordion details */}
            <div className="border-t border-[#ececec]">
              {details.map(d => (
                <div key={d.title} className="border-b border-[#ececec]">
                  <button
                    onClick={() => setOpenSection(openSection === d.title ? null : d.title)}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1a1a1a]">{d.title}</span>
                    <ChevronDown size={14} className={`text-[#6e6e6e] transition-transform ${openSection === d.title ? "rotate-180" : ""}`} />
                  </button>
                  {openSection === d.title && (
                    <p className="text-xs text-[#6e6e6e] leading-relaxed pb-4 font-light">{d.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        <div className="mt-20 md:mt-28">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">You May Also Like</span>
              <h2 className="font-['Playfair_Display'] text-2xl md:text-4xl font-bold text-[#1a1a1a] mt-2">Complete the Look</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7">
            {related.map(p => {
              const d = Math.round(((p.mrp - p.price) / p.mrp) * 100);
              return (
                <div key={p.id} className="group cursor-pointer" onClick={() => { onProductClick(p); window.scrollTo(0,0); }}>
                  <div className="relative overflow-hidden bg-[#faf7f4] aspect-[3/4]">
                    <img src={p.img1} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute top-3 right-3 text-[9px] font-semibold bg-[#d4145a] text-white px-2 py-1">-{d}%</span>
                    <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] text-white text-center py-2.5 text-[10px] tracking-[0.15em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      View Product
                    </div>
                  </div>
                  <div className="pt-3">
                    <p className="text-sm font-medium text-[#1a1a1a] leading-snug mb-1">{p.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">₹{p.price.toLocaleString("en-IN")}</span>
                      <span className="text-xs text-[#6e6e6e] line-through">₹{p.mrp.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(null);
  const [currentProduct, setCurrentProduct] = useState<ProductType | null>(null);

  const goToProduct = (p: ProductType) => { setCurrentProduct(p); setCurrentPage(null); window.scrollTo(0,0); };
  const goBack = () => { setCurrentProduct(null); window.scrollTo(0,0); };
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [megaMenu, setMegaMenu] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(2);
  const [wishCount] = useState(3);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mega menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-white font-['Jost',sans-serif] text-[#1a1a1a] overflow-x-hidden">

      {/* ── Announcement Bar ── */}
      {announcementVisible && (
        <div className="relative bg-[#1a1a1a] text-white text-center py-2.5 text-xs tracking-[0.2em] uppercase font-medium">
          ✨ Free Shipping on Orders Above ₹999 &nbsp;|&nbsp; New Collection 2026 Now Live
          <button
            onClick={() => setAnnouncementVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            aria-label="Close announcement"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>
      )}

      {/* ── Header ── */}
      <header
        ref={megaRef}
        className={`sticky top-0 z-40 bg-white transition-shadow duration-300 ${scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.06)]" : ""}`}
      >
        {/* Top row */}
        <div className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-[#ececec]">
          {/* Left: search */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setSearchOpen(o => !o); setSearchQuery(""); }}
              className={`transition-colors ${searchOpen ? "text-[#d4145a]" : "text-[#6e6e6e] hover:text-[#d4145a]"}`}
            >
              {searchOpen ? <X size={20} strokeWidth={1.5} /> : <Search size={20} strokeWidth={1.5} />}
            </button>
          </div>

          {/* Center: Logo */}
          <a href="#" onClick={e => { e.preventDefault(); setCurrentPage(null); window.scrollTo(0,0); }} className="absolute left-1/2 -translate-x-1/2">
            <img src={image_image_1} alt="Mandola — A Woman Fashion" className="h-16 w-auto object-contain rounded-sm" style={{maxWidth: "180px"}} />
          </a>

          {/* Right: icons */}
          <div className="flex items-center gap-4">
            <button onClick={() => { setWishOpen(o => !o); setCartOpen(false); setAccountOpen(false); }} className={`hidden md:flex items-center gap-1 relative transition-colors ${wishOpen ? "text-[#d4145a]" : "text-[#6e6e6e] hover:text-[#d4145a]"}`}>
              <Heart size={20} strokeWidth={1.5} />
              {wishCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#d4145a] text-white text-[9px] flex items-center justify-center rounded-full font-semibold">
                  {wishCount}
                </span>
              )}
            </button>
            <button onClick={() => { setAccountOpen(o => !o); setCartOpen(false); setWishOpen(false); }} className={`hidden md:flex transition-colors ${accountOpen ? "text-[#d4145a]" : "text-[#6e6e6e] hover:text-[#d4145a]"}`}>
              <User size={20} strokeWidth={1.5} />
            </button>
            <button onClick={() => { setCartOpen(o => !o); setWishOpen(false); setAccountOpen(false); }} className={`relative transition-colors ${cartOpen ? "text-[#d4145a]" : "text-[#6e6e6e] hover:text-[#d4145a]"}`}>
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#d4145a] text-white text-[9px] flex items-center justify-center rounded-full font-semibold">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="md:hidden text-[#1a1a1a]" onClick={() => setMobileOpen(true)}>
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Search overlay */}
        <div className={`overflow-hidden transition-all duration-300 ${searchOpen ? "max-h-20 border-b border-[#ececec]" : "max-h-0"}`}>
          <div className="flex items-center gap-4 px-6 md:px-12 py-4">
            <Search size={18} strokeWidth={1.5} className="text-[#6e6e6e] flex-shrink-0" />
            <input
              autoFocus={searchOpen}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === "Escape" && setSearchOpen(false)}
              placeholder="Search for dresses, sarees, co-ords…"
              className="flex-1 text-sm text-[#1a1a1a] placeholder-[#b0b0b0] bg-transparent border-none outline-none tracking-wide"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-[#6e6e6e] hover:text-[#d4145a] transition-colors">
                <X size={16} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        {/* Nav row */}
        <nav className="hidden md:flex items-center justify-center gap-8 px-12 py-3 bg-white">
          {NAV_ITEMS.map(item => (
            <div key={item.label} className="relative">
              <button
                className={`flex items-center gap-1 text-xs tracking-[0.12em] uppercase font-medium transition-colors ${megaMenu === item.label ? "text-[#d4145a]" : "text-[#1a1a1a] hover:text-[#d4145a]"} ${item.label === "Sale" ? "text-[#d4145a]" : ""}`}
                onMouseEnter={() => setMegaMenu(item.label)}
                onMouseLeave={() => setMegaMenu(null)}
              >
                {item.label}
                <ChevronDown size={12} className={`transition-transform ${megaMenu === item.label ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown */}
              {megaMenu === item.label && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-44 bg-white border border-[#ececec] shadow-lg py-3 z-50"
                  onMouseEnter={() => setMegaMenu(item.label)}
                  onMouseLeave={() => setMegaMenu(null)}
                >
                  {item.sub.map(s => (
                    <a
                      key={s}
                      href="#"
                      onClick={e => { e.preventDefault(); setCurrentPage({ category: item.label, sub: s }); setMegaMenu(null); window.scrollTo(0,0); }}
                      className="block px-5 py-2 text-xs tracking-wide text-[#6e6e6e] hover:text-[#d4145a] hover:bg-[#faf7f4] transition-colors"
                    >
                      {s}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </header>

      {/* ── Mobile Menu Drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative w-80 max-w-[90vw] bg-white h-full flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-[#ececec]">
              <img src={logoImg} alt="Mandola" className="h-10 w-auto object-contain" />
              <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
            </div>
            <nav className="flex-1 overflow-y-auto p-5 space-y-0">
              {NAV_ITEMS.map(item => (
                <a
                  key={item.label}
                  href="#"
                  className={`block py-3.5 border-b border-[#f0f0f0] text-sm tracking-wide ${item.label === "Sale" ? "text-[#d4145a] font-semibold" : "text-[#1a1a1a]"}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="p-5 space-y-3">
              <button className="w-full flex items-center gap-3 text-sm text-[#6e6e6e]">
                <User size={16} /> Account
              </button>
              <button className="w-full flex items-center gap-3 text-sm text-[#6e6e6e]">
                <Heart size={16} /> Wishlist ({wishCount})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page content: product detail, category page, OR homepage ── */}
      {currentProduct ? (
        <ProductDetailPage
          product={currentProduct}
          onBack={goBack}
          onProductClick={goToProduct}
          onAddToBag={() => setCartCount(c => c + 1)}
        />
      ) : currentPage ? (
        <CategoryPage
          page={currentPage}
          onBack={() => setCurrentPage(null)}
          onNavigate={(category, sub) => setCurrentPage({ category, sub })}
        />
      ) : <>

      {/* ── Hero ── */}
      <section className="bg-[#faf7f4] overflow-hidden">
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 min-h-[90vh] md:min-h-[85vh]">
          {/* Left */}
          <div className="relative flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 md:py-0 order-2 md:order-1 overflow-hidden" style={{background:"linear-gradient(145deg,#ffffff 0%,#fdf4f7 35%,#fce8ef 65%,#faf0f5 100%)"}}>
            {/* Decorative background elements */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Large soft pink glow top-right */}
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-25" style={{background:"radial-gradient(circle,#d4145a 0%,transparent 65%)"}} />
              {/* Medium glow bottom-left */}
              <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full opacity-15" style={{background:"radial-gradient(circle,#c8175c 0%,transparent 65%)"}} />
              {/* Subtle diagonal stripe lines */}
              <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:"repeating-linear-gradient(45deg,#d4145a 0,#d4145a 1px,transparent 0,transparent 12px)",backgroundSize:"18px 18px"}} />
              {/* Thin decorative arcs */}
              <svg className="absolute top-8 right-8 opacity-10" width="160" height="160" viewBox="0 0 160 160" fill="none">
                <circle cx="80" cy="80" r="70" stroke="#d4145a" strokeWidth="1" strokeDasharray="4 6" />
                <circle cx="80" cy="80" r="50" stroke="#d4145a" strokeWidth="0.5" />
              </svg>
              <svg className="absolute bottom-12 left-6 opacity-8" width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="42" stroke="#d4145a" strokeWidth="1" strokeDasharray="3 5" />
              </svg>
            </div>

            <span className="relative z-10 text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold mb-6">
              New Collection 2026
            </span>
            <h1 className="relative z-10 font-['Playfair_Display'] text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-[#1a1a1a] mb-6">
              Style That Speaks<br />
              <em className="italic text-[#d4145a]">Before You Do.</em>
            </h1>
            <p className="relative z-10 text-[#6e6e6e] text-base md:text-lg leading-relaxed mb-10 max-w-md font-light">
              Discover premium casual wear, partywear, ethnic and Indo-western collections crafted for every woman.
            </p>
            <div className="relative z-10 flex flex-wrap gap-4">
              <button
                onClick={() => { setCurrentPage({ category: "Casual Wear", sub: "Casual Wear" }); window.scrollTo(0, 0); }}
                className="px-8 py-3.5 bg-[#1a1a1a] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#d4145a] transition-colors duration-300"
              >
                Shop Collection
              </button>
              <button
                onClick={() => { setCurrentPage({ category: "New Arrivals", sub: "Just In" }); window.scrollTo(0, 0); }}
                className="flex items-center gap-2 px-8 py-3.5 border border-[#1a1a1a] text-[#1a1a1a] text-xs tracking-[0.2em] uppercase font-medium hover:border-[#d4145a] hover:text-[#d4145a] transition-colors duration-300"
              >
                Explore New Arrivals <ArrowRight size={14} />
              </button>
            </div>

            {/* Stats */}
            <div className="relative z-10 flex gap-10 mt-14 pt-10 border-t border-[#ececec]/60">
              {[["2,400+", "Styles"], ["4.9★", "Rating"], ["50K+", "Happy Women"]].map(([val, label]) => (
                <div key={label}>
                  <div className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a1a]">{val}</div>
                  <div className="text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: model image */}
          <div className="relative order-1 md:order-2 h-64 md:h-auto">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-8 right-8 w-64 h-64 rounded-full bg-[#fce8ef] opacity-40 blur-3xl" />
              <div className="absolute bottom-12 left-4 w-40 h-40 rounded-full bg-[#f5e6ec] opacity-30 blur-2xl" />
            </div>
            <img
              src={u("1664076458686-3449062080ac", 800, 1000)}
              alt="Elegant woman in premium fashion"
              className="w-full h-full object-cover object-top relative z-10"
            />
            {/* Floating tag */}
            <div className="absolute bottom-8 left-6 z-20 bg-white/95 backdrop-blur-sm px-5 py-3 shadow-lg hidden md:block">
              <div className="text-[9px] tracking-[0.2em] uppercase text-[#d4145a] font-semibold mb-0.5">Just Dropped</div>
              <div className="text-sm font-semibold text-[#1a1a1a]">Pearl Organza Gown</div>
              <div className="text-sm text-[#6e6e6e] font-light">₹4,199</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trending Categories ── */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="text-left mb-12 md:mb-16">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Discover</span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-3">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map(cat => (
            <div
              key={cat.name}
              className="group relative overflow-hidden cursor-pointer aspect-[3/4]"
              onClick={() => { setCurrentPage({ category: cat.name, sub: cat.name }); window.scrollTo(0, 0); }}
            >
              <img
                src={cat.img}
                alt={cat.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-[#1a1a1a] opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                  <div className="text-[9px] tracking-[0.25em] uppercase text-white/80 mb-1">{cat.tagline}</div>
                  <h3 className="font-['Playfair_Display'] text-xl md:text-2xl font-bold text-white leading-snug">{cat.name}</h3>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setCurrentPage({ category: cat.name, sub: cat.name }); window.scrollTo(0,0); }}
                  className="mt-4 self-start flex items-center gap-2 bg-white text-[#1a1a1a] text-[10px] tracking-[0.2em] uppercase font-semibold px-5 py-2.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 delay-100 hover:bg-[#d4145a] hover:text-white"
                >
                  Shop Now <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="py-16 md:py-24 bg-[#faf7f4]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Fresh In</span>
              <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-2">New Arrivals</h2>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-medium text-[#1a1a1a] hover:text-[#d4145a] transition-colors group">
              View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7">
            {PRODUCTS.map(p => <ProductCard key={p.id} p={p} />)}
          </div>

          <div className="text-center mt-10 md:hidden">
            <a href="#" className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-medium border border-[#1a1a1a] px-8 py-3 hover:bg-[#1a1a1a] hover:text-white transition-colors">
              View All <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Best Sellers ── */}
      <section className="py-20 md:py-28 max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Customer Favourites</span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-3">Best Sellers</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {BEST_SELLERS.map(item => (
            <div key={item.name} className="group cursor-pointer">
              <div className="relative overflow-hidden aspect-[3/4] bg-[#faf7f4]">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 text-[9px] tracking-[0.15em] uppercase bg-white text-[#d4145a] font-semibold px-2.5 py-1">
                  {item.tag}
                </span>
              </div>
              <div className="pt-4">
                <h3 className="text-sm font-medium text-[#1a1a1a] tracking-wide leading-snug">{item.name}</h3>
                <p className="text-sm text-[#6e6e6e] mt-1">₹{item.price.toLocaleString("en-IN")}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Mandola ── */}
      <section className="bg-[#faf7f4] py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1a1a1a]">Why Mandola?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {WHY_ITEMS.map(item => (
              <div key={item.title} className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 border border-[#ececec] flex items-center justify-center text-[#d4145a] mb-5 group-hover:bg-[#d4145a] group-hover:text-white group-hover:border-[#d4145a] transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold tracking-wide text-[#1a1a1a] mb-2">{item.title}</h3>
                <p className="text-xs text-[#6e6e6e] leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Full-width editorial banner ── */}
      <section className="relative h-[55vh] md:h-[65vh] overflow-hidden flex items-center">
        <img
          src={u("1756483510882-55bc1249642d", 1440, 900)}
          alt="Mandola editorial collection"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-[#1a1a1a]/45" />
        <div className="relative z-10 text-white max-w-[1440px] mx-auto px-8 md:px-20 lg:px-28">
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#d4145a] font-semibold mb-4 block">The Mandola Edit</span>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 max-w-2xl">
            Crafted for the<br /><em className="italic">Modern Indian Woman</em>
          </h2>
          <button className="px-10 py-4 border border-white text-white text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-[#1a1a1a] transition-all duration-300">
            Explore the Collection
          </button>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">What She Says</span>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-3">Customer Love</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-[#faf7f4] p-8 relative group hover:shadow-md transition-shadow">
                <Quote size={32} className="text-[#d4145a] opacity-30 mb-4" strokeWidth={1} />
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} size={13} className="fill-[#d4145a] text-[#d4145a]" />
                  ))}
                </div>
                <p className="text-[#1a1a1a] text-sm leading-relaxed mb-7 font-light italic">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-semibold text-[#1a1a1a]">{r.name}</div>
                    <div className="text-[10px] text-[#6e6e6e] tracking-wide">{r.city} · {r.product}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instagram Lookbook ── */}
      <section className="py-16 md:py-24 bg-[#faf7f4]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">@mandola.in</span>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-3">The Lookbook</h2>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
            {LOOKBOOK.map((img, i) => (
              <div key={i} className="relative group aspect-square overflow-hidden cursor-pointer col-span-2">
                <img src={img} alt={`Lookbook ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-[#1a1a1a]/0 group-hover:bg-[#1a1a1a]/50 transition-all duration-400 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Instagram size={22} className="text-white" strokeWidth={1.5} />
                  <span className="text-white text-[9px] tracking-[0.2em] uppercase font-medium">Shop the Look</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-20 md:py-28 bg-[#1a1a1a] text-white">
        <div className="max-w-xl mx-auto px-6 text-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Community</span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold mt-4 mb-4">
            Join the Mandola Community
          </h2>
          <p className="text-[#9e9e9e] text-sm md:text-base font-light leading-relaxed mb-10">
            Get exclusive offers, latest launches and fashion inspiration — delivered straight to your inbox.
          </p>

          {subscribed ? (
            <div className="text-[#d4145a] text-sm tracking-wide font-medium py-4">
              ✓ Welcome to the Mandola family! Check your inbox.
            </div>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder-[#6e6e6e] px-5 py-3.5 text-sm focus:outline-none focus:border-[#d4145a] transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#d4145a] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#b0103e] transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[#6e6e6e] text-xs mt-5 font-light">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      </> /* end homepage */}

      {/* ── Footer ── */}
      <footer className="bg-[#111111] text-white pt-16 pb-8">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          {/* Top: logo + tagline */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 pb-12 border-b border-white/10 gap-6">
            <div>
              <img src={logoImg} alt="Mandola" className="h-12 w-auto object-contain brightness-0 invert" />
              <p className="text-[#6e6e6e] text-xs mt-3 tracking-wide font-light">A Woman Fashion</p>
            </div>
            <div className="flex gap-5">
              {[Instagram, Phone].map((Icon, i) => (
                <button key={i} className="w-9 h-9 border border-white/20 flex items-center justify-center text-[#9e9e9e] hover:border-[#d4145a] hover:text-[#d4145a] transition-all">
                  <Icon size={15} strokeWidth={1.5} />
                </button>
              ))}
              {/* Pinterest */}
              <button className="w-9 h-9 border border-white/20 flex items-center justify-center text-[#9e9e9e] hover:border-[#d4145a] hover:text-[#d4145a] transition-all">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.16 1.22-5.16s-.31-.62-.31-1.55c0-1.46.84-2.55 1.89-2.55.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.87 3.48-.25 1.04.52 1.88 1.53 1.88 1.84 0 3.08-2.36 3.08-5.15 0-2.13-1.44-3.62-3.49-3.62-2.38 0-3.77 1.78-3.77 3.63 0 .72.28 1.49.62 1.91.07.08.08.15.06.23l-.23.94c-.04.15-.13.18-.29.11-1.08-.5-1.76-2.08-1.76-3.35 0-2.72 1.98-5.22 5.71-5.22 3 0 5.33 2.14 5.33 5 0 2.97-1.87 5.37-4.47 5.37-.87 0-1.69-.45-1.97-1l-.54 2.01c-.19.74-.72 1.67-1.07 2.23.81.25 1.66.38 2.55.38 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
              </button>
              {/* YouTube */}
              <button className="w-9 h-9 border border-white/20 flex items-center justify-center text-[#9e9e9e] hover:border-[#d4145a] hover:text-[#d4145a] transition-all">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              </button>
            </div>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
            {[
              {
                title: "Shop",
                links: ["Casual Wear", "Party Wear", "Ethnic Wear", "Indo-Western", "New Arrivals", "Sale"],
              },
              {
                title: "Customer Care",
                links: ["Track Order", "Shipping", "Returns", "FAQs", "Contact Us"],
              },
              {
                title: "Company",
                links: ["About Mandola", "Privacy Policy", "Terms & Conditions", "Careers"],
              },
              {
                title: "Contact",
                links: ["+91 98765 43210", "hello@mandola.in", "Mon–Sat 10am–7pm", "Mumbai, India"],
              },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-white mb-5">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-xs text-[#6e6e6e] hover:text-[#d4145a] transition-colors font-light tracking-wide">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Footer newsletter */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <h4 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-white mb-5">Newsletter</h4>
              <p className="text-xs text-[#6e6e6e] mb-4 leading-relaxed font-light">Get early access to launches and exclusive deals.</p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-white/5 border border-white/15 text-white placeholder-[#4e4e4e] px-4 py-2.5 text-xs focus:outline-none focus:border-[#d4145a] transition-colors"
                />
                <button className="bg-[#d4145a] text-white text-[10px] tracking-[0.2em] uppercase py-2.5 hover:bg-[#b0103e] transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[10px] text-[#4e4e4e] tracking-wide">© 2026 Mandola. All Rights Reserved.</p>
            <p className="text-[10px] text-[#4e4e4e] tracking-wide italic">Designed with elegance.</p>
          </div>
        </div>
      </footer>

      {/* ── Mobile Sticky Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#ececec] flex items-center justify-around py-2">
        {[
          { icon: <Home size={20} strokeWidth={1.5} />, label: "Home" },
          { icon: <LayoutGrid size={20} strokeWidth={1.5} />, label: "Categories" },
          { icon: <Heart size={20} strokeWidth={1.5} />, label: "Wishlist", badge: wishCount },
          { icon: <ShoppingCart size={20} strokeWidth={1.5} />, label: "Cart", badge: cartCount },
          { icon: <User size={20} strokeWidth={1.5} />, label: "Profile" },
        ].map((item, i) => (
          <button key={i} className={`flex flex-col items-center gap-0.5 relative ${i === 0 ? "text-[#d4145a]" : "text-[#6e6e6e]"}`}>
            <div className="relative">
              {item.icon}
              {item.badge ? (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#d4145a] text-white text-[8px] flex items-center justify-center rounded-full font-bold">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[9px] tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="md:hidden h-16" />

      {/* ── Cart Side Panel ── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setCartOpen(false)} />
          <div className="relative w-96 max-w-full bg-white h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#ececec]">
              <h2 className="font-['Playfair_Display'] text-xl font-semibold">Shopping Bag ({cartCount})</h2>
              <button onClick={() => setCartOpen(false)} className="text-[#6e6e6e] hover:text-[#1a1a1a]"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {PRODUCTS.slice(0, cartCount).map(p => (
                <div key={p.id} className="flex gap-4">
                  <img src={p.img1} alt={p.name} className="w-20 h-26 object-cover flex-shrink-0 bg-[#faf7f4]" style={{height: "6.5rem"}} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1a1a1a] leading-snug mb-1">{p.name}</p>
                    <p className="text-xs text-[#6e6e6e] mb-2">Size: M &nbsp;·&nbsp; Qty: 1</p>
                    <p className="text-sm font-semibold">₹{p.price.toLocaleString("en-IN")}</p>
                  </div>
                  <button onClick={() => setCartCount(c => Math.max(0, c - 1))} className="text-[#6e6e6e] hover:text-[#d4145a] self-start mt-1">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="px-6 py-5 border-t border-[#ececec] space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span>Subtotal</span>
                <span>₹{PRODUCTS.slice(0, cartCount).reduce((s, p) => s + p.price, 0).toLocaleString("en-IN")}</span>
              </div>
              <p className="text-[10px] text-[#6e6e6e] tracking-wide">Shipping calculated at checkout</p>
              <button className="w-full bg-[#1a1a1a] text-white py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors">
                Proceed to Checkout
              </button>
              <button onClick={() => setCartOpen(false)} className="w-full border border-[#ececec] text-[#1a1a1a] py-3 text-xs tracking-[0.15em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Wishlist Side Panel ── */}
      {wishOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setWishOpen(false)} />
          <div className="relative w-96 max-w-full bg-white h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#ececec]">
              <h2 className="font-['Playfair_Display'] text-xl font-semibold">Wishlist ({wishCount})</h2>
              <button onClick={() => setWishOpen(false)} className="text-[#6e6e6e] hover:text-[#1a1a1a]"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {PRODUCTS.map(p => (
                <div key={p.id} className="flex gap-4">
                  <img src={p.img1} alt={p.name} className="w-20 object-cover flex-shrink-0 bg-[#faf7f4]" style={{height: "6.5rem"}} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1a1a1a] leading-snug mb-1">{p.name}</p>
                    <p className="text-sm font-semibold mb-3">₹{p.price.toLocaleString("en-IN")}</p>
                    <button className="text-[10px] tracking-[0.15em] uppercase bg-[#1a1a1a] text-white px-4 py-1.5 hover:bg-[#d4145a] transition-colors">
                      Move to Bag
                    </button>
                  </div>
                  <button className="text-[#6e6e6e] hover:text-[#d4145a] self-start mt-1"><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Account Dropdown ── */}
      {accountOpen && (
        <div className="fixed inset-0 z-50 flex justify-end items-start pt-[72px]" onClick={() => setAccountOpen(false)}>
          <div className="relative mr-6 md:mr-12 w-64 bg-white border border-[#ececec] shadow-xl py-2" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-[#ececec]">
              <p className="text-xs text-[#6e6e6e] tracking-wide mb-3">Welcome back</p>
              <button className="w-full bg-[#1a1a1a] text-white py-2.5 text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors mb-2">
                Sign In
              </button>
              <button className="w-full border border-[#ececec] text-[#1a1a1a] py-2.5 text-[10px] tracking-[0.15em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
                Create Account
              </button>
            </div>
            {["My Orders", "My Wishlist", "My Addresses", "Help & Support"].map(item => (
              <a key={item} href="#" className="flex items-center justify-between px-5 py-3 text-xs text-[#1a1a1a] hover:text-[#d4145a] hover:bg-[#faf7f4] transition-colors tracking-wide">
                {item} <ArrowRight size={12} />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
