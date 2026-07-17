import { useState } from "react";
import { Heart, ShoppingBag, X } from "lucide-react";
import { MOCK_WISHLIST, type WishlistItem } from "./dashboardData";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(MOCK_WISHLIST);
  const [added, setAdded] = useState<Set<number>>(new Set());

  const remove = (id: number) => setItems(prev => prev.filter(p => p.id !== id));

  const addToCart = (id: number) => {
    setAdded(prev => new Set(prev).add(id));
    setTimeout(() => setAdded(prev => { const n = new Set(prev); n.delete(id); return n; }), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Saved</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">My Wishlist</h2>
        <p className="text-sm text-[#6e6e6e] font-light mt-1">{items.length} item{items.length !== 1 ? "s" : ""} saved</p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-[#ececec] p-16 text-center">
          <Heart size={48} className="text-[#ececec] mx-auto mb-4" strokeWidth={1} />
          <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a] mb-2">Your wishlist is empty</p>
          <p className="text-sm text-[#6e6e6e] font-light">Save items you love and come back to them anytime.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map(p => {
            const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
            const isAdded = added.has(p.id);
            return (
              <div key={p.id} className="group relative bg-white border border-[#ececec] overflow-hidden">
                {/* Image */}
                <div className="relative overflow-hidden aspect-[3/4] bg-[#faf7f4]">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {p.tag && (
                    <span className="absolute top-2 left-2 text-[9px] font-semibold tracking-[0.1em] uppercase bg-white text-[#1a1a1a] px-2 py-0.5">{p.tag}</span>
                  )}
                  <span className="absolute top-2 right-8 text-[9px] font-semibold bg-[#d4145a] text-white px-1.5 py-0.5">-{discount}%</span>
                  <button
                    onClick={() => remove(p.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm text-[#6e6e6e] hover:text-[#d4145a] transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
                {/* Info */}
                <div className="p-3">
                  <p className="text-xs font-medium text-[#1a1a1a] leading-snug mb-1.5">{p.name}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold">₹{p.price.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-[#6e6e6e] line-through">₹{p.mrp.toLocaleString("en-IN")}</span>
                  </div>
                  <button
                    onClick={() => addToCart(p.id)}
                    className={`w-full py-2 text-[10px] tracking-[0.15em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 ${isAdded ? "bg-emerald-600 text-white" : "bg-[#1a1a1a] text-white hover:bg-[#d4145a]"}`}
                  >
                    <ShoppingBag size={12} />
                    {isAdded ? "Added!" : "Move to Bag"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
