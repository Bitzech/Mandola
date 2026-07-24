import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../types/product.types";

interface WishlistContextType {
  items: Product[];
  wishlistIds: Set<number>;
  loading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleWishlist: (product: Product) => Promise<void>;
  isWishlisted: (productId: number) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleWishlist = async (product: Product) => {
    // Scaffolded for API integration phase
    console.log("WishlistProvider.toggleWishlist scaffolded", product.id);
  };

  const isWishlisted = (productId: number) => {
    return wishlistIds.has(productId);
  };

  const refreshWishlist = async () => {
    // Scaffolded for API integration phase
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        wishlistIds,
        loading,
        isOpen,
        setIsOpen,
        toggleWishlist,
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
