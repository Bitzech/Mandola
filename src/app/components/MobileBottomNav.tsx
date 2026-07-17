import { Home, LayoutGrid, Heart, ShoppingCart, User } from "lucide-react";

interface Props {
  currentPage: unknown;
  currentProduct: unknown;
  showAuth: boolean;
  cartOpen: boolean;
  wishOpen: boolean;
  mobileOpen: boolean;
  cartCount: number;
  wishCount: number;
  onHome: () => void;
  onCategories: () => void;
  onWishlist: () => void;
  onCart: () => void;
  onProfile: () => void;
}

export default function MobileBottomNav({
  currentPage, currentProduct, showAuth, cartOpen, wishOpen, mobileOpen,
  cartCount, wishCount,
  onHome, onCategories, onWishlist, onCart, onProfile,
}: Props) {
  const items = [
    {
      icon: <Home size={20} strokeWidth={1.5} />,
      label: "Home",
      action: onHome,
      active: !currentPage && !currentProduct && !showAuth && !cartOpen && !wishOpen,
    },
    {
      icon: <LayoutGrid size={20} strokeWidth={1.5} />,
      label: "Categories",
      action: onCategories,
      active: mobileOpen,
    },
    {
      icon: <Heart size={20} strokeWidth={1.5} />,
      label: "Wishlist",
      badge: wishCount,
      action: onWishlist,
      active: wishOpen,
    },
    {
      icon: <ShoppingCart size={20} strokeWidth={1.5} />,
      label: "Cart",
      badge: cartCount,
      action: onCart,
      active: cartOpen,
    },
    {
      icon: <User size={20} strokeWidth={1.5} />,
      label: "Profile",
      action: onProfile,
      active: showAuth,
    },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#ececec] flex items-center justify-around py-2">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            className={`flex flex-col items-center gap-0.5 relative transition-colors ${item.active ? "text-[#d4145a]" : "text-[#6e6e6e]"}`}
          >
            <div className="relative">
              {item.icon}
              {item.badge ? (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#d4145a] text-white text-[8px] flex items-center justify-center rounded-full font-bold">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[9px] tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="md:hidden h-16" />
    </>
  );
}
