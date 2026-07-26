import { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import { ALL_PRODUCTS } from "../data";
import type { Page, ProductType } from "../data";
import { categoryService } from "../services/category.service";
import { Category, SubCategory } from "../types/product.types";

interface Props {
  page: NonNullable<Page>;
  onBack: () => void;
  onNavigate: (category: string, sub: string) => void;
  onProductClick: (p: ProductType) => void;
}

export default function CategoryPage({ page, onBack, onNavigate, onProductClick }: Props) {
  const [sortBy, setSortBy] = useState("featured");
  const [priceFilter, setPriceFilter] = useState("all");
  const [wished, setWished] = useState<Set<number>>(new Set());

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    categoryService.getCategoriesWithSubCategories()
      .then((allCats) => {
        if (!mounted) return;
        setCategories(allCats);

        // Match category by slug or name
        const match = allCats.find(c =>
          c.slug.toLowerCase() === page.category.toLowerCase() ||
          c.name.toLowerCase() === page.category.toLowerCase() ||
          c.slug.toLowerCase() === page.category.toLowerCase().replace(/\s+/g, "-")
        );

        if (match) {
          setCurrentCategory(match);
          if (match.subCategories) {
            setSubCategories(match.subCategories);
          }
        } else if (allCats.length > 0) {
          // If no exact slug match, use first matching category or fallback
          const fallback = allCats[0];
          setCurrentCategory(fallback);
          if (fallback.subCategories) setSubCategories(fallback.subCategories);
        }
      })
      .catch((err) => {
        console.error("[CategoryPage] Error fetching category data:", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [page.category]);

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

  const categoryTitle = currentCategory ? currentCategory.name : page.category;
  const categoryDescription = currentCategory?.description || "Explore curated luxury women's fashion.";
  const bannerImage = currentCategory?.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="min-h-screen bg-white">
      {/* Category hero banner */}
      <div className="relative h-48 md:h-64 overflow-hidden bg-[#faf7f4] flex items-end">
        {/* Background image & gradient overlay */}
        <div className="absolute inset-0">
          <img src={bannerImage} alt={categoryTitle} className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(250,247,244,0.95) 0%, rgba(252,232,239,0.85) 50%, rgba(250,240,245,0.95) 100%)" }} />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #d4145a 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        </div>

        <div className="relative z-10 px-8 md:px-20 pb-8 w-full max-w-[1440px] mx-auto">
          <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-3">
            <button onClick={onBack} className="hover:text-[#d4145a] transition-colors">Home</button>
            <span>/</span>
            <span className="text-[#1a1a1a] font-semibold">{categoryTitle}</span>
            {page.sub !== page.category && page.sub !== "all" && (
              <>
                <span>/</span>
                <span className="text-[#d4145a]">{page.sub}</span>
              </>
            )}
          </nav>
          <h1 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a]">{page.sub !== "all" ? page.sub : categoryTitle}</h1>
          <p className="text-[#6e6e6e] text-sm mt-1 font-light max-w-xl">{categoryDescription}</p>
        </div>
      </div>

      {/* Filters + grid */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10">
        {/* Live Sub-category pills */}
        {subCategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-[#f0f0f0]">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#9e9e9e] font-semibold mr-2">Sub-Categories:</span>
            <button
              onClick={() => onNavigate(currentCategory?.slug || page.category, "all")}
              className={`px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase border transition-colors rounded-sm ${page.sub === "all" ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a]"}`}
            >
              All {categoryTitle}
            </button>
            {subCategories.map(s => {
              const active = page.sub.toLowerCase() === s.slug.toLowerCase() || page.sub.toLowerCase() === s.name.toLowerCase();
              return (
                <button
                  key={s.id}
                  onClick={() => onNavigate(currentCategory?.slug || page.category, s.slug)}
                  className={`px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase border transition-colors rounded-sm ${active ? "bg-[#d4145a] text-white border-[#d4145a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a]"}`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Sort + filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-5 border-b border-[#ececec]">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] font-medium">Filter:</span>
            {[["all", "All Prices"], ["under2k", "Under ₹2,000"], ["2k-4k", "₹2,000–₹4,000"], ["above4k", "Above ₹4,000"]].map(([val, label]) => (
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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#d4145a]" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-7">
            {sorted.map(p => {
              const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
              const isWished = wished.has(p.id);
              return (
                <div key={p.id} className="group cursor-pointer" onClick={() => onProductClick(p)}>
                  <div className="relative overflow-hidden bg-[#faf7f4] aspect-[3/4]">
                    <img src={p.img1} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    {p.tag && (
                      <span className="absolute top-3 left-3 text-[9px] font-semibold tracking-[0.15em] uppercase bg-white text-[#1a1a1a] px-2.5 py-1">{p.tag}</span>
                    )}
                    <span className="absolute top-3 right-10 text-[9px] font-semibold bg-[#d4145a] text-white px-2 py-1">-{discount}%</span>
                    <button
                      onClick={e => { e.stopPropagation(); setWished(w => { const n = new Set(w); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; }); }}
                      className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm"
                    >
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
                      {p.colors.map((c, i) => <div key={i} className="w-3 h-3 rounded-full border border-[#ececec]" style={{ backgroundColor: c }} />)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
