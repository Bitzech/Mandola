import { useState, useEffect } from "react";
import { ArrowRight, Star, Instagram, Quote, Award, RefreshCw, Shield, Truck, Sparkles, Bookmark } from "lucide-react";
import { CATEGORIES, PRODUCTS, BEST_SELLERS, REVIEWS, LOOKBOOK, u } from "../data";
import type { Page } from "../data";
import ProductCard from "./ProductCard";
import { categoryService } from "../services/category.service";
import { Category, Brand, Collection } from "../types/product.types";

interface Props {
  setCurrentPage: (p: Page) => void;
  email: string;
  setEmail: (v: string) => void;
  subscribed: boolean;
  setSubscribed: (v: boolean) => void;
}

const WHY_ITEMS = [
  { icon: <Award size={28} strokeWidth={1.5} />, title: "Premium Quality", desc: "Ethically sourced fabrics, masterfully crafted for lasting wear." },
  { icon: <RefreshCw size={28} strokeWidth={1.5} />, title: "Easy Returns", desc: "15-day hassle-free returns, no questions asked." },
  { icon: <Shield size={28} strokeWidth={1.5} />, title: "Secure Payments", desc: "100% safe checkout with encrypted payment gateways." },
  { icon: <Truck size={28} strokeWidth={1.5} />, title: "Fast Delivery", desc: "Pan-India delivery in 3–5 business days." },
];

