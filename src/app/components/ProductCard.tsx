import { useState } from "react";
import { Heart, X } from "lucide-react";
import { PRODUCTS } from "../data";
import { useWishlist } from "../context/WishlistContext";

type Product = typeof PRODUCTS[0];

export default function ProductCard({ p }: { p: Product }) {
  const [hovered, setHovered] = useState(false);
  const [quickView, setQuickView] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();

  const isWished = isWishlisted(p.id);
  const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);

  return (
    <>
      <div
        className="group relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative overflow-hidden bg-[#faf7f4] aspect-[3/4]">
          <img
            src={hovered ? p.img2 : p.img1}
            alt={p.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
          {p.tag && (
            <span className="absolute top-3 left-3 text-[10px] font-semibold tracking-[0.15em] uppercase bg-white text-[#1a1a1a] px-2.5 py-1">
              {p.tag}
            </span>
          )}
          <span className="absolute top-3 right-12 text-[10px] font-semibold tracking-[0.1em] bg-[#d4145a] text-white px-2 py-1">
            -{discount}%
          </span>
          <button
            onClick={() => toggleWishlist(p)}
            className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm hover:scale-110 transition-transform"
          >
            <Heart
              size={14}
              strokeWidth={1.5}
              className={isWished ? "fill-[#d4145a] text-[#d4145a]" : "text-[#6e6e6e]"}
            />
          </button>
          <div
            className={`absolute bottom-0 left-0 right-0 bg-[#1a1a1a] text-white text-center py-3 text-xs font-medium tracking-[0.15em] uppercase cursor-pointer transition-transform duration-300 ${hovered ? "translate-y-0" : "translate-y-full"}`}
            onClick={() => setQuickView(true)}
          >
            Quick View
          </div>
        </div>

        <div className="pt-4 pb-2">
          <h3 className="text-sm font-medium text-[#1a1a1a] tracking-wide leading-snug mb-1.5">{p.name}</h3>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-base font-semibold text-[#1a1a1a]">₹{p.price.toLocaleString("en-IN")}</span>
            <span className="text-sm text-[#6e6e6e] line-through">₹{p.mrp.toLocaleString("en-IN")}</span>
          </div>
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
