import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight, Star, Instagram, Quote, Award, RefreshCw,
  Shield, Truck, Heart, Eye, Sparkles, Check
} from "lucide-react";
import { categoryService } from "../services/category.service";
import { productService } from "../services/product.service";
import { Category } from "../types/product.types";
import { useWishlist } from "../context/WishlistContext";
import { formatImageUrl } from "../utils/imageUrl";
import type { Page } from "../data";

interface Props {
  setCurrentPage?: (p: Page) => void;
  email: string;
  setEmail: (v: string) => void;
  subscribed: boolean;
  setSubscribed: (v: boolean) => void;
}

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  "sarees": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
  "kurtas-suits": "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=600&q=80",
  "ethnic-wear": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
  "lehengas": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
  "party-wear": "https://images.unsplash.com/photo-1562572159-4efc207f5aff?auto=format&fit=crop&w=600&q=80",
  "western-wear": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
  "daily-wear": "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?auto=format&fit=crop&w=600&q=80",
  "indo-western": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
  "office-wear": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
  "accessories": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
  "trending": "https://images.unsplash.com/photo-1651828855150-ba40f6870a53?auto=format&fit=crop&w=600&q=80",
};

const DEFAULT_IMAGE_FALLBACK = "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80";

const WHY_ITEMS = [
  { icon: <Award size={26} strokeWidth={1.5} />, title: "Premium Quality", desc: "Ethically sourced fabrics, masterfully crafted for lasting wear." },
  { icon: <RefreshCw size={26} strokeWidth={1.5} />, title: "Easy Returns", desc: "15-day hassle-free returns, no questions asked." },
  { icon: <Shield size={26} strokeWidth={1.5} />, title: "Secure Payments", desc: "100% safe checkout with encrypted payment gateways." },
  { icon: <Truck size={26} strokeWidth={1.5} />, title: "Fast Delivery", desc: "Pan-India delivery in 3–5 business days." },
];

const REVIEWS = [
  {
    name: "Priya Sharma",
    city: "Mumbai",
    rating: 5,
    text: "The saree drape and fabric quality exceeded my expectations! Mandola has redefined ethnic shopping for me.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&auto=format"
  },
  {
    name: "Ananya Krishnan",
    city: "Bangalore",
    rating: 5,
    text: "Stunning Anarkali suit! Fits like a dream and the embroidery work is truly regal. Prompt customer service too.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&auto=format"
  },
  {
    name: "Sneha Patel",
    city: "Ahmedabad",
    rating: 5,
    text: "Ordered a co-ord set for a beach vacation. Received so many compliments. Beautiful, breathable fabric!",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&auto=format"
  }
];

const LOOKBOOK = [
  "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1589212987511-4a924cb9d8ac?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1651828855150-ba40f6870a53?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1756483510882-55bc1249642d?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1664076458686-3449062080ac?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1739429942851-9083ee185d3d?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1614940685083-c5409b57da6e?w=400&h=400&fit=crop",
];

