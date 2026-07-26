import { useState, useEffect } from "react";
import { Heart, ShoppingBag, X, RefreshCw } from "lucide-react";
import { wishlistService } from "../services/wishlist.service";
import { cartService } from "../services/cart.service";
import { extractErrorMessage } from "../utils/errorExtractor";
import { toast } from "sonner";

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [addingToCart, setAddingToCart] = useState<Set<number>>(new Set());
  const [removingId, setRemovingId] = useState<number | null>(null);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await wishlistService.getWishlist();
      const data = response.data || response.items || response;
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
      }
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load wishlist items.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId: number) => {
    setRemovingId(productId);
    try {
      await wishlistService.removeFromWishlist(productId);
      setItems((prev) => prev.filter((p) => (p.product_id || p.id) !== productId));
      toast.success("Removed from wishlist.");
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to remove item from wishlist."));
    } finally {
      setRemovingId(null);
    }
  };

  const handleMoveToCart = async (item: any) => {
    const productId = item.product_id || item.id;
    const variantId = item.default_variant_id || item.variant_id || item.product_variant_id || item.id;

    setAddingToCart((prev) => new Set(prev).add(productId));
    try {
      await cartService.addToCart({
        product_variant_id: Number(variantId),
        quantity: 1,
      });

      // Also remove from wishlist upon adding to cart
      await wishlistService.removeFromWishlist(productId);
      setItems((prev) => prev.filter((p) => (p.product_id || p.id) !== productId));

      toast.success("Item moved to shopping bag!");
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to move item to cart."));
    } finally {
      setAddingToCart((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const formatCurrency = (val: number | string) => {
    const num = Number(val) || 0;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  return (
    <div>
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Saved</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">My Wishlist</h2>
        <p className="text-sm text-[#6e6e6e] font-light mt-1">{items.length} item{items.length !== 1 ? "s" : ""} saved</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-[#ececec] h-72 bg-slate-100" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-16 text-center">
          <p className="text-sm text-red-600 font-light mb-4">{error}</p>
          <button onClick={fetchWishlist} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry Loading
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-[#ececec] p-16 text-center">
          <Heart size={48} className="text-[#ececec] mx-auto mb-4" strokeWidth={1} />
          <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a] mb-2">Your wishlist is empty</p>
          <p className="text-sm text-[#6e6e6e] font-light">Save items you love and come back to them anytime.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((p) => {
            const pId = Number(p.product_id || p.id);
            const name = p.product_name || p.name || "Fashion Item";
            const price = Number(p.sale_price || p.base_price || p.price) || 0;
            const mrp = Number(p.base_price || p.mrp || price) || price;
            const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
            const img = p.thumbnail || p.product_image || p.img || "https://images.unsplash.com/photo-1739429942851-9083ee185d3d?w=300&h=400&fit=crop";
            const tag = p.tag || p.category_name || (discount > 20 ? "Sale" : "");

            const isMoving = addingToCart.has(pId);
            const isRemoving = removingId === pId;

            return (
              <div key={pId || p.wishlist_item_id} className="group relative bg-white border border-[#ececec] overflow-hidden">
                {/* Image */}
                <div className="relative overflow-hidden aspect-[3/4] bg-[#faf7f4]">
                  <img src={img} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {tag && (
                    <span className="absolute top-2 left-2 text-[9px] font-semibold tracking-[0.1em] uppercase bg-white text-[#1a1a1a] px-2 py-0.5">{tag}</span>
                  )}
                  {discount > 0 && (
                    <span className="absolute top-2 right-8 text-[9px] font-semibold bg-[#d4145a] text-white px-1.5 py-0.5">-{discount}%</span>
                  )}
                  <button
                    disabled={isRemoving}
                    onClick={() => handleRemove(pId)}
                    className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm text-[#6e6e6e] hover:text-[#d4145a] transition-colors disabled:opacity-50"
                  >
                    {isRemoving ? <RefreshCw size={10} className="animate-spin" /> : <X size={12} />}
                  </button>
                </div>
                {/* Info */}
                <div className="p-3">
                  <p className="text-xs font-medium text-[#1a1a1a] leading-snug mb-1.5 truncate">{name}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold">{formatCurrency(price)}</span>
                    {mrp > price && (
                      <span className="text-xs text-[#6e6e6e] line-through">{formatCurrency(mrp)}</span>
                    )}
                  </div>
                  <button
                    disabled={isMoving}
                    onClick={() => handleMoveToCart(p)}
                    className={`w-full py-2 text-[10px] tracking-[0.15em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 disabled:opacity-50 ${isMoving ? "bg-emerald-600 text-white" : "bg-[#1a1a1a] text-white hover:bg-[#d4145a]"}`}
                  >
                    {isMoving ? <RefreshCw size={12} className="animate-spin" /> : <ShoppingBag size={12} />}
                    {isMoving ? "Moving…" : "Move to Bag"}
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
