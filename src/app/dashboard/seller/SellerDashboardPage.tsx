import { useState, useEffect } from "react";
import { useLocation, useNavigate as useReactNavigate } from "react-router";
import {
  LayoutGrid, User, Package, PlusSquare, Archive, ShoppingBag,
  Truck, RotateCcw, CreditCard, Download, Bell, Settings,
  Lock, LogOut, X, ChevronRight, Menu, Star, Store
} from "lucide-react";
import {
  SELLER_SECTION_LABELS,
  type SellerSection, type SellerNavigateFn
} from "./sellerData";
import SellerHome from "./SellerHome";
import SellerProfile from "./SellerProfile";
import ProductList from "./ProductList";
import AddProduct from "./AddProduct";
import InventoryPage from "./InventoryPage";
import SellerOrders from "./SellerOrders";
import ShipmentsPage from "./ShipmentsPage";
import ReturnsPage from "./ReturnsPage";
import PaymentsPage from "./PaymentsPage";
import SellerInvoicesPage from "./SellerInvoicesPage";
import SellerNotificationsPage from "./SellerNotificationsPage";
import SellerSettingsPage from "./SellerSettingsPage";
import SellerChangePassword from "./SellerChangePassword";
import { useAuth } from "../../context/AuthContext";
import { sellerService } from "../../services/seller.service";
import { notificationService } from "../../services/notification.service";
import { SellerProfile as SellerProfileType } from "../../types/seller.types";

interface Props { onLogout: () => void; }

const NAV: { id: SellerSection; label: string; Icon: React.FC<{ size?: number; strokeWidth?: number; className?: string }>; path: string }[] = [
  { id: "home",            label: "Dashboard",          Icon: LayoutGrid,  path: "/seller" },
  { id: "profile",         label: "My Profile",         Icon: User,        path: "/seller/profile" },
  { id: "products",        label: "Products",           Icon: Package,     path: "/seller/products" },
  { id: "add-product",     label: "Add Product",        Icon: PlusSquare,  path: "/seller/products/add" },
  { id: "inventory",       label: "Inventory",          Icon: Archive,     path: "/seller/inventory" },
  { id: "orders",          label: "Orders",             Icon: ShoppingBag, path: "/seller/orders" },
  { id: "shipments",       label: "Shipments",          Icon: Truck,       path: "/seller/shipments" },
  { id: "returns",         label: "Returns",            Icon: RotateCcw,   path: "/seller/returns" },
  { id: "payments",        label: "Payments",           Icon: CreditCard,  path: "/seller/settlements" },
  { id: "invoices",        label: "Invoices",           Icon: Download,    path: "/seller/invoices" },
  { id: "notifications",   label: "Notifications",      Icon: Bell,        path: "/seller/notifications" },
  { id: "settings",        label: "Settings",           Icon: Settings,    path: "/seller/settings" },
  { id: "change-password", label: "Change Password",    Icon: Lock,        path: "/seller/change-password" },
];

