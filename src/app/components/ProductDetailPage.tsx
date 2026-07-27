import { useState, useEffect, useRef } from "react";
import {
  Heart, Star, Truck, RefreshCw, Shield, Share2, ZoomIn,
  X, Check, MapPin, RotateCcw, BadgeCheck, Headphones,
  ChevronRight, ChevronLeft, ThumbsUp, Flag, ShoppingBag,
  Award, Zap, Lock, Copy, MessageCircle
} from "lucide-react";
import { toast } from "sonner";
import { ALL_PRODUCTS } from "../data";
import type { ProductType } from "../data";
import { u } from "../data";
import { categoryService } from "../services/category.service";
import { productService } from "../services/product.service";
import { reviewService } from "../services/review.service";
import { Size, Color } from "../types/product.types";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

interface Props {
  product: ProductType;
  onBack: () => void;
  onProductClick: (p: ProductType) => void;
  onAddToBag: () => void;
}

const MOCK_REVIEWS = [
  { id: 1, name: "Priya Sharma", city: "Mumbai", rating: 5, title: "Absolutely stunning quality!", body: "This piece exceeded all my expectations. The fabric is luxurious and the fit is perfect. I received so many compliments at the event. Delivery was fast and packaging was beautiful.", images: [u("1652473291442-7a2e034a00d1",200,200), u("1617627143750-d86bc21e42bb",200,200)], helpful: 42, verified: true, date: "12 Jan 2025", sellerReply: "Thank you so much, Priya! We're thrilled you loved it. Looking forward to your next order! — Mandola Team" },
  { id: 2, name: "Ananya Krishnan", city: "Bangalore", rating: 5, title: "Perfect for festive occasions", body: "Wore this to my cousin's wedding reception and felt like a queen. The color is even more vibrant in person. Highly recommend!", images: [u("1700065404033-da12489d9738",200,200)], helpful: 38, verified: true, date: "5 Feb 2025", sellerReply: null },
  { id: 3, name: "Sneha Patel", city: "Ahmedabad", rating: 4, title: "Great value for money", body: "Really happy with the purchase. Minor stitching could be better but overall very satisfied. Will order again.", images: [], helpful: 19, verified: true, date: "20 Feb 2025", sellerReply: null },
  { id: 4, name: "Kavya Nair", city: "Kochi", rating: 5, title: "Best purchase this year!", body: "I have ordered from Mandola multiple times and they never disappoint. This one is my favourite so far. Fits true to size.", images: [u("1651828855150-ba40f6870a53",200,200)], helpful: 55, verified: true, date: "3 Mar 2025", sellerReply: "We love hearing this, Kavya! Your loyalty means the world to us. 💖 — Mandola Team" },
  { id: 5, name: "Ritika Joshi", city: "Pune", rating: 3, title: "Good but delivery was late", body: "The product itself is good, but delivery took 8 days instead of the promised 3-5. The quality makes up for it though.", images: [], helpful: 11, verified: false, date: "18 Mar 2025", sellerReply: null },
];

const LOOK_ITEMS = [
  { label: "Bottom Wear", name: "Flared Palazzo Pants", price: 1299, img: u("1651828855150-ba40f6870a53",300,380) },
  { label: "Accessories", name: "Pearl Drop Earrings", price: 599, img: u("1629511565591-a1d494ad6c58",300,380) },
  { label: "Footwear", name: "Block Heel Sandals", price: 2199, img: u("1662532577856-e8ee8b138a8b",300,380) },
  { label: "Jewellery", name: "Oxidised Necklace Set", price: 899, img: u("1614940685083-c5409b57da6e",300,380) },
];

const RATING_DIST = [
  { stars: 5, count: 84, pct: 66 },
  { stars: 4, count: 27, pct: 21 },
  { stars: 3, count: 10, pct: 8 },
  { stars: 2, count: 4, pct: 3 },
  { stars: 1, count: 3, pct: 2 },
];

type ReviewFilter = "latest" | "highest" | "lowest" | "images" | "verified";
type Tab = "description" | "specifications" | "fabric" | "washcare" | "shipping" | "returns" | "sizechart";

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className={i < Math.floor(rating) ? "fill-[#d4145a] text-[#d4145a]" : "fill-[#ececec] text-[#ececec]"} />
      ))}
    </div>
  );
}

