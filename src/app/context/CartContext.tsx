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
  addItem: (productVariantId: number, quantity?: number, itemDetails?: any) => Promise<void>;
  updateQuantity: (variantId: number, quantity: number) => Promise<void>;
  removeItem: (variantId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

const GUEST_CART_KEY = "MANDOLA_GUEST_CART";

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isLogged = isAuthenticated || Boolean(user?.id);

  // Helper to load guest cart from localStorage
  const loadGuestCart = (): any[] => {
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Helper to save guest cart to localStorage
  const saveGuestCart = (guestItems: any[]) => {
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestItems));
    } catch (e) {
      console.error("[CartContext] Failed to save guest cart", e);
    }
  };

  const refreshCart = async () => {
    if (!isLogged) {
      const guestItems = loadGuestCart();
      setItems(guestItems);
      setSummary(null);
      return;
    }

    setLoading(true);
    try {
      // Sync guest cart to DB if guest items exist
      const guestItems = loadGuestCart();
      if (guestItems.length > 0) {
        for (const guestItem of guestItems) {
          const vId = Number(guestItem.product_variant_id || guestItem.variant_id || guestItem.id);
          const qty = Number(guestItem.quantity) || 1;
          if (vId > 0) {
            try {
              await cartService.addToCart({ product_variant_id: vId, quantity: qty });
            } catch {
              // Ignore merge errors
            }
          }
        }
        localStorage.removeItem(GUEST_CART_KEY);
      }

      const res = await cartService.getCart();
      setItems(res.items || []);
      setSummary(res.summary || null);
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

  const addItem = async (productVariantId: number, quantity = 1, itemDetails?: any) => {
    const vId = Number(productVariantId);
    if (!vId || isNaN(vId)) return;

    if (!isLogged) {
      // Guest cart add
      const currentGuestItems = loadGuestCart();
      const existingIdx = currentGuestItems.findIndex(
        (i) => Number(i.product_variant_id || i.variant_id || i.id) === vId
      );

      let updated: any[];
      if (existingIdx >= 0) {
        updated = [...currentGuestItems];
        updated[existingIdx].quantity = (Number(updated[existingIdx].quantity) || 1) + Number(quantity);
      } else {
        const newItem = {
          product_variant_id: vId,
          quantity: Number(quantity),
          name: itemDetails?.name || itemDetails?.product_name || "Fashion Style",
          price: itemDetails?.price || itemDetails?.mrp || 0,
          sale_price: itemDetails?.sale_price !== undefined ? itemDetails.sale_price : itemDetails?.price || 0,
          thumbnail: itemDetails?.thumbnail || itemDetails?.img1 || itemDetails?.img || "",
          size: itemDetails?.size || "",
          color: itemDetails?.color || "",
        };
        updated = [...currentGuestItems, newItem];
      }

      setItems(updated);
      saveGuestCart(updated);
      toast.success("Added to shopping bag!");
      setIsOpen(true);
      return;
    }

    try {
      await cartService.addToCart({
        product_variant_id: vId,
        quantity: Number(quantity),
      });
      await refreshCart();
      toast.success("Added to shopping bag!");
      setIsOpen(true);
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

    if (!isLogged) {
      const currentGuestItems = loadGuestCart();
      const updated = currentGuestItems.map((i) =>
        Number(i.product_variant_id || i.variant_id || i.id) === vId
          ? { ...i, quantity: Number(quantity) }
          : i
      );
      setItems(updated);
      saveGuestCart(updated);
      return;
    }

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

    if (!isLogged) {
      const currentGuestItems = loadGuestCart();
      const updated = currentGuestItems.filter(
        (i) => Number(i.product_variant_id || i.variant_id || i.id) !== vId
      );
      setItems(updated);
      saveGuestCart(updated);
      toast.success("Item removed from bag.");
      return;
    }

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
    if (!isLogged) {
      setItems([]);
      setSummary(null);
      localStorage.removeItem(GUEST_CART_KEY);
      toast.success("Shopping bag cleared.");
      return;
    }

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
