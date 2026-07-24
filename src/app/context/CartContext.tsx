import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem, CartSummary } from "../types/cart.types";

interface CartContextType {
  items: CartItem[];
  summary: CartSummary | null;
  itemCount: number;
  loading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (productId: number, variantId?: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const itemCount = items.reduce((acc, curr) => acc + (curr.quantity || 1), 0);

  const addItem = async (productId: number, variantId?: number, quantity = 1) => {
    // Scaffolded for API integration phase
    console.log("CartProvider.addItem scaffolded", { productId, variantId, quantity });
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    // Scaffolded for API integration phase
    console.log("CartProvider.updateQuantity scaffolded", { itemId, quantity });
  };

  const removeItem = async (itemId: number) => {
    // Scaffolded for API integration phase
    console.log("CartProvider.removeItem scaffolded", { itemId });
  };

  const clearCart = async () => {
    // Scaffolded for API integration phase
    setItems([]);
    setSummary(null);
  };

  const refreshCart = async () => {
    // Scaffolded for API integration phase
  };

  return (
    <CartContext.Provider
      value={{
        items,
        summary,
        itemCount,
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