export default function HomeSections({ setCurrentPage, email, setEmail, subscribed, setSubscribed }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingCollections, setLoadingCollections] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Fetch Categories
    categoryService.getCategories()
      .then((data) => {
        if (mounted && data && data.length > 0) setCategories(data);
      })
      .catch((err) => console.error("[HomeSections] Failed to fetch categories", err))
      .finally(() => { if (mounted) setLoadingCats(false); });

    // Fetch Brands
    categoryService.getBrands()
      .then((data) => {
        if (mounted && data && data.length > 0) setBrands(data);
      })
      .catch((err) => console.error("[HomeSections] Failed to fetch brands", err))
      .finally(() => { if (mounted) setLoadingBrands(false); });

    // Fetch Collections
    categoryService.getCollections()
      .then((data) => {
        if (mounted && data && data.length > 0) setCollections(data);
      })
      .catch((err) => console.error("[HomeSections] Failed to fetch collections", err))
      .finally(() => { if (mounted) setLoadingCollections(false); });

    return () => {
      mounted = false;
    };
  }, []);

  const displayCategories = categories.length > 0
    ? categories.slice(0, 6).map(c => ({
        name: c.name,
        slug: c.slug,
        tagline: c.description || "Discover live collection",
        img: c.image || u("1617627143750-d86bc21e42bb", 600, 800),
        alt: c.name
      }))
    : CATEGORIES.map(c => ({
        name: c.name,
        slug: c.name.toLowerCase().replace(/\s+/g, "-"),
        tagline: c.tagline,
        img: c.img,
        alt: c.alt
      }));

  return (
    <>
      {/* ── Hero Banner ── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#faf7f4]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=1000&fit=crop&auto=format"
            alt="Hero background"
            className="w-full h-full object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#faf7f4] via-[#faf7f4]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 py-20 grid md:grid-cols-2 items-center">
          <div className="max-w-xl">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">
              Spring / Summer 2026
            </span>
            <h1 className="font-['Playfair_Display'] text-4xl md:text-6xl font-bold text-[#1a1a1a] mt-4 mb-6 leading-[1.1]">
              Effortless Elegance for the Modern Woman
            </h1>
            <p className="text-[#6e6e6e] text-base font-light mb-8 leading-relaxed max-w-md">
              Handcrafted sarees, tailored co-ords, and radiant festive wear. Redefining everyday luxury with timeless silhouettes.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => { setCurrentPage({ category: "New Arrivals", sub: "Just In" }); window.scrollTo(0, 0); }}
                className="bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase font-semibold px-8 py-4 hover:bg-[#d4145a] transition-colors flex items-center gap-2 group"
              >
                Shop Collection <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => { setCurrentPage({ category: "Ethnic Wear", sub: "Sarees" }); window.scrollTo(0, 0); }}
                className="border border-[#1a1a1a] text-[#1a1a1a] text-[10px] tracking-[0.2em] uppercase font-semibold px-8 py-4 hover:bg-[#1a1a1a] hover:text-white transition-colors"
              >
                View Sarees
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Mandola ── */}
      <section className="border-y border-[#ececec] bg-white py-10 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {WHY_ITEMS.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-4">
              <div className="text-[#d4145a] mb-3">{item.icon}</div>
              <h4 className="text-xs tracking-[0.15em] uppercase font-semibold text-[#1a1a1a] mb-1">{item.title}</h4>
              <p className="text-xs text-[#6e6e6e] font-light max-w-[200px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trending Categories (LIVE FROM BACKEND API) ── */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="text-left mb-12 md:mb-16">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Discover</span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-3">
            Shop by Category
          </h2>
        </div>

        {loadingCats ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-[3/4] bg-[#f5f5f5] animate-pulse rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {displayCategories.map(cat => (
              <div
                key={cat.name}
                className="group relative overflow-hidden cursor-pointer aspect-[3/4] rounded-sm shadow-sm"
                onClick={() => { setCurrentPage({ category: cat.slug || cat.name, sub: "all" }); window.scrollTo(0, 0); }}
              >
                <img
                  src={cat.img}
                  alt={cat.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/90 via-[#1a1a1a]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                    <div className="text-[9px] tracking-[0.25em] uppercase text-white/80 mb-1">{cat.tagline}</div>
                    <h3 className="font-['Playfair_Display'] text-xl md:text-2xl font-bold text-white leading-snug">{cat.name}</h3>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setCurrentPage({ category: cat.slug || cat.name, sub: "all" }); window.scrollTo(0, 0); }}
                    className="mt-4 self-start flex items-center gap-2 bg-white text-[#1a1a1a] text-[10px] tracking-[0.2em] uppercase font-semibold px-5 py-2.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 delay-100 hover:bg-[#d4145a] hover:text-white"
                  >
                    Shop Now <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Curated Collections Showcase (LIVE FROM BACKEND API) ── */}
      <section className="py-16 md:py-24 bg-[#faf7f4] border-y border-[#ececec]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold flex items-center gap-1.5">
                <Sparkles size={13} /> Curated Edits
              </span>
              <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-2">
                Featured Collections
              </h2>
            </div>
            <p className="text-xs text-[#6e6e6e] font-light max-w-sm mt-3 md:mt-0">
              Thematic capsule wardrobes designed for weddings, vacations, power dressing, and festive celebrations.
            </p>
          </div>

          {loadingCollections ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-80 bg-[#ebe7e2] animate-pulse rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections.slice(0, 4).map((col) => (
                <div
                  key={col.id}
                  onClick={() => { setCurrentPage({ category: col.name, sub: "all" }); window.scrollTo(0, 0); }}
                  className="group relative overflow-hidden cursor-pointer rounded-sm shadow-sm bg-white border border-[#ececec] flex flex-col"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f5]">
                    <img
                      src={col.image || u("1490481651871-ab68de25d43d", 600, 800)}
                      alt={col.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5 flex flex-col flex-1 justify-between bg-white">
                    <div>
                      <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a] group-hover:text-[#d4145a] transition-colors">
                        {col.name}
                      </h3>
                      {col.description && (
                        <p className="text-xs text-[#6e6e6e] font-light mt-1.5 line-clamp-2 leading-relaxed">
                          {col.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#f0f0f0] flex items-center justify-between text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1a1a1a] group-hover:text-[#d4145a]">
                      <span>Explore Edit</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Featured Brands Showcase (LIVE FROM BACKEND API) ── */}
      <section className="py-20 md:py-28 max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold flex items-center justify-center gap-1.5">
            <Bookmark size={13} /> Designer Labels
          </span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-2">
            Top Fashion Brands
          </h2>
          <p className="text-xs text-[#6e6e6e] font-light max-w-md mx-auto mt-2">
            Shop authentic creations from India&apos;s leading womenswear houses and indie ateliers.
          </p>
        </div>

        {loadingBrands ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-24 bg-[#f5f5f5] animate-pulse rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brands.slice(0, 6).map((b) => (
              <div
                key={b.id}
                onClick={() => { setCurrentPage({ category: b.name, sub: "all" }); window.scrollTo(0, 0); }}
                className="group p-5 bg-[#faf7f4] border border-[#ececec] rounded-sm hover:border-[#d4145a] hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer text-center flex flex-col items-center justify-center"
              >
                {b.logo ? (
                  <img src={b.logo} alt={b.name} className="w-12 h-12 rounded-full object-cover mb-3 border border-[#ececec] group-hover:scale-110 transition-transform" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center font-bold text-sm mb-3 group-hover:bg-[#d4145a] transition-colors">
                    {b.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <h4 className="text-xs font-semibold text-[#1a1a1a] group-hover:text-[#d4145a] transition-colors truncate max-w-full">
                  {b.name}
                </h4>
                {b.description && (
                  <p className="text-[10px] text-[#9e9e9e] mt-1 line-clamp-1 font-light">
                    {b.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── New Arrivals ── */}
      <section className="py-16 md:py-24 bg-[#faf7f4]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Just Dropped</span>
              <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-2">New Arrivals</h2>
            </div>
            <button
              onClick={() => { setCurrentPage({ category: "New Arrivals", sub: "Just In" }); window.scrollTo(0, 0); }}
              className="mt-4 md:mt-0 text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1a1a1a] hover:text-[#d4145a] transition-colors flex items-center gap-2"
            >
              Explore All Products <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-7">
            {PRODUCTS.map(p => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Best Sellers ── */}
      <section className="py-20 md:py-28 max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Most Loved</span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-2">Customer Favourites</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-7">
          {BEST_SELLERS.map((b, i) => (
            <div key={i} className="group relative overflow-hidden cursor-pointer aspect-[3/4] bg-[#faf7f4]">
              <img src={b.img} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-3 left-3 bg-[#1a1a1a] text-white text-[9px] tracking-[0.15em] uppercase font-semibold px-2.5 py-1">
                {b.tag}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="text-sm font-medium leading-snug mb-1">{b.name}</p>
                <p className="text-sm font-semibold">₹{b.price.toLocaleString("en-IN")}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Customer Reviews / Testimonials ── */}
      <section className="py-20 bg-[#faf7f4] border-t border-[#ececec]">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <Quote size={40} className="text-[#d4145a]/30 mx-auto mb-6" />
          <p className="font-['Playfair_Display'] text-xl md:text-2xl italic text-[#1a1a1a] leading-relaxed mb-8 font-normal">
            &ldquo;{REVIEWS[0].text}&rdquo;
          </p>
          <div className="flex items-center justify-center gap-1 text-[#d4145a] mb-4">
            {[...Array(REVIEWS[0].rating)].map((_, i) => (
              <Star key={i} size={16} className="fill-current" />
            ))}
          </div>
          <p className="text-sm font-semibold text-[#1a1a1a]">{REVIEWS[0].name}</p>
          <p className="text-xs text-[#6e6e6e]">{REVIEWS[0].city} &nbsp;•&nbsp; Verified Customer</p>
        </div>
      </section>

      {/* ── Instagram / Lookbook Grid ── */}
      <section className="py-20 max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-[#d4145a] mb-2">
            <Instagram size={20} />
            <span className="text-[10px] tracking-[0.3em] uppercase font-semibold">@mandolafashion</span>
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1a1a1a]">Follow Us On Instagram</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {LOOKBOOK.slice(0, 4).map((img, i) => (
            <div key={i} className="group relative overflow-hidden aspect-square cursor-pointer bg-[#faf7f4]">
              <img src={img} alt={`Lookbook ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Instagram size={24} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="bg-[#1a1a1a] text-white py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Stay In Touch</span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold mt-2 mb-4">Join The Mandola Circle</h2>
          <p className="text-[#9e9e9e] text-sm font-light mb-8">
            Subscribe for early access to new collections, exclusive VIP discounts, and fashion edit stories.
          </p>
          {subscribed ? (
            <p className="text-sm text-[#d4145a] font-medium tracking-wide">✨ Thank you for subscribing to Mandola Circle!</p>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }}
              className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-5 py-3.5 bg-white/10 text-white placeholder-white/40 text-xs border border-white/20 focus:outline-none focus:border-[#d4145a]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#d4145a] text-white text-[10px] tracking-[0.2em] uppercase font-semibold px-7 py-3.5 hover:bg-[#c8175c] transition-colors flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
