import { X, ArrowRight, User, LogOut, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router";
import { PRODUCTS } from "../data";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { getDashboardPathForRole } from "../routes/GuestRoute";

interface CartPanelProps {
  cartCount: number;
  setCartCount: (fn: (c: number) => number) => void;
  onClose: () => void;
}

export function CartPanel({ cartCount, setCartCount, onClose }: CartPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-96 max-w-full bg-white h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#ececec]">
          <h2 className="font-['Playfair_Display'] text-xl font-semibold">Shopping Bag ({cartCount})</h2>
          <button onClick={onClose} className="text-[#6e6e6e] hover:text-[#1a1a1a]"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {PRODUCTS.slice(0, cartCount).map(p => (
            <div key={p.id} className="flex gap-4">
              <img src={p.img1} alt={p.name} className="w-20 object-cover flex-shrink-0 bg-[#faf7f4]" style={{ height: "6.5rem" }} />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1a1a1a] leading-snug mb-1">{p.name}</p>
                <p className="text-xs text-[#6e6e6e] mb-2">Size: M &nbsp;·&nbsp; Qty: 1</p>
                <p className="text-sm font-semibold">₹{p.price.toLocaleString("en-IN")}</p>
              </div>
              <button onClick={() => setCartCount(c => Math.max(0, c - 1))} className="text-[#6e6e6e] hover:text-[#d4145a] self-start mt-1">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="px-6 py-5 border-t border-[#ececec] space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span>Subtotal</span>
            <span>₹{PRODUCTS.slice(0, cartCount).reduce((s, p) => s + p.price, 0).toLocaleString("en-IN")}</span>
          </div>
          <p className="text-[10px] text-[#6e6e6e] tracking-wide">Shipping calculated at checkout</p>
          <button className="w-full bg-[#1a1a1a] text-white py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors">
            Proceed to Checkout
          </button>
          <button onClick={onClose} className="w-full border border-[#ececec] text-[#1a1a1a] py-3 text-xs tracking-[0.15em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

interface WishlistPanelProps {
  wishCount: number;
  onClose: () => void;
}

export function WishlistPanel({ wishCount, onClose }: WishlistPanelProps) {
  const { items, removeFromWishlist } = useWishlist();

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-96 max-w-full bg-white h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#ececec]">
          <h2 className="font-['Playfair_Display'] text-xl font-semibold">Wishlist ({wishCount})</h2>
          <button onClick={onClose} className="text-[#6e6e6e] hover:text-[#1a1a1a]"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {items.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#9e9e9e] font-light">
              Your wishlist is empty.
            </div>
          ) : (
            items.map((p) => {
              const pId = Number(p.product_id || p.id);
              const name = p.product_name || p.name || "Fashion Style";
              const price = Number(p.sale_price || p.base_price || p.price) || 0;
              const img = p.thumbnail || p.product_image || p.img1 || p.img || "https://images.unsplash.com/photo-1739429942851-9083ee185d3d?w=300&h=400&fit=crop";

              return (
                <div key={pId} className="flex gap-4 border-b border-[#f5f5f5] pb-4">
                  <img src={img} alt={name} className="w-20 object-cover flex-shrink-0 bg-[#faf7f4] rounded-sm" style={{ height: "6.5rem" }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1a1a1a] leading-snug mb-1 line-clamp-1">{name}</p>
                    <p className="text-sm font-semibold mb-3">₹{price.toLocaleString("en-IN")}</p>
                    <button onClick={onClose} className="text-[10px] tracking-[0.15em] uppercase bg-[#1a1a1a] text-white px-4 py-1.5 hover:bg-[#d4145a] transition-colors">
                      View Details
                    </button>
                  </div>
                  <button onClick={() => removeFromWishlist(pId)} className="text-[#6e6e6e] hover:text-[#d4145a] self-start mt-1">
                    <X size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

interface AccountDropdownProps {
  onClose: () => void;
  onSignIn: () => void;
}

export function AccountDropdown({ onClose, onSignIn }: AccountDropdownProps) {
  const { user, isAuthenticated, role, roleId, logout } = useAuth();
  const navigate = useNavigate();

  const isLogged = isAuthenticated || Boolean(user?.id);

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate("/");
  };

  const handleDashboard = () => {
    onClose();
    const dashPath = getDashboardPathForRole(roleId || user?.role_id, role || user?.role);
    navigate(dashPath);
  };

  const userName = user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Account";
  const userEmail = user?.email || "";
  const userAvatar = user?.avatar || user?.profile_image;

  return (
    <div className="fixed inset-0 z-50 flex justify-end items-start pt-[72px]" onClick={onClose}>
      <div className="relative mr-6 md:mr-12 w-64 bg-white border border-[#ececec] shadow-xl py-2" onClick={e => e.stopPropagation()}>
        {isLogged ? (
          <div className="px-5 py-4 border-b border-[#ececec]">
            <div className="flex items-center gap-3 mb-3">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-[#ececec]" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#fce8ef] text-[#d4145a] flex items-center justify-center font-bold text-xs flex-shrink-0">
                  <User size={16} />
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-[#1a1a1a] truncate">{userName}</p>
                <p className="text-[10px] text-[#9e9e9e] truncate">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={handleDashboard}
              className="w-full bg-[#1a1a1a] text-white py-2.5 text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors mb-2 flex items-center justify-center gap-2"
            >
              <LayoutGrid size={13} /> Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="w-full border border-[#ececec] text-[#6e6e6e] py-2 text-[10px] tracking-[0.15em] uppercase hover:border-red-500 hover:text-red-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        ) : (
          <div className="px-5 py-4 border-b border-[#ececec]">
            <p className="text-xs text-[#6e6e6e] tracking-wide mb-3">Welcome back</p>
            <button onClick={onSignIn} className="w-full bg-[#1a1a1a] text-white py-2.5 text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors mb-2">
              Sign In
            </button>
            <button onClick={onSignIn} className="w-full border border-[#ececec] text-[#1a1a1a] py-2.5 text-[10px] tracking-[0.15em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
              Create Account
            </button>
          </div>
        )}

        {[
          { label: "My Orders", path: isLogged ? "/customer/orders" : null },
          { label: "My Wishlist", path: isLogged ? "/customer/wishlist" : null },
          { label: "My Addresses", path: isLogged ? "/customer/addresses" : null },
          { label: "Help & Support", path: null },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => {
              onClose();
              if (item.path) {
                navigate(item.path);
              } else if (!isLogged && item.label !== "Help & Support") {
                onSignIn();
              }
            }}
            className="w-full flex items-center justify-between px-5 py-3 text-xs text-[#1a1a1a] hover:text-[#d4145a] hover:bg-[#faf7f4] transition-colors tracking-wide text-left"
          >
            {item.label} <ArrowRight size={12} />
          </button>
        ))}
      </div>
    </div>
  );
}
