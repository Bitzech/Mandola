import { useState } from "react";
import { Heart } from "lucide-react";
import { ALL_PRODUCTS, NAV_ITEMS } from "../data";
import type { Page } from "../data";

interface Props {
  page: NonNullable<Page>;
  onBack: () => void;
  onNavigate: (category: string, sub: string) => void;
}

export default function CategoryPage({ page, onBack, onNavigate }: Props) {
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

  const navItem = NAV_ITEMS.find(n => n.label === page.category);

  return (
    <div className="min-h-screen bg-white">
      {/* Category hero banner */}
      <div className="relative h-48 md:h-64 overflow-hidden bg-[#faf7f4] flex items-end">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #faf7f4 0%, #fce8ef 40%, #f5e6ec 70%, #faf0f5 100%)" }}>
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #d4145a 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #d4145a 0%, transparent 70%)", transform: "translateY(40%)" }} />
          <div className="absolute top-1/2 left-0 w-48 h-48 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #c8175c 0%, transparent 70%)", transform: "translate(-40%, -50%)" }} />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(0deg,#1a1a1a 0,#1a1a1a 1px,transparent 0,transparent 50%),repeating-linear-gradient(90deg,#1a1a1a 0,#1a1a1a 1px,transparent 0,transparent 50%)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative z-10 px-8 md:px-20 pb-8 w-full">
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
                  <button
                    onClick={() => setWished(w => { const n = new Set(w); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })}
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
      </div>
    </div>
  );
}
