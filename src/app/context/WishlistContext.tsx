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

const GUEST_WISHLIST_KEY = "MANDOLA_GUEST_WISHLIST";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isLogged = isAuthenticated || Boolean(user?.id);

  // Helper to load guest wishlist from localStorage
  const loadGuestWishlist = (): any[] => {
    try {
      const stored = localStorage.getItem(GUEST_WISHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Helper to save guest wishlist to localStorage
  const saveGuestWishlist = (guestItems: any[]) => {
    try {
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(guestItems));
    } catch (e) {
      console.error("[WishlistContext] Failed to save guest wishlist", e);
    }
  };

  const refreshWishlist = async () => {
    if (!isLogged) {
      // Load guest items from localStorage
      const guestItems = loadGuestWishlist();
      setItems(guestItems);
      const ids = new Set<number>();
      guestItems.forEach((item: any) => {
        const id = Number(item.product_id || item.id);
        if (!isNaN(id) && id > 0) {
          ids.add(id);
        }
      });
      setWishlistIds(ids);
      return;
    }

    // Customer user: sync guest items to DB then fetch
    setLoading(true);
    try {
      const guestItems = loadGuestWishlist();
      if (guestItems.length > 0) {
        // Sync each guest item to DB
        for (const guestItem of guestItems) {
          const pId = Number(guestItem.product_id || guestItem.id);
          if (pId > 0) {
            try {
              await wishlistService.addToWishlist(pId);
            } catch {
              // Ignore duplicate errors during merge
            }
          }
        }
        localStorage.removeItem(GUEST_WISHLIST_KEY);
      }

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
      // Guest wishlist toggle
      const currentlyWishlisted = wishlistIds.has(productId);
      let updatedGuestItems: any[];

      if (currentlyWishlisted) {
        updatedGuestItems = items.filter((i) => Number(i.product_id || i.id) !== productId);
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        toast.success("Removed from wishlist.");
      } else {
        updatedGuestItems = [product, ...items];
        setWishlistIds((prev) => new Set(prev).add(productId));
        toast.success("Added to your wishlist!");
      }

      setItems(updatedGuestItems);
      saveGuestWishlist(updatedGuestItems);
      return;
    }

    // Logged in user DB toggle
    const currentlyWishlisted = wishlistIds.has(productId);

    if (currentlyWishlisted) {
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

    if (!isLogged) {
      const updatedGuestItems = items.filter((i) => Number(i.product_id || i.id) !== pId);
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(pId);
        return next;
      });
      setItems(updatedGuestItems);
      saveGuestWishlist(updatedGuestItems);
      toast.success("Removed from wishlist.");
      return;
    }

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