export default function SellerDashboardPage({ onLogout }: Props) {
  const { user } = useAuth();
  const location = useLocation();
  const reactNavigate = useReactNavigate();

  const getSectionFromPath = (): { section: SellerSection; selectedId: string | null } => {
    const p = location.pathname;
    if (p.includes("/seller/products/add") || p.includes("/seller/products/") && p.includes("/edit")) {
      const parts = p.split("/");
      const editIdx = parts.indexOf("edit");
      const id = editIdx > 0 ? parts[editIdx - 1] : null;
      return { section: "add-product", selectedId: id };
    }
    if (p.includes("/seller/products/")) {
      const parts = p.split("/");
      return { section: "products", selectedId: parts[parts.length - 1] || null };
    }
    if (p.includes("/seller/orders/")) {
      const parts = p.split("/");
      return { section: "orders", selectedId: parts[parts.length - 1] || null };
    }
    if (p === "/seller/profile") return { section: "profile", selectedId: null };
    if (p === "/seller/products") return { section: "products", selectedId: null };
    if (p === "/seller/inventory") return { section: "inventory", selectedId: null };
    if (p === "/seller/orders") return { section: "orders", selectedId: null };
    if (p === "/seller/shipments") return { section: "shipments", selectedId: null };
    if (p === "/seller/returns") return { section: "returns", selectedId: null };
    if (p === "/seller/settlements" || p === "/seller/payments") return { section: "payments", selectedId: null };
    if (p === "/seller/invoices") return { section: "invoices", selectedId: null };
    if (p === "/seller/notifications") return { section: "notifications", selectedId: null };
    if (p === "/seller/settings") return { section: "settings", selectedId: null };
    if (p === "/seller/change-password") return { section: "change-password", selectedId: null };
    return { section: "home", selectedId: null };
  };

  const initial = getSectionFromPath();
  const [active, setActive] = useState<SellerSection>(initial.section);
  const [selectedId, setSelectedId] = useState<string | null>(initial.selectedId);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [sellerProfile, setSellerProfile] = useState<SellerProfileType | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const s = getSectionFromPath();
    setActive(s.section);
    if (s.selectedId !== undefined) setSelectedId(s.selectedId);
  }, [location.pathname]);

  // Sync profile details
  useEffect(() => {
    let isMounted = true;
    sellerService.getProfile()
      .then(res => {
        const data = res.data || res;
        if (isMounted && data) {
          setSellerProfile(data as any);
        }
      })
      .catch(() => {});

    notificationService.getNotificationSummary()
      .then(res => {
        const data = res.data || res;
        if (isMounted && data && typeof data.unread_count === "number") {
          setUnreadCount(data.unread_count);
        }
      })
      .catch(() => {});

    return () => { isMounted = false; };
  }, [active]);

  const navigate: SellerNavigateFn = (section, id) => {
    setActive(section);
    if (id) setSelectedId(id);
    setDrawerOpen(false);

    const targetNav = NAV.find(n => n.id === section);
    if (section === "add-product" && id) {
      reactNavigate(`/seller/products/${id}/edit`);
    } else if (targetNav) {
      reactNavigate(targetNav.path);
    } else {
      reactNavigate("/seller");
    }
  };

  const storeName = sellerProfile?.store_name || sellerProfile?.business_name || user?.name || "Seller Store";
  const sellerAvatar = sellerProfile?.logo || user?.avatar || user?.profile_image || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80";
  const isVerified = sellerProfile?.status === "approved";

  // Calculate live profile completion
  const profileFields = [
    sellerProfile?.business_name,
    sellerProfile?.store_name,
    sellerProfile?.email || user?.email,
    sellerProfile?.phone || user?.phone,
    sellerProfile?.gstin,
    sellerProfile?.address,
    sellerProfile?.logo
  ];
  const filledFields = profileFields.filter(Boolean).length;
  const profileCompletion = Math.min(100, Math.max(50, Math.round((filledFields / profileFields.length) * 100)));

  const renderSection = () => {
    switch (active) {
      case "home":            return <SellerHome           onNavigate={navigate} />;
      case "profile":         return <SellerProfile />;
      case "products":        return <ProductList          onNavigate={navigate} />;
      case "add-product":     return <AddProduct           onNavigate={navigate} editId={selectedId} />;
      case "inventory":       return <InventoryPage />;
      case "orders":          return <SellerOrders         onNavigate={navigate} selectedOrderId={selectedId} />;
      case "shipments":       return <ShipmentsPage />;
      case "returns":         return <ReturnsPage />;
      case "payments":        return <PaymentsPage />;
      case "invoices":        return <SellerInvoicesPage />;
      case "notifications":   return <SellerNotificationsPage />;
      case "settings":        return <SellerSettingsPage />;
      case "change-password": return <SellerChangePassword />;
      default:                return <SellerHome           onNavigate={navigate} />;
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Store info */}
      <div className="px-5 py-5 border-b border-[#ececec] flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src={sellerAvatar} alt={storeName} className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-[#ececec]" />
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-[#1a1a1a] truncate">{storeName}</p>
              {isVerified && (
                <span className="w-3.5 h-3.5 bg-[#d4145a] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={9} className="text-amber-400 fill-amber-400" />
              <span className="text-[10px] text-[#6e6e6e] tracking-wide">Seller Account</span>
            </div>
          </div>
        </div>
        {/* Profile completion bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e]">Profile</span>
            <span className="text-[9px] font-semibold text-[#d4145a]">{profileCompletion}%</span>
          </div>
          <div className="h-1 bg-[#ececec] rounded-full overflow-hidden">
            <div className="h-full bg-[#d4145a] rounded-full transition-all duration-300" style={{ width: `${profileCompletion}%` }} />
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {NAV.map(item => {
          const isActive = active === item.id || (item.id === "products" && active === "add-product");
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-[#fce8ef] text-[#d4145a]"
                  : "text-[#6e6e6e] hover:bg-[#faf7f4] hover:text-[#1a1a1a]"
              }`}
            >
              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#d4145a]" />}
              <item.Icon size={16} strokeWidth={1.5} className="flex-shrink-0" />
              <span className="flex-1 text-left text-[11px] tracking-[0.08em] uppercase">{item.label}</span>
              {item.id === "notifications" && unreadCount > 0 && (
                <span className="min-w-[18px] min-h-[18px] bg-[#d4145a] text-white text-[8px] rounded-full flex items-center justify-center font-bold px-1">
                  {unreadCount}
                </span>
              )}
              <ChevronRight size={12} className={`flex-shrink-0 transition-transform ${isActive ? "text-[#d4145a]" : "text-[#c0c0c0] group-hover:translate-x-0.5"}`} />
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#ececec] flex-shrink-0">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.08em] uppercase font-medium text-[#6e6e6e] hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-[#faf7f4] font-['Jost',sans-serif] overflow-hidden flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 bg-white border-r border-[#ececec] h-screen sticky top-0 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <aside className="relative w-72 bg-white h-full flex flex-col shadow-2xl overflow-y-auto">
            <button onClick={() => setDrawerOpen(false)} className="absolute top-4 right-4 text-[#6e6e6e] hover:text-[#1a1a1a] z-10">
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 h-screen flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#ececec] flex-shrink-0">
          {/* Mobile topbar */}
          <div className="lg:hidden flex items-center gap-3 px-4 py-3">
            <button onClick={() => setDrawerOpen(true)} className="text-[#6e6e6e] hover:text-[#d4145a] transition-colors">
              <Menu size={20} strokeWidth={1.5} />
            </button>
            <Store size={18} className="text-[#d4145a]" strokeWidth={1.5} />
            <span className="text-[11px] tracking-[0.15em] uppercase text-[#1a1a1a] font-semibold flex-1">Seller Panel</span>
            <span className="text-[10px] tracking-[0.1em] uppercase text-[#6e6e6e]">{SELLER_SECTION_LABELS[active]}</span>
          </div>

          {/* Desktop Breadcrumb + Actions */}
          <div className="hidden lg:flex items-center justify-between px-6 xl:px-8 py-3">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e]">
              <Store size={11} className="text-[#d4145a]" strokeWidth={1.5} />
              <span className="text-[#d4145a] font-semibold">Seller Panel</span>
              <ChevronRight size={10} />
              <button onClick={() => navigate("home")} className="hover:text-[#d4145a] transition-colors">Dashboard</button>
              {active !== "home" && (
                <>
                  <ChevronRight size={10} />
                  <span className="text-[#1a1a1a] font-semibold">{SELLER_SECTION_LABELS[active]}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => reactNavigate("/")}
                className="flex items-center gap-1.5 px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] hover:text-[#d4145a] border border-transparent hover:border-[#ececec] transition-all"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back to Store
              </button>

              <span className="w-px h-4 bg-[#ececec] mx-1" />

              <button
                onClick={() => navigate("notifications")}
                className={`relative p-2 transition-colors ${active === "notifications" ? "text-[#d4145a]" : "text-[#6e6e6e] hover:text-[#d4145a]"}`}
                title="Notifications"
              >
                <Bell size={17} strokeWidth={1.5} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#d4145a] text-white text-[8px] rounded-full flex items-center justify-center font-bold leading-none">{unreadCount}</span>
                )}
              </button>
              <button
                onClick={() => navigate("settings")}
                className={`p-2 transition-colors ${active === "settings" ? "text-[#d4145a]" : "text-[#6e6e6e] hover:text-[#d4145a]"}`}
                title="Settings"
              >
                <Settings size={17} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="p-2 text-[#6e6e6e] hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                <LogOut size={17} strokeWidth={1.5} />
              </button>

              <span className="w-px h-4 bg-[#ececec] mx-1" />

              <button
                onClick={() => navigate("profile")}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1 hover:bg-[#faf7f4] transition-colors group"
              >
                <img src={sellerAvatar} alt={storeName} className="w-7 h-7 rounded-full object-cover flex-shrink-0 border border-[#ececec]" />
                <div className="text-left">
                  <p className="text-[11px] font-semibold text-[#1a1a1a] leading-tight group-hover:text-[#d4145a] transition-colors truncate max-w-[120px]">{storeName}</p>
                  <p className="text-[9px] text-[#9e9e9e] tracking-wide leading-tight">Seller Account</p>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8">
          {renderSection()}
        </main>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white w-full max-w-sm p-8 relative shadow-2xl">
            <button onClick={() => setShowLogoutModal(false)} className="absolute top-4 right-4 text-[#6e6e6e] hover:text-[#1a1a1a]">
              <X size={16} />
            </button>
            <div className="text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut size={24} strokeWidth={1.5} className="text-red-500" />
              </div>
              <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a] mb-2">Sign Out?</h3>
              <p className="text-sm text-[#6e6e6e] font-light mb-7">Are you sure you want to sign out of your Seller account?</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLogoutModal(false)} className="flex-1 border border-[#ececec] text-[#1a1a1a] py-3 text-[10px] tracking-[0.2em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
                  Cancel
                </button>
                <button onClick={() => { setShowLogoutModal(false); onLogout(); }} className="flex-1 bg-[#1a1a1a] text-white py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-red-600 transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