export default function HomeSections({ setCurrentPage, email, setEmail, subscribed, setSubscribed }: Props) {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProds, setLoadingProds] = useState(true);
  const [hoveredProdId, setHoveredProdId] = useState<number | string | null>(null);

  useEffect(() => {
    let mounted = true;

    // 1. Fetch Categories from Live Database
    categoryService.getCategories()
      .then((data) => {
        if (mounted && data && Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => console.error("[HomeSections] Error fetching categories:", err))
      .finally(() => { if (mounted) setLoadingCats(false); });

    // 2. Fetch Products from Live Database
    productService.getProducts({ limit: 30 })
      .then((res) => {
        if (mounted) {
          const rawData = res?.data || res;
          const items = Array.isArray(rawData?.products)
            ? rawData.products
            : Array.isArray(rawData?.items)
            ? rawData.items
            : Array.isArray(rawData)
            ? rawData
            : [];
          setProducts(items);
        }
      })
      .catch((err) => console.error("[HomeSections] Error fetching products:", err))
      .finally(() => { if (mounted) setLoadingProds(false); });

    return () => { mounted = false; };
  }, []);

  // Helper to format category image & slug
  const formatCategories = () => {
    if (categories.length > 0) {
      return categories.slice(0, 8).map((c) => {
        const slug = c.slug || c.name.toLowerCase().replace(/\s+/g, "-");
        const defaultImg = DEFAULT_CATEGORY_IMAGES[slug] || DEFAULT_IMAGE_FALLBACK;
        return {
          id: c.id,
          name: c.name,
          slug: slug,
          tagline: c.description || "Explore live collection",
          img: c.image ? formatImageUrl(c.image) : defaultImg,
        };
      });
    }

    // Fallback static categories if DB empty
    return [
      { id: 1, name: "Sarees", slug: "sarees", tagline: "Traditional Silk & Organza", img: DEFAULT_CATEGORY_IMAGES["sarees"] },
      { id: 2, name: "Kurtas & Suits", slug: "kurtas-suits", tagline: "Designer Anarkalis & Sets", img: DEFAULT_CATEGORY_IMAGES["kurtas-suits"] },
      { id: 3, name: "Ethnic Wear", slug: "ethnic-wear", tagline: "Timeless Heritage Wear", img: DEFAULT_CATEGORY_IMAGES["ethnic-wear"] },
      { id: 4, name: "Lehengas", slug: "lehengas", tagline: "Festive & Bridal Couture", img: DEFAULT_CATEGORY_IMAGES["lehengas"] },
      { id: 5, name: "Party Wear", slug: "party-wear", tagline: "Glamorous Evening Dresses", img: DEFAULT_CATEGORY_IMAGES["party-wear"] },
      { id: 6, name: "Western Wear", slug: "western-wear", tagline: "Modern Co-ords & Tops", img: DEFAULT_CATEGORY_IMAGES["western-wear"] },
      { id: 7, name: "Indo Western", slug: "indo-western", tagline: "Fusion Gowns & Draped Sarees", img: DEFAULT_CATEGORY_IMAGES["indo-western"] },
      { id: 8, name: "Office Wear", slug: "office-wear", tagline: "Tailored Smart Formals", img: DEFAULT_CATEGORY_IMAGES["office-wear"] },
    ];
  };

  // Helper to format dynamic product item for Card rendering
  const formatProductItem = (p: any) => {
    const mrpNum = Number(p.price || p.mrp || 2999);
    const saleNum = Number(p.sale_price || p.price || mrpNum);
    const priceVal = saleNum > 0 && saleNum < mrpNum ? saleNum : mrpNum;
    const mrpVal = mrpNum > priceVal ? mrpNum : Math.round(priceVal * 1.3);
    const discount = Math.round(((mrpVal - priceVal) / mrpVal) * 100);

    const raw1 = p.thumbnail || (p.images && p.images[0]?.image) || (p.images && p.images[0]?.image_url);
    const raw2 = (p as any).secondary_image || (p.images && p.images[1]?.image) || (p.images && p.images[1]?.image_url) || raw1;

    const img1 = formatImageUrl(raw1);
    const img2 = formatImageUrl(raw2);

    let tag = "";
    if (Boolean(p.is_best_seller)) tag = "Bestseller";
    else if (Boolean(p.is_new_arrival)) tag = "New";
    else if (Boolean(p.is_trending)) tag = "Trending";

    return {
      id: p.id,
      name: p.name || "Designer Product",
      price: priceVal,
      mrp: mrpVal,
      discount: discount,
      img1: img1,
      img2: img2,
      tag: tag,
      slug: p.slug || (p.name ? p.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : `product-${p.id}`),
      raw: p,
    };
  };

  const displayCategories = formatCategories();

  // Filter New Arrivals and Best Sellers from live DB products
  const formattedProducts = products.map(formatProductItem);

  const newArrivals = formattedProducts.filter(p => p.raw.is_new_arrival === 1 || p.raw.is_new_arrival === true);
  const displayNewArrivals = (newArrivals.length >= 4 ? newArrivals : formattedProducts).slice(0, 8);

  const bestSellers = formattedProducts.filter(p => p.raw.is_best_seller === 1 || p.raw.is_best_seller === true);
  const displayBestSellers = (bestSellers.length >= 4 ? bestSellers : formattedProducts.slice().reverse()).slice(0, 8);

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/category/${categorySlug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductClick = (target: string | number) => {
    navigate(`/product/${target}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ── 1. HERO SECTION (Exact original commit cd12eff design) ── */}
      <section className="relative overflow-hidden bg-[#faf7f4]">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[85vh]">

          {/* Left: text */}
          <div className="relative z-10 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 md:py-24 order-2 md:order-1 bg-gradient-to-br from-[#fef5f8] via-[#fce8ef] to-[#fdeef4]">
            {/* Background 45-degree diagonal lines texture */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage: "repeating-linear-gradient(45deg, #d4145a 0, #d4145a 0.8px, transparent 0, transparent 10px)"
              }}
            />

            {/* Top Right Pink Glowing Ball + Concentric Dashed Circle SVG */}
            <div className="absolute top-4 right-4 z-0 pointer-events-none">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 rounded-full bg-[#f4a9c4] opacity-50 blur-3xl" />
                <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 200 200" fill="none">
                  <circle cx="120" cy="80" r="75" stroke="#d4145a" strokeWidth="0.8" strokeDasharray="4 4" />
                  <circle cx="120" cy="80" r="55" stroke="#d4145a" strokeWidth="0.8" />
                  <circle cx="120" cy="80" r="35" stroke="#d4145a" strokeWidth="0.8" strokeDasharray="3 3" />
                </svg>
              </div>
            </div>

            {/* Decorative background mark */}
            <div className="absolute top-12 left-10 opacity-[0.04] pointer-events-none hidden md:block">
              <svg width="240" height="240" viewBox="0 0 100 100" fill="none">
                <path d="M50 0 C77.6 0 100 22.4 100 50 C100 77.6 77.6 100 50 100 C22.4 100 0 77.6 0 50 C0 22.4 22.4 0 50 0 Z" stroke="#d4145a" strokeWidth="0.5" />
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
                onClick={() => handleCategoryClick("sarees")}
                className="px-8 py-3.5 bg-[#1a1a1a] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#d4145a] transition-colors duration-300 shadow-sm"
              >
                Shop Collection
              </button>
              <button
                onClick={() => handleCategoryClick("sarees")}
                className="flex items-center gap-2 px-8 py-3.5 border border-[#1a1a1a] text-[#1a1a1a] text-xs tracking-[0.2em] uppercase font-medium hover:border-[#d4145a] hover:text-[#d4145a] transition-colors duration-300 group"
              >
                Explore New Arrivals <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

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
          <div className="relative order-1 md:order-2 h-72 md:h-auto overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-8 right-8 w-64 h-64 rounded-full bg-[#fce8ef] opacity-40 blur-3xl" />
              <div className="absolute bottom-12 left-4 w-40 h-40 rounded-full bg-[#f5e6ec] opacity-30 blur-2xl" />
            </div>
            <img
              src="https://images.unsplash.com/photo-1664076458686-3449062080ac?w=800&h=1000&fit=crop&auto=format"
              alt="Pearl Organza Gown Model"
              className="w-full h-full object-cover object-top relative z-10"
            />
            <div className="absolute bottom-8 left-6 z-20 bg-white/95 backdrop-blur-sm px-5 py-3.5 shadow-lg border border-[#ececec]">
              <div className="text-[9px] tracking-[0.2em] uppercase text-[#d4145a] font-semibold mb-0.5">Just Dropped</div>
              <div className="text-sm font-semibold text-[#1a1a1a]">Pearl Organza Gown</div>
              <div className="text-sm text-[#6e6e6e] font-light mt-0.5">₹4,199</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SHOP BY CATEGORY (4 CATEGORIES IN A ROW - DYNAMIC FROM DB) ── */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 md:mb-14">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Discover</span>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-2">
              Shop by Category
            </h2>
          </div>
          <p className="text-xs text-[#6e6e6e] font-light max-w-xs mt-2 sm:mt-0">
            Handcrafted silhouettes tailored for every celebration, workday, and weekend edit.
          </p>
        </div>

        {loadingCats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[3/4] bg-[#ececec] animate-pulse rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {displayCategories.map(cat => (
              <div
                key={cat.id || cat.slug}
                onClick={() => handleCategoryClick(cat.slug)}
                className="group relative overflow-hidden cursor-pointer aspect-[3/4] rounded-sm shadow-sm bg-[#faf7f4]"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/90 via-[#1a1a1a]/25 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-400" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                    <span className="text-[8px] md:text-[9px] tracking-[0.2em] uppercase text-white/80 mb-1 block line-clamp-1">
                      {cat.tagline}
                    </span>
                    <h3 className="font-['Playfair_Display'] text-lg md:text-2xl font-bold text-white leading-snug">
                      {cat.name}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCategoryClick(cat.slug); }}
                    className="mt-3.5 self-start flex items-center gap-1.5 bg-white text-[#1a1a1a] text-[9px] md:text-[10px] tracking-[0.18em] uppercase font-semibold px-4 py-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 hover:bg-[#d4145a] hover:text-white"
                  >
                    Shop Now <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 3. NEW ARRIVALS (RIGHT BELOW SHOP BY CATEGORY - DYNAMIC FROM DB) ── */}
      <section className="py-16 md:py-24 bg-[#faf7f4] border-t border-[#ececec]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 md:mb-14">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Just Dropped</span>
              <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-2">New Arrivals</h2>
            </div>
            <button
              onClick={() => handleCategoryClick("ethnic-wear")}
              className="mt-3 sm:mt-0 text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1a1a1a] hover:text-[#d4145a] transition-colors flex items-center gap-2"
            >
              Explore All Products <ArrowRight size={14} />
            </button>
          </div>

          {loadingProds ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[3/4] bg-[#ececec] animate-pulse rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {displayNewArrivals.map((p) => {
                const isWished = isWishlisted(p.id);
                const isHovered = hoveredProdId === p.id;

                return (
                  <div
                    key={p.id}
                    className="group cursor-pointer flex flex-col"
                    onMouseEnter={() => setHoveredProdId(p.id)}
                    onMouseLeave={() => setHoveredProdId(null)}
                    onClick={() => handleProductClick(p.slug || p.id)}
                  >
                    <div className="relative overflow-hidden aspect-[3/4] bg-white rounded-sm shadow-sm">
                      <img
                        src={isHovered ? p.img2 : p.img1}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 text-[9px] tracking-[0.15em] uppercase bg-[#1a1a1a] text-white font-semibold px-2.5 py-1">
                        New
                      </span>
                      {p.discount > 0 && (
                        <span className="absolute top-3 right-11 text-[9px] font-semibold tracking-[0.1em] bg-[#d4145a] text-white px-2 py-0.5">
                          -{p.discount}%
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(p.raw); }}
                        className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full shadow-sm hover:scale-110 transition-transform"
                        title={isWished ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart
                          size={14}
                          strokeWidth={1.5}
                          className={isWished ? "fill-[#d4145a] text-[#d4145a]" : "text-[#6e6e6e]"}
                        />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[10px] tracking-[0.2em] uppercase font-semibold flex items-center gap-1.5">
                          <Eye size={13} /> View Product
                        </span>
                      </div>
                    </div>

                    <div className="pt-3.5 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-xs md:text-sm font-medium text-[#1a1a1a] tracking-wide leading-snug line-clamp-1 group-hover:text-[#d4145a] transition-colors">
                          {p.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-sm md:text-base font-semibold text-[#1a1a1a]">
                          ₹{p.price.toLocaleString("en-IN")}
                        </span>
                        {p.mrp > p.price && (
                          <span className="text-xs text-[#9e9e9e] line-through font-light">
                            ₹{p.mrp.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── 4. BEST SELLERS (RIGHT BELOW NEW ARRIVALS - DYNAMIC FROM DB) ── */}
      <section className="py-16 md:py-24 max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 md:mb-14">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Most Loved</span>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-2">Best Sellers</h2>
          </div>
          <button
            onClick={() => handleCategoryClick("sarees")}
            className="mt-3 sm:mt-0 text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1a1a1a] hover:text-[#d4145a] transition-colors flex items-center gap-2"
          >
            View All Bestsellers <ArrowRight size={14} />
          </button>
        </div>

        {loadingProds ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[3/4] bg-[#ececec] animate-pulse rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {displayBestSellers.map((p) => {
              const isWished = isWishlisted(p.id);
              const isHovered = hoveredProdId === `bs-${p.id}`;

              return (
                <div
                  key={p.id}
                  className="group cursor-pointer flex flex-col"
                  onMouseEnter={() => setHoveredProdId(`bs-${p.id}`)}
                  onMouseLeave={() => setHoveredProdId(null)}
                  onClick={() => handleProductClick(p.slug || p.id)}
                >
                  <div className="relative overflow-hidden aspect-[3/4] bg-[#faf7f4] rounded-sm shadow-sm">
                    <img
                      src={isHovered ? p.img2 : p.img1}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 text-[9px] tracking-[0.15em] uppercase bg-[#d4145a] text-white font-semibold px-2.5 py-1">
                      Bestseller
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(p.raw); }}
                      className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full shadow-sm hover:scale-110 transition-transform"
                      title={isWished ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart
                        size={14}
                        strokeWidth={1.5}
                        className={isWished ? "fill-[#d4145a] text-[#d4145a]" : "text-[#6e6e6e]"}
                      />
                    </button>
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[10px] tracking-[0.2em] uppercase font-semibold flex items-center gap-1.5">
                        <Eye size={13} /> View Product
                      </span>
                    </div>
                  </div>

                  <div className="pt-3.5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-xs md:text-sm font-medium text-[#1a1a1a] tracking-wide leading-snug line-clamp-1 group-hover:text-[#d4145a] transition-colors">
                        {p.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-sm md:text-base font-semibold text-[#1a1a1a]">
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                      {p.mrp > p.price && (
                        <span className="text-xs text-[#9e9e9e] line-through font-light">
                          ₹{p.mrp.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── 5. WHY MANDOLA? (RIGHT BELOW BEST SELLERS - 4 COLUMNS RESPONSIVE) ── */}
      <section className="bg-[#faf7f4] py-16 md:py-24 border-y border-[#ececec]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold block mb-1">
              Our Promise
            </span>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a]">
              Why Mandola?
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {WHY_ITEMS.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4 bg-white border border-[#ececec] rounded-sm group hover:border-[#d4145a] hover:shadow-md transition-all duration-300">
                <div className="w-14 h-14 rounded-full border border-[#ececec] flex items-center justify-center text-[#d4145a] mb-4 bg-[#faf7f4] group-hover:bg-[#d4145a] group-hover:text-white group-hover:border-[#d4145a] transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xs md:text-sm font-semibold tracking-wide text-[#1a1a1a] mb-1.5 uppercase">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6e6e6e] leading-relaxed font-light max-w-[220px]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. EDITORIAL BANNER ── */}
      <section className="relative h-[55vh] md:h-[65vh] overflow-hidden flex items-center">
        <img
          src="https://images.unsplash.com/photo-1756483510882-55bc1249642d?w=1600&h=900&fit=crop&auto=format"
          alt="Mandola Editorial Banner"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-[#1a1a1a]/45" />
        <div className="relative z-10 text-white max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24">
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#d4145a] font-semibold mb-3 block">
            The Mandola Edit
          </span>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-7 max-w-2xl">
            Crafted for the<br /><em className="italic">Modern Indian Woman</em>
          </h2>
          <button
            onClick={() => handleCategoryClick("sarees")}
            className="px-8 md:px-10 py-3.5 md:py-4 border border-white text-white text-[10px] md:text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-[#1a1a1a] transition-all duration-300 font-semibold"
          >
            Explore the Collection
          </button>
        </div>
      </section>

      {/* ── 7. CUSTOMER REVIEWS / TESTIMONIALS ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">What She Says</span>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-3">Customer Love</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-[#faf7f4] p-8 relative group hover:shadow-md transition-shadow border border-[#ececec]">
                <Quote size={32} className="text-[#d4145a] opacity-30 mb-4" strokeWidth={1} />
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} size={13} className="fill-[#d4145a] text-[#d4145a]" />
                  ))}
                </div>
                <p className="text-[#1a1a1a] text-sm leading-relaxed mb-7 font-light italic">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover border border-[#ececec]" />
                  <div>
                    <div className="text-sm font-semibold text-[#1a1a1a]">{r.name}</div>
                    <div className="text-[10px] text-[#6e6e6e] tracking-wide">{r.city} · Verified Buyer</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. INSTAGRAM LOOKBOOK ── */}
      <section className="py-16 md:py-24 bg-[#faf7f4]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">@mandola.in</span>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-2">The Lookbook</h2>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
            {LOOKBOOK.map((img, i) => (
              <div key={i} className="relative group aspect-square overflow-hidden cursor-pointer col-span-2 rounded-sm">
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

      {/* ── 9. NEWSLETTER ── */}
      <section className="py-20 md:py-28 bg-[#1a1a1a] text-white">
        <div className="max-w-xl mx-auto px-6 text-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Community</span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold mt-3 mb-4">
            Join the Mandola Circle
          </h2>
          <p className="text-[#9e9e9e] text-sm md:text-base font-light leading-relaxed mb-10">
            Get exclusive offers, latest launches, and fashion inspiration — delivered straight to your inbox.
          </p>

          {subscribed ? (
            <div className="bg-white/10 text-[#d4145a] text-sm tracking-wide font-medium py-4 px-6 border border-[#d4145a]/30 rounded-sm flex items-center justify-center gap-2">
              <Check size={16} /> Welcome to the Mandola Circle! Check your inbox.
            </div>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder-[#9e9e9e] px-5 py-3.5 text-xs focus:outline-none focus:border-[#d4145a] transition-colors rounded-sm"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#d4145a] text-white text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#b0103e] transition-colors rounded-sm flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[#6e6e6e] text-xs mt-5 font-light">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </>
  );
}
