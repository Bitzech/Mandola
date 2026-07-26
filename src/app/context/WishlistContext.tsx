import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { wishlistService } from "../services/wishlist.service";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface WishlistContextType {
  items: any[];
  wishlistIds: Set<number>;
  wishCount: number;
  loading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleWishlist: (product: any) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isWishlisted: (productId: number) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isLogged = isAuthenticated || Boolean(user?.id);

  const refreshWishlist = async () => {
    if (!isLogged) {
      setItems([]);
      setWishlistIds(new Set());
      return;
    }

    setLoading(true);
    try {
      const data = await wishlistService.getWishlist();
      setItems(data);
      const ids = new Set<number>();
      data.forEach((item: any) => {
        const id = Number(item.product_id || item.id);
        if (!isNaN(id) && id > 0) {
          ids.add(id);
        }
      });
      setWishlistIds(ids);
    } catch (error) {
      console.error("[WishlistContext] Error fetching wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [isLogged]);

  const isWishlisted = (productId: number) => {
    return wishlistIds.has(Number(productId));
  };

  const toggleWishlist = async (product: any) => {
    const productId = Number(product.product_id || product.id);
    if (!productId || isNaN(productId)) return;

    if (!isLogged) {
      toast.error("Please sign in to add items to your wishlist.");
      return;
    }

    const currentlyWishlisted = wishlistIds.has(productId);

    if (currentlyWishlisted) {
      // Optimistically remove
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      setItems((prev) => prev.filter((i) => Number(i.product_id || i.id) !== productId));

      try {
        await wishlistService.removeFromWishlist(productId);
        toast.success("Removed from wishlist.");
      } catch (error) {
        console.error("[WishlistContext] Failed to remove item", error);
        refreshWishlist(); // Rollback
      }
    } else {
      // Optimistically add
      setWishlistIds((prev) => new Set(prev).add(productId));
      setItems((prev) => [product, ...prev]);

      try {
        await wishlistService.addToWishlist(productId);
        toast.success("Added to your wishlist!");
      } catch (error) {
        console.error("[WishlistContext] Failed to add item", error);
        refreshWishlist(); // Rollback
      }
    }
  };

  const removeFromWishlist = async (productId: number) => {
    const pId = Number(productId);
    setWishlistIds((prev) => {
      const next = new Set(prev);
      next.delete(pId);
      return next;
    });
    setItems((prev) => prev.filter((i) => Number(i.product_id || i.id) !== pId));

    try {
      await wishlistService.removeFromWishlist(pId);
      toast.success("Removed from wishlist.");
    } catch (error) {
      console.error("[WishlistContext] Failed to remove item", error);
      refreshWishlist();
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        wishlistIds,
        wishCount: wishlistIds.size || items.length,
        loading,
        isOpen,
        setIsOpen,
        toggleWishlist,
        removeFromWishlist,
        isWishlisted,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