function ProductSlider({
  label,
  title,
  products,
  getBadgeStyle,
  onProductClick,
  onAddToBag,
}: {
  label: string;
  title: string;
  products: ProductType[];
  getBadgeStyle: (tag: string) => string;
  onProductClick: (p: ProductType) => void;
  onAddToBag: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [wished, setWished] = useState<Set<number>>(new Set());

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <div className="mt-16 md:mt-24 border-t border-[#ececec] pt-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">{label}</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-2">{title}</h2>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button onClick={() => scroll("left")} className="w-9 h-9 border border-[#ececec] flex items-center justify-center hover:border-[#1a1a1a] transition-colors">
            <ChevronLeft size={16} className="text-[#1a1a1a]" />
          </button>
          <button onClick={() => scroll("right")} className="w-9 h-9 border border-[#ececec] flex items-center justify-center hover:border-[#1a1a1a] transition-colors">
            <ChevronRight size={16} className="text-[#1a1a1a]" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 md:gap-6 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
        {products.map(p => {
          const d = Math.round(((p.mrp - p.price) / p.mrp) * 100);
          const isWished = wished.has(p.id);
          return (
            <div
              key={p.id}
              className="flex-shrink-0 w-[200px] md:w-[240px] group cursor-pointer snap-start"
              onClick={() => { onProductClick(p); window.scrollTo(0, 0); }}
            >
              <div className="relative overflow-hidden bg-[#faf7f4] aspect-[3/4]">
                <img src={p.img1} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {p.tag && (
                  <span className={`absolute top-2.5 left-2.5 text-[9px] font-semibold tracking-[0.12em] uppercase px-2 py-1 ${getBadgeStyle(p.tag)}`}>
                    {p.tag}
                  </span>
                )}
                <span className="absolute top-2.5 right-10 text-[9px] font-semibold bg-[#d4145a] text-white px-2 py-1">-{d}%</span>
                <button
                  className="absolute top-2.5 right-2.5 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-[#fce8ef] transition-colors"
                  onClick={e => { e.stopPropagation(); setWished(s => { const n = new Set(s); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; }); }}
                >
                  <Heart size={12} strokeWidth={1.5} className={isWished ? "fill-[#d4145a] text-[#d4145a]" : "text-[#6e6e6e]"} />
                </button>
                <div className="absolute inset-x-0 bottom-0 flex gap-1 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button
                    className="flex-1 bg-[#1a1a1a] text-white text-[9px] tracking-[0.1em] uppercase py-2 hover:bg-[#d4145a] transition-colors"
                    onClick={e => { e.stopPropagation(); onAddToBag(); }}
                  >
                    Quick Add
                  </button>
                </div>
              </div>
              <div className="pt-3">
                <p className="text-[10px] tracking-wide text-[#d4145a] mb-0.5">Mandola Originals</p>
                <p className="text-sm font-medium text-[#1a1a1a] leading-snug mb-1 line-clamp-2">{p.name}</p>
                <div className="flex items-center gap-1 mb-1.5">
                  <StarRow rating={4.5} size={10} />
                  <span className="text-[10px] text-[#9e9e9e]">(42)</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-[#1a1a1a]">₹{p.price.toLocaleString("en-IN")}</span>
                  <span className="text-xs text-[#9e9e9e] line-through">₹{p.mrp.toLocaleString("en-IN")}</span>
                  <span className="text-[10px] text-[#d4145a] font-medium">{d}% off</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProductDetailPage({ product, onBack, onProductClick, onAddToBag }: Props) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const isWished = isWishlisted(product.id);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [boughtNow, setBoughtNow] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("latest");
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [lookAdded, setLookAdded] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState<Set<number>>(new Set());
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const [liveSizes, setLiveSizes] = useState<Size[]>([]);
  const [liveColors, setLiveColors] = useState<Color[]>([]);
  const [liveImages, setLiveImages] = useState<string[]>([]);
  const [liveVariants, setLiveVariants] = useState<any[]>([]);
  const [liveAttributes, setLiveAttributes] = useState<any[]>([]);
  const [liveReviews, setLiveReviews] = useState<any[]>([]);
  const [liveSummary, setLiveSummary] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    categoryService.getSizes().then((data) => {
      if (mounted && data && data.length > 0) setLiveSizes(data);
    }).catch(err => console.error("[ProductDetail] Error fetching sizes", err));

    categoryService.getColors().then((data) => {
      if (mounted && data && data.length > 0) setLiveColors(data);
    }).catch(err => console.error("[ProductDetail] Error fetching colors", err));

    if (product?.id) {
      productService.getProductImages(product.id).then(res => {
        if (mounted && res.data && res.data.length > 0) {
          const imgs = res.data.map((i: any) => i.image || i.image_url);
          if (imgs.length > 0) setLiveImages(imgs);
        }
      }).catch(() => {});

      productService.getProductVariants(product.id).then(res => {
        if (mounted && res.data && res.data.length > 0) {
          setLiveVariants(res.data);
        }
      }).catch(() => {});

      productService.getProductAttributeValues(product.id).then(res => {
        if (mounted && res.data && res.data.length > 0) {
          setLiveAttributes(res.data);
        }
      }).catch(() => {});

      reviewService.getProductReviews(product.id).then(res => {
        const rawData: any = res?.data || res;
        const items = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.items)
          ? rawData.items
          : Array.isArray(rawData?.data)
          ? rawData.data
          : [];
        if (mounted && items.length > 0) {
          setLiveReviews(items);
        }
      }).catch(() => {});

      reviewService.getProductRatingSummary(product.id).then(res => {
        if (mounted && res?.data) {
          setLiveSummary(res.data);
        }
      }).catch(() => {});
    }

    return () => { mounted = false; };
  }, [product?.id]);

  const images = liveImages.length > 0
    ? liveImages
    : [
        product.img1, product.img2,
        product.img1.replace("500,650", "600,750"),
        product.img2.replace("500,650", "600,750"),
      ];
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const sizes = liveSizes.length > 0
    ? liveSizes.map(s => s.name || s.code)
    : ["XS", "S", "M", "L", "XL", "XXL"];
  const related = ALL_PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);
  const recentlyViewed = ALL_PRODUCTS.filter(p => p.id !== product.id).slice(4, 8);
  const similar = ALL_PRODUCTS.filter(p => p.id !== product.id).slice(0, 6);
  const displayReviews = liveReviews.length > 0 ? liveReviews.map(r => ({
    id: r.id,
    name: r.user_name || `${r.first_name || ""} ${r.last_name || ""}`.trim() || r.name || "Verified Customer",
    city: r.city || "Verified Buyer",
    rating: Number(r.rating) || 5,
    title: r.title || "Excellent Quality",
    body: r.review || r.comment || r.body || "",
    images: Array.isArray(r.images) ? r.images : [],
    helpful: Number(r.helpful_count) || 0,
    verified: Boolean(r.is_verified_purchase),
    date: r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recently",
    sellerReply: r.seller_reply || (r.replies && r.replies.length > 0 ? r.replies[0].reply : null)
  })) : MOCK_REVIEWS;

  const totalReviews = liveSummary?.total_reviews ? Number(liveSummary.total_reviews) : displayReviews.length;
  const avgRating = liveSummary?.average_rating ? Number(liveSummary.average_rating).toFixed(1) : (displayReviews.reduce((sum, r) => sum + Number(r.rating), 0) / (displayReviews.length || 1)).toFixed(1);

  const { addItem: addToCartItem } = useCart();

  const handleAddToBag = () => {
    if (!selectedSize) return;
    const variantId = (product as any).default_variant_id || (product as any).variant_id || product.id || 1;
    addToCartItem(Number(variantId), qty);
    onAddToBag();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) return;
    onAddToBag();
    setBoughtNow(true);
    setTimeout(() => setBoughtNow(false), 2000);
  };

  const handlePincodeCheck = () => {
    if (pincode.length === 6) {
      setPincodeResult("Delivery by " + (new Date(Date.now() + 4 * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" })) + " · Free Shipping · COD Available");
    } else {
      setPincodeResult("Please enter a valid 6-digit pincode");
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const filteredReviews = [...displayReviews].sort((a, b) => {
    if (reviewFilter === "highest") return b.rating - a.rating;
    if (reviewFilter === "lowest") return a.rating - b.rating;
    return 0;
  }).filter(r => {
    if (reviewFilter === "images") return r.images.length > 0;
    if (reviewFilter === "verified") return r.verified;
    return true;
  });

  const getBadgeStyle = (tag: string) => {
    switch (tag) {
      case "New": return "bg-[#1a1a1a] text-white";
      case "Bestseller": case "Best Seller": return "bg-[#d4145a] text-white";
      case "Trending": return "bg-[#e07050] text-white";
      case "Sale": return "bg-[#c0002a] text-white";
      default: return "bg-[#fce8ef] text-[#d4145a]";
    }
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "specifications", label: "Specifications" },
    { key: "fabric", label: "Fabric & Material" },
    { key: "washcare", label: "Wash Care" },
    { key: "shipping", label: "Shipping" },
    { key: "returns", label: "Returns" },
    { key: "sizechart", label: "Size Chart" },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Fullscreen Modal */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setFullscreen(false)}>
          <button className="absolute top-5 right-5 text-white hover:text-[#d4145a] transition-colors"><X size={28} /></button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#d4145a]" onClick={e => { e.stopPropagation(); setActiveImg(i => Math.max(0, i - 1)); }}><ChevronLeft size={32} /></button>
          <img src={images[activeImg]} alt={product.name} className="max-h-[90vh] max-w-[90vw] object-contain" onClick={e => e.stopPropagation()} />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#d4145a]" onClick={e => { e.stopPropagation(); setActiveImg(i => Math.min(images.length - 1, i + 1)); }}><ChevronRight size={32} /></button>
          <div className="absolute bottom-5 flex gap-2">
            {images.map((_, i) => <button key={i} onClick={e => { e.stopPropagation(); setActiveImg(i); }} className={`w-2 h-2 rounded-full transition-all ${activeImg === i ? "bg-white scale-125" : "bg-white/40"}`} />)}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4" onClick={() => setShowSizeGuide(false)}>
          <div className="bg-white max-w-lg w-full p-6 md:p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a]">Size Guide</h3>
              <button onClick={() => setShowSizeGuide(false)} className="text-[#6e6e6e] hover:text-[#d4145a]"><X size={20} /></button>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#faf7f4]">
                  {["Size", "Chest (in)", "Waist (in)", "Hip (in)", "Length (in)"].map(h => <th key={h} className="py-2.5 px-3 text-left text-[#1a1a1a] font-semibold tracking-wide">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {[["XS","32","26","35","54"],["S","34","28","37","55"],["M","36","30","39","56"],["L","38","32","41","57"],["XL","40","34","43","58"],["XXL","42","36","45","59"]].map(row => (
                  <tr key={row[0]} className="border-b border-[#ececec]">
                    {row.map((cell, i) => <td key={i} className={`py-2.5 px-3 ${i === 0 ? "font-semibold text-[#1a1a1a]" : "text-[#6e6e6e]"}`}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-[#6e6e6e] mt-4 tracking-wide">All measurements are approximate. For best fit, measure over your undergarments.</p>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShare && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4" onClick={() => setShowShare(false)}>
          <div className="bg-white max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-['Playfair_Display'] text-lg font-bold">Share This Product</h3>
              <button onClick={() => setShowShare(false)} className="text-[#6e6e6e] hover:text-[#d4145a]"><X size={18} /></button>
            </div>
            <div className="flex gap-3 flex-wrap">
              {["WhatsApp", "Instagram", "Facebook", "Twitter", "Copy Link"].map(s => (
                <button key={s} className="flex-1 min-w-[calc(50%-6px)] py-2.5 border border-[#ececec] text-xs tracking-wide text-[#1a1a1a] hover:bg-[#d4145a] hover:text-white hover:border-[#d4145a] transition-all">{s}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="px-6 md:px-12 py-3.5 border-b border-[#ececec] bg-[#faf7f4]">
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] max-w-[1440px] mx-auto flex-wrap">
          <button onClick={onBack} className="hover:text-[#d4145a] transition-colors">Home</button>
          <ChevronRight size={10} className="flex-shrink-0" />
          <button onClick={onBack} className="hover:text-[#d4145a] transition-colors">Ethnic Wear</button>
          <ChevronRight size={10} className="flex-shrink-0" />
          <button onClick={onBack} className="hover:text-[#d4145a] transition-colors">Kurtas &amp; Sets</button>
          <ChevronRight size={10} className="flex-shrink-0" />
          <span className="text-[#1a1a1a] font-semibold truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* Main product area */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-8 md:py-14">
        <div className="grid md:grid-cols-2 gap-8 md:gap-14 lg:gap-20">

          {/* ─── LEFT: Image Gallery ─── */}
          <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[620px] pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-[72px] h-[90px] md:w-[80px] md:h-[100px] overflow-hidden border-2 transition-all duration-200 ${activeImg === i ? "border-[#1a1a1a]" : "border-[#ececec] hover:border-[#6e6e6e]"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1 relative">
              <div
                ref={imgRef}
                className={`relative bg-[#faf7f4] aspect-[3/4] overflow-hidden cursor-zoom-in group`}
                onMouseEnter={() => setZoom(true)}
                onMouseLeave={() => setZoom(false)}
                onMouseMove={handleMouseMove}
                onClick={() => setFullscreen(true)}
              >
                <img
                  src={images[activeImg]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500"
                  style={zoom ? { transform: "scale(1.6)", transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.tag && <span className={`text-[9px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1.5 ${getBadgeStyle(product.tag)}`}>{product.tag}</span>}
                  {discount >= 30 && <span className="text-[9px] font-semibold tracking-[0.1em] uppercase bg-[#fce8ef] text-[#d4145a] px-2.5 py-1.5">Sale</span>}
                </div>
                <span className="absolute top-3 right-3 text-[9px] font-semibold bg-[#d4145a] text-white px-2.5 py-1.5">-{discount}%</span>

                {/* Zoom hint */}
                <div className="absolute bottom-3 right-3 bg-white/80 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={14} className="text-[#1a1a1a]" />
                </div>

                {/* Navigation arrows */}
                <button
                  onClick={e => { e.stopPropagation(); setActiveImg(i => Math.max(0, i - 1)); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronLeft size={16} className="text-[#1a1a1a]" />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); setActiveImg(i => Math.min(images.length - 1, i + 1)); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronRight size={16} className="text-[#1a1a1a]" />
                </button>
              </div>

              {/* Dot indicators (mobile) */}
              <div className="flex justify-center gap-1.5 mt-3 md:hidden">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${activeImg === i ? "bg-[#1a1a1a] w-4" : "bg-[#ececec]"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Product Info ─── */}
          <div className="flex flex-col">
            {/* Brand + Category */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#d4145a]">Mandola Fashion</span>
              <span className="text-[#ececec]">·</span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Ethnic Wear</span>
            </div>

            <h1 className="font-['Playfair_Display'] text-2xl md:text-3xl lg:text-4xl font-bold text-[#1a1a1a] leading-tight mb-2">{product.name}</h1>

            {/* Seller */}
            <button className="text-xs text-[#6e6e6e] hover:text-[#d4145a] transition-colors text-left mb-3 tracking-wide">
              By <span className="underline underline-offset-2">Mandola Originals</span>
            </button>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 bg-[#faf7f4] px-2.5 py-1.5">
                <Star size={11} className="fill-[#d4145a] text-[#d4145a]" />
                <span className="text-xs font-semibold text-[#1a1a1a]">{avgRating}</span>
              </div>
              <span className="text-xs text-[#6e6e6e]">{totalReviews} Ratings · 52 Reviews</span>
              <span className="text-[9px] tracking-[0.15em] uppercase text-[#6e6e6e] border border-[#ececec] px-2 py-1">SKU: MDL-{product.id.toString().padStart(4, "0")}</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-['Playfair_Display'] text-3xl font-bold text-[#1a1a1a]">₹{product.price.toLocaleString("en-IN")}</span>
              <span className="text-base text-[#6e6e6e] line-through">₹{product.mrp.toLocaleString("en-IN")}</span>
              <span className="text-xs font-semibold text-[#d4145a] bg-[#fce8ef] px-2.5 py-1">{discount}% OFF</span>
            </div>
            <p className="text-[10px] text-[#6e6e6e] tracking-wide mb-1">Inclusive of all taxes (GST)</p>
            <div className="flex items-center gap-1.5 mb-5 pb-5 border-b border-[#ececec]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-xs text-green-700 font-medium">In Stock · 12 units left</span>
            </div>

            {/* Short description */}
            <p className="text-sm text-[#6e6e6e] leading-relaxed mb-6 font-light">
              A refined blend of contemporary silhouette and timeless craft — the {product.name} is designed for the woman who commands attention effortlessly.
            </p>

            {/* Color */}
            <div className="mb-5">
              <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1a1a1a] mb-3">
                Colour: <span className="font-normal text-[#6e6e6e]">{selectedColor}</span>
              </p>
              <div className="flex gap-2.5">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${selectedColor === c ? "border-[#1a1a1a] scale-110 ring-2 ring-[#1a1a1a] ring-offset-2" : "border-[#ececec] hover:border-[#6e6e6e]"}`}
                    title={c}
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
                <button onClick={() => setShowSizeGuide(true)} className="text-[10px] tracking-wide text-[#d4145a] underline underline-offset-2 hover:text-[#a00e42] transition-colors">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s, i) => {
                  const outOfStock = i === 0;
                  return (
                    <button
                      key={s}
                      onClick={() => !outOfStock && setSelectedSize(s)}
                      disabled={outOfStock}
                      className={`w-12 h-10 text-xs font-medium border transition-all duration-150 relative ${outOfStock ? "border-[#ececec] text-[#cccccc] cursor-not-allowed" : selectedSize === s ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"}`}
                    >
                      {s}
                      {outOfStock && <span className="absolute inset-0 flex items-center justify-center"><span className="absolute w-full h-px bg-[#cccccc] rotate-45" /></span>}
                    </button>
                  );
                })}
              </div>
              {!selectedSize && <p className="text-[10px] text-[#d4145a] mt-2 tracking-wide">Please select a size to add to bag</p>}
              {selectedSize && <p className="text-[10px] text-green-600 mt-2 tracking-wide flex items-center gap-1"><Check size={10} /> Size {selectedSize} selected · Ships in 2–3 days</p>}
            </div>

            {/* Qty */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-[#ececec]">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-11 text-[#6e6e6e] hover:text-[#d4145a] transition-colors text-lg">−</button>
                <span className="w-10 text-center text-sm font-medium text-[#1a1a1a]">{qty}</span>
                <button onClick={() => setQty(q => Math.min(10, q + 1))} className="w-10 h-11 text-[#6e6e6e] hover:text-[#d4145a] transition-colors text-lg">+</button>
              </div>
              <span className="text-[10px] text-[#6e6e6e] tracking-wide">Max 10 per order</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={handleAddToBag}
                className={`flex-1 py-3.5 text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${added ? "bg-[#d4145a] text-white" : selectedSize ? "bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]" : "bg-[#ececec] text-[#9e9e9e] cursor-not-allowed"}`}
              >
                <ShoppingBag size={15} strokeWidth={1.5} />
                {added ? "Added to Bag!" : "Add to Bag"}
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-12 h-12 border-2 flex items-center justify-center transition-all duration-200 ${isWished ? "border-[#d4145a] bg-[#fce8ef]" : "border-[#ececec] hover:border-[#d4145a]"}`}
                aria-label="Wishlist"
              >
                <Heart size={17} strokeWidth={1.5} className={`transition-all ${isWished ? "fill-[#d4145a] text-[#d4145a] scale-110" : "text-[#6e6e6e]"}`} />
              </button>
              <button
                onClick={() => setShowShare(true)}
                className="w-12 h-12 border-2 border-[#ececec] flex items-center justify-center hover:border-[#6e6e6e] transition-colors"
                aria-label="Share"
              >
                <Share2 size={16} strokeWidth={1.5} className="text-[#6e6e6e]" />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className={`w-full py-3.5 text-xs tracking-[0.2em] uppercase font-semibold border-2 transition-all duration-300 mb-6 ${boughtNow ? "bg-[#d4145a] border-[#d4145a] text-white" : selectedSize ? "border-[#d4145a] text-[#d4145a] hover:bg-[#d4145a] hover:text-white" : "border-[#ececec] text-[#9e9e9e] cursor-not-allowed"}`}
            >
              {boughtNow ? "✓ Order Placed!" : "Buy Now"}
            </button>

            {/* Product Highlights */}
            <div className="grid grid-cols-5 gap-2 py-4 border-t border-b border-[#ececec] mb-6">
              {[
                { icon: <Award size={15} />, text: "Premium Quality" },
                { icon: <BadgeCheck size={15} />, text: "100% Original" },
                { icon: <RotateCcw size={15} />, text: "Easy Returns" },
                { icon: <Lock size={15} />, text: "Secure Pay" },
                { icon: <Zap size={15} />, text: "Fast Delivery" },
              ].map((h, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1.5">
                  <span className="text-[#d4145a]">{h.icon}</span>
                  <span className="text-[9px] text-[#6e6e6e] tracking-wide leading-tight">{h.text}</span>
                </div>
              ))}
            </div>

            {/* Delivery Info */}
            <div className="bg-[#faf7f4] p-4 mb-6 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={14} className="text-[#d4145a] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[10px] tracking-[0.15em] uppercase font-semibold text-[#1a1a1a] mb-2">Check Delivery</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Pincode"
                      value={pincode}
                      onChange={e => { setPincode(e.target.value.replace(/\D/g, "").slice(0, 6)); setPincodeResult(null); }}
                      className="flex-1 border border-[#ececec] px-3 py-2 text-xs bg-white focus:outline-none focus:border-[#1a1a1a] placeholder:text-[#9e9e9e]"
                    />
                    <button onClick={handlePincodeCheck} className="px-4 py-2 bg-[#1a1a1a] text-white text-[10px] tracking-wider uppercase hover:bg-[#d4145a] transition-colors">Check</button>
                  </div>
                  {pincodeResult && <p className={`text-[10px] mt-1.5 tracking-wide ${pincodeResult.includes("valid") ? "text-[#d4145a]" : "text-green-600"}`}>{pincodeResult}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-[#ececec]">
                <Truck size={14} className="text-[#d4145a] flex-shrink-0" />
                <div>
                  <p className="text-xs text-[#1a1a1a] font-medium">Free Delivery on orders above ₹999</p>
                  <p className="text-[10px] text-[#6e6e6e]">Standard 3–5 days · Express 1–2 days available</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw size={14} className="text-[#d4145a] flex-shrink-0" />
                <div>
                  <p className="text-xs text-[#1a1a1a] font-medium">15-Day Easy Returns</p>
                  <p className="text-[10px] text-[#6e6e6e]">Unworn, unwashed with tags intact</p>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="border border-[#ececec] p-4">
              <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1a1a1a] mb-3">Sold By</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#fce8ef] flex items-center justify-center flex-shrink-0">
                  <span className="font-['Playfair_Display'] text-sm font-bold text-[#d4145a]">M</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1a1a1a]">Mandola Originals</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star size={10} className="fill-[#d4145a] text-[#d4145a]" />
                    <span className="text-[10px] text-[#6e6e6e]">4.8 · 1,240 products · Since 2019</span>
                  </div>
                </div>
                <button className="text-[10px] tracking-wider uppercase text-[#d4145a] border border-[#d4145a] px-3 py-2 hover:bg-[#d4145a] hover:text-white transition-all">View Store</button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── TABS: Description, Specs, Fabric, etc. ─── */}
        <div className="mt-16 md:mt-20">
          <div className="border-b border-[#ececec] overflow-x-auto">
            <div className="flex gap-0 min-w-max">
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase font-semibold whitespace-nowrap transition-all border-b-2 ${activeTab === t.key ? "border-[#d4145a] text-[#d4145a]" : "border-transparent text-[#6e6e6e] hover:text-[#1a1a1a]"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8 max-w-3xl">
            {activeTab === "description" && (
              <div className="space-y-4 text-sm text-[#6e6e6e] leading-relaxed font-light">
                <p>The {product.name} is a masterpiece of contemporary Indian fashion, where artisanal craft meets modern silhouette. Designed for the discerning woman who understands that elegance is never accidental, each piece is thoughtfully constructed with meticulous attention to drape, proportion, and finish.</p>
                <p>The fluid fabric cascades gracefully with every movement, creating an effortlessly feminine look suitable for festive gatherings, wedding celebrations, and special occasions. The subtle play of texture and tone reflects the depth of Indian textile heritage while speaking the language of global luxury.</p>
                <p>Complete with thoughtfully placed embellishments and a silhouette that flatters every body type, this piece is a celebration of the modern Indian woman — rooted yet contemporary, restrained yet expressive.</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  {["Flattering silhouette for all body types", "Suitable for festive, wedding, and party occasions", "Premium quality stitching and finishing", "Available in complementary accessories"].map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
            )}
            {activeTab === "specifications" && (
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["Brand", "Mandola Originals"],
                    ["Fabric", "Premium Viscose Georgette"],
                    ["Fit", "Regular Fit"],
                    ["Sleeve Type", "Three Quarter Sleeves"],
                    ["Neck Type", "Round Neck"],
                    ["Pattern", "Solid with Embellishments"],
                    ["Occasion", "Festive, Party, Wedding"],
                    ["Country of Origin", "India"],
                    ["HSN Code", "62042910"],
                    ["GST Percentage", "5%"],
                  ].map(([key, val]) => (
                    <tr key={key} className="border-b border-[#ececec]">
                      <td className="py-3 pr-8 text-[10px] tracking-[0.15em] uppercase font-semibold text-[#6e6e6e] w-40">{key}</td>
                      <td className="py-3 text-sm text-[#1a1a1a]">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {activeTab === "fabric" && (
              <div className="space-y-4 text-sm text-[#6e6e6e] leading-relaxed font-light">
                <p>Crafted from 100% Premium Viscose Georgette — a fabric celebrated for its beautiful drape, lightweight comfort, and sophisticated sheen. The material is breathable, making it ideal for extended wear at celebrations.</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {[["Fabric Composition", "100% Viscose Georgette"], ["Weight", "Lightweight"], ["Finish", "Matte with natural sheen"], ["Stretch", "Minimal stretch for structured fit"]].map(([k,v]) => (
                    <div key={k} className="bg-[#faf7f4] p-3">
                      <p className="text-[9px] tracking-[0.15em] uppercase font-semibold text-[#6e6e6e] mb-1">{k}</p>
                      <p className="text-xs text-[#1a1a1a] font-medium">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "washcare" && (
              <div className="space-y-3 text-sm text-[#6e6e6e] leading-relaxed font-light">
                {[
                  "Dry clean recommended for best results.",
                  "If hand washing: use cold water with mild detergent.",
                  "Do not bleach or use harsh chemicals.",
                  "Iron on low heat with a pressing cloth.",
                  "Do not tumble dry — lay flat to dry.",
                  "Store folded in a cool, dry place.",
                  "Keep away from direct sunlight for extended periods.",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 bg-[#fce8ef] text-[#d4145a] flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">{i + 1}</span>
                    <p>{tip}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "shipping" && (
              <div className="space-y-5">
                {[
                  { title: "Standard Delivery", detail: "3–5 business days · Free on orders above ₹999 · ₹79 below" },
                  { title: "Express Delivery", detail: "1–2 business days · ₹149 additional charge" },
                  { title: "Cash on Delivery", detail: "Available on orders up to ₹10,000" },
                  { title: "Packaging", detail: "All orders are packed in Mandola signature eco-friendly packaging" },
                ].map(s => (
                  <div key={s.title} className="flex items-start gap-3 border-b border-[#ececec] pb-4">
                    <Truck size={14} className="text-[#d4145a] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#1a1a1a] mb-0.5">{s.title}</p>
                      <p className="text-xs text-[#6e6e6e] font-light">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "returns" && (
              <div className="space-y-5">
                <div className="bg-[#fce8ef] p-4 text-sm text-[#d4145a] font-medium">15-Day Hassle-Free Return Policy</div>
                {[
                  { title: "Eligible Items", detail: "Unworn, unwashed items with original tags and packaging intact." },
                  { title: "Non-Eligible", detail: "Innerwear, accessories, and sale items marked as non-returnable." },
                  { title: "Process", detail: "Initiate return via My Orders → Select item → Choose reason → Schedule pickup." },
                  { title: "Refund Timeline", detail: "Refunds processed within 5–7 business days after quality check." },
                ].map(r => (
                  <div key={r.title} className="flex items-start gap-3 border-b border-[#ececec] pb-4">
                    <RefreshCw size={14} className="text-[#d4145a] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#1a1a1a] mb-0.5">{r.title}</p>
                      <p className="text-xs text-[#6e6e6e] font-light">{r.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "sizechart" && (
              <div>
                <p className="text-xs text-[#6e6e6e] mb-4 font-light">All measurements are in inches. Measure over undergarments for accurate sizing.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-[#faf7f4]">
                        {["Size", "Chest", "Waist", "Hip", "Shoulder", "Length"].map(h => <th key={h} className="py-3 px-4 text-left text-[10px] tracking-[0.15em] uppercase font-semibold text-[#1a1a1a]">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {[["XS","32","26","35","14","54"],["S","34","28","37","14.5","55"],["M","36","30","39","15","56"],["L","38","32","41","15.5","57"],["XL","40","34","43","16","58"],["XXL","42","36","45","16.5","59"]].map(row => (
                        <tr key={row[0]} className="border-b border-[#ececec]">
                          {row.map((cell, i) => <td key={i} className={`py-3 px-4 ${i === 0 ? "font-semibold text-[#1a1a1a]" : "text-[#6e6e6e]"}`}>{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── CUSTOMER REVIEWS ─── */}
        <div className="mt-16 md:mt-20 border-t border-[#ececec] pt-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Customer Reviews</span>
              <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-2">What They&apos;re Saying</h2>
            </div>
            <button className="hidden md:block text-[10px] tracking-[0.2em] uppercase font-semibold border border-[#1a1a1a] text-[#1a1a1a] px-5 py-3 hover:bg-[#1a1a1a] hover:text-white transition-all">Write a Review</button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {/* Overall score */}
            <div className="bg-[#faf7f4] p-6 text-center">
              <p className="font-['Playfair_Display'] text-5xl font-bold text-[#1a1a1a] mb-1">{avgRating}</p>
              <StarRow rating={Number(avgRating)} size={16} />
              <p className="text-xs text-[#6e6e6e] mt-2 tracking-wide">Based on {totalReviews} ratings</p>
            </div>

            {/* Rating breakdown */}
            <div className="col-span-2 space-y-2.5">
              {RATING_DIST.map(r => (
                <div key={r.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-10 flex-shrink-0">
                    <span className="text-xs text-[#1a1a1a] font-medium">{r.stars}</span>
                    <Star size={10} className="fill-[#d4145a] text-[#d4145a]" />
                  </div>
                  <div className="flex-1 bg-[#ececec] h-2">
                    <div className="bg-[#d4145a] h-2 transition-all duration-700" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="text-[10px] text-[#6e6e6e] w-6 text-right">{r.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {(["latest","highest","lowest","images","verified"] as ReviewFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setReviewFilter(f)}
                className={`text-[10px] tracking-[0.1em] uppercase px-4 py-2 border transition-all ${reviewFilter === f ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#1a1a1a]"}`}
              >
                {f === "latest" ? "Latest" : f === "highest" ? "Highest Rating" : f === "lowest" ? "Lowest Rating" : f === "images" ? "With Images" : "Verified"}
              </button>
            ))}
          </div>

          {/* Review Cards */}
          <div className="space-y-8">
            {filteredReviews.map(r => (
              <div key={r.id} className="border-b border-[#ececec] pb-8">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#fce8ef] flex items-center justify-center flex-shrink-0">
                    <span className="font-['Playfair_Display'] text-sm font-bold text-[#d4145a]">{r.name[0]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-[#1a1a1a]">{r.name}</span>
                      {r.verified && (
                        <span className="flex items-center gap-1 text-[9px] tracking-wide text-green-700 bg-green-50 px-2 py-0.5">
                          <Check size={8} /> Verified Purchase
                        </span>
                      )}
                      <span className="text-[10px] text-[#9e9e9e]">{r.city} · {r.date}</span>
                    </div>
                    <StarRow rating={r.rating} size={11} />
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-[#1a1a1a] mb-1">{r.title}</h4>
                <p className="text-sm text-[#6e6e6e] leading-relaxed font-light mb-3">{r.body}</p>
                {r.images.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {r.images.map((img, i) => (
                      <div key={i} className="w-16 h-20 overflow-hidden bg-[#faf7f4] cursor-pointer hover:opacity-90 transition-opacity">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                {r.sellerReply && (
                  <div className="bg-[#faf7f4] p-3 mb-3 border-l-2 border-[#d4145a]">
                    <p className="text-[9px] tracking-[0.15em] uppercase font-semibold text-[#d4145a] mb-1">Seller Reply</p>
                    <p className="text-xs text-[#6e6e6e] font-light">{r.sellerReply}</p>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setHelpfulClicked(s => { const n = new Set(s); n.has(r.id) ? n.delete(r.id) : n.add(r.id); return n; })}
                    className={`flex items-center gap-1.5 text-[10px] tracking-wide transition-colors ${helpfulClicked.has(r.id) ? "text-[#d4145a]" : "text-[#6e6e6e] hover:text-[#1a1a1a]"}`}
                  >
                    <ThumbsUp size={12} strokeWidth={1.5} />
                    Helpful ({r.helpful + (helpfulClicked.has(r.id) ? 1 : 0)})
                  </button>
                  <button className="flex items-center gap-1.5 text-[10px] tracking-wide text-[#6e6e6e] hover:text-[#d4145a] transition-colors">
                    <Flag size={12} strokeWidth={1.5} />
                    Report
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-3 mt-8">
            <button className="flex-1 py-3.5 border border-[#ececec] text-[10px] tracking-[0.2em] uppercase font-semibold text-[#6e6e6e] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all">Load More Reviews</button>
            <button className="flex-1 py-3.5 border border-[#d4145a] text-[10px] tracking-[0.2em] uppercase font-semibold text-[#d4145a] hover:bg-[#d4145a] hover:text-white transition-all md:hidden">Write a Review</button>
          </div>
        </div>

        {/* ─── COMPLETE THE LOOK ─── */}
        <div className="mt-16 md:mt-24 border-t border-[#ececec] pt-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Style It Right</span>
              <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-2">Complete the Look</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            {LOOK_ITEMS.map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative overflow-hidden bg-[#faf7f4] aspect-[3/4]">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute top-2 left-2 text-[9px] bg-white text-[#1a1a1a] px-2 py-1 font-semibold tracking-wide">{item.label}</span>
                  <div className="absolute bottom-0 inset-x-0 bg-[#1a1a1a]/80 py-2.5 text-white text-center text-[10px] tracking-[0.15em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    Quick Add
                  </div>
                </div>
                <div className="pt-2.5">
                  <p className="text-xs font-medium text-[#1a1a1a] leading-snug">{item.name}</p>
                  <p className="text-sm font-semibold text-[#1a1a1a] mt-0.5">₹{item.price.toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setLookAdded(true); setTimeout(() => setLookAdded(false), 2000); }}
            className={`w-full md:w-auto md:px-12 py-3.5 text-xs tracking-[0.2em] uppercase font-semibold border-2 transition-all duration-300 ${lookAdded ? "bg-[#d4145a] border-[#d4145a] text-white" : "border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white"}`}
          >
            {lookAdded ? "✓ Entire Look Added to Bag!" : "Add Entire Look to Bag"}
          </button>
        </div>

        {/* ─── YOU MAY ALSO LIKE ─── */}
        <ProductSlider
          label="You May Also Like"
          title="Handpicked for You"
          products={related}
          getBadgeStyle={getBadgeStyle}
          onProductClick={onProductClick}
          onAddToBag={onAddToBag}
        />

        {/* ─── SIMILAR PRODUCTS ─── */}
        <ProductSlider
          label="More from this Category"
          title="Similar Products"
          products={similar}
          getBadgeStyle={getBadgeStyle}
          onProductClick={onProductClick}
          onAddToBag={onAddToBag}
        />

        {/* ─── RECENTLY VIEWED ─── */}
        <ProductSlider
          label="Your History"
          title="Recently Viewed"
          products={recentlyViewed}
          getBadgeStyle={getBadgeStyle}
          onProductClick={onProductClick}
          onAddToBag={onAddToBag}
        />

        {/* ─── TRUST SECTION ─── */}
        <div className="mt-16 md:mt-20 border-t border-[#ececec] pt-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { icon: <BadgeCheck size={22} />, title: "100% Original", sub: "Authentic products only" },
              { icon: <Lock size={22} />, title: "Secure Checkout", sub: "256-bit SSL encryption" },
              { icon: <RotateCcw size={22} />, title: "Easy Returns", sub: "15-day return policy" },
              { icon: <Shield size={22} />, title: "Trusted Seller", sub: "Verified brand partner" },
              { icon: <Headphones size={22} />, title: "Customer Support", sub: "24/7 available" },
            ].map((t, i) => (
              <div key={i} className="flex flex-col items-center gap-2.5 group">
                <div className="w-12 h-12 bg-[#faf7f4] flex items-center justify-center group-hover:bg-[#fce8ef] transition-colors">
                  <span className="text-[#d4145a]">{t.icon}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1a1a1a]">{t.title}</p>
                  <p className="text-[10px] text-[#9e9e9e] mt-0.5">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── STICKY MOBILE PURCHASE BAR ─── */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-[#ececec] shadow-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-[#6e6e6e] leading-none">Price</p>
            <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">₹{product.price.toLocaleString("en-IN")}</p>
          </div>
          <button
            onClick={handleAddToBag}
            className={`flex-1 py-3 text-[10px] tracking-[0.15em] uppercase font-semibold transition-all ${added ? "bg-[#d4145a] text-white" : selectedSize ? "bg-[#1a1a1a] text-white" : "bg-[#9e9e9e] text-white"}`}
          >
            {added ? "Added!" : "Add to Bag"}
          </button>
          <button
            onClick={handleBuyNow}
            className={`flex-1 py-3 text-[10px] tracking-[0.15em] uppercase font-semibold border-2 transition-all ${boughtNow ? "bg-[#d4145a] border-[#d4145a] text-white" : "border-[#d4145a] text-[#d4145a]"}`}
          >
            {boughtNow ? "Ordered!" : "Buy Now"}
          </button>
        </div>
      </div>

      {/* Bottom padding on mobile for sticky bar */}
      <div className="md:hidden h-20" />

      {/* ─── SHARE PRODUCT MODAL ─── */}
      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowShare(false)} />
          <div className="relative w-full max-w-md bg-white p-6 rounded-sm shadow-2xl z-10 border border-[#ececec]">
            <div className="flex items-center justify-between pb-4 border-b border-[#ececec] mb-5">
              <div className="flex items-center gap-2">
                <Share2 size={18} className="text-[#d4145a]" />
                <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Share This Product</h3>
              </div>
              <button onClick={() => setShowShare(false)} className="text-[#6e6e6e] hover:text-[#1a1a1a]">
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-5 p-3 bg-[#faf7f4] rounded-sm">
              <img src={images[0]} alt={product.name} className="w-14 h-16 object-cover rounded-sm flex-shrink-0" />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-[#1a1a1a] truncate">{product.name}</p>
                <p className="text-sm font-bold text-[#d4145a] mt-0.5">₹{product.price.toLocaleString("en-IN")}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Product link copied to clipboard!");
                  setShowShare(false);
                }}
                className="w-full flex items-center justify-center gap-2 border border-[#1a1a1a] py-3 text-xs tracking-[0.15em] uppercase font-semibold text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors"
              >
                <Copy size={15} />
                Copy Product Link
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${product.name} on Mandola: ${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowShare(false)}
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 text-xs font-medium rounded-sm hover:opacity-90 transition-opacity"
                >
                  <MessageCircle size={15} />
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.name} on Mandola`)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowShare(false)}
                  className="flex items-center justify-center gap-2 bg-[#1DA1F2] text-white py-2.5 text-xs font-medium rounded-sm hover:opacity-90 transition-opacity"
                >
                  Twitter / X
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
