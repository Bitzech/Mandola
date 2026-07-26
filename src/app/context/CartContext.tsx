import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { cartService } from "../services/cart.service";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface CartContextType {
  items: any[];
  summary: any | null;
  itemCount: number;
  subtotal: number;
  loading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (productVariantId: number, quantity?: number) => Promise<void>;
  updateQuantity: (variantId: number, quantity: number) => Promise<void>;
  removeItem: (variantId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isLogged = isAuthenticated || Boolean(user?.id);

  const refreshCart = async () => {
    if (!isLogged) {
      setItems([]);
      setSummary(null);
      return;
    }

    setLoading(true);
    try {
      const res = await cartService.getCart();
      setItems(res.items);
      setSummary(res.summary);
    } catch (error) {
      console.error("[CartContext] Error fetching cart", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isLogged]);

  const itemCount = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.sale_price !== null && item.sale_price !== undefined ? item.sale_price : item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return sum + price * qty;
  }, 0);

  const addItem = async (productVariantId: number, quantity = 1) => {
    if (!isLogged) {
      toast.error("Please sign in to add items to your shopping bag.");
      return;
    }

    try {
      await cartService.addToCart({
        product_variant_id: Number(productVariantId),
        quantity: Number(quantity),
      });
      await refreshCart();
      toast.success("Added to shopping bag!");
      setIsOpen(true); // Open drawer on add
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to add item to bag.";
      toast.error(msg);
      console.error("[CartContext] addItem error", error);
    }
  };

  const updateQuantity = async (variantId: number, quantity: number) => {
    const vId = Number(variantId);
    if (quantity <= 0) {
      return removeItem(vId);
    }

    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (Number(i.product_variant_id) === vId ? { ...i, quantity } : i))
    );

    try {
      await cartService.updateCartItem(vId, { quantity });
      await refreshCart();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update quantity.");
      refreshCart();
    }
  };

  const removeItem = async (variantId: number) => {
    const vId = Number(variantId);
    // Optimistic update
    setItems((prev) => prev.filter((i) => Number(i.product_variant_id) !== vId));

    try {
      await cartService.removeCartItem(vId);
      await refreshCart();
      toast.success("Item removed from bag.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove item.");
      refreshCart();
    }
  };

  const clearCart = async () => {
    setItems([]);
    setSummary(null);

    try {
      await cartService.clearCart();
      await refreshCart();
      toast.success("Shopping bag cleared.");
    } catch (error: any) {
      console.error("[CartContext] clearCart error", error);
      refreshCart();
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        summary,
        itemCount,
        subtotal: Number(summary?.subtotal || subtotal),
        loading,
        isOpen,
        setIsOpen,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
