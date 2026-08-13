import { useState, useEffect } from "react";
import {
  LayoutGrid, Users, Store, Package, Tag, Bookmark, Layers,
  ShoppingBag, CreditCard, Wallet, Send, RotateCcw, Star,
  Bell, FileText, BarChart2, Settings, User, Lock, LogOut,
  X, ChevronRight, Menu, Search, Sun, Moon, Plus, Shield
} from "lucide-react";
import {
  MOCK_ADMIN, ADMIN_NOTIFICATIONS, ADMIN_SECTION_LABELS,
  type AdminSection, type AdminNavigateFn
} from "./adminData";
import AdminHome from "./AdminHome";
import UsersPage from "./UsersPage";
import SellersPage from "./SellersPage";
import AdminProducts from "./AdminProducts";
import CategoriesPage from "./CategoriesPage";
import BrandsPage from "./BrandsPage";
import CollectionsPage from "./CollectionsPage";
import AdminOrders from "./AdminOrders";
import AdminPayments from "./AdminPayments";
import AdminWallet from "./AdminWallet";
import SellerSettlements from "./SellerSettlements";
import ReturnsRefunds from "./ReturnsRefunds";
import AdminReviews from "./AdminReviews";
import AdminNotifications from "./AdminNotifications";
import AdminInvoices from "./AdminInvoices";
import ReportsPage from "./ReportsPage";
import WebsiteSettings from "./WebsiteSettings";
import AdminProfile from "./AdminProfile";
import AdminChangePassword from "./AdminChangePassword";

import { useLocation, useNavigate as useNextNavigate } from "react-router";
import { notificationService } from "../../services/notification.service";
import { useAuth } from "../../context/AuthContext";

interface Props { onLogout: () => void; }

const NAV: { id: AdminSection; label: string; Icon: React.FC<{ size?: number; strokeWidth?: number; className?: string }>; path: string }[] = [
  { id: "home", label: "Dashboard", Icon: LayoutGrid, path: "/admin" },
  { id: "users", label: "Users", Icon: Users, path: "/admin/users" },
  { id: "sellers", label: "Sellers", Icon: Store, path: "/admin/sellers" },
  { id: "products", label: "Products", Icon: Package, path: "/admin/products" },
  { id: "categories", label: "Categories", Icon: Tag, path: "/admin/categories" },
  { id: "brands", label: "Brands", Icon: Bookmark, path: "/admin/brands" },
  { id: "collections", label: "Collections", Icon: Layers, path: "/admin/collections" },
  { id: "orders", label: "Orders", Icon: ShoppingBag, path: "/admin/orders" },
  { id: "payments", label: "Payments", Icon: CreditCard, path: "/admin/payments" },
  { id: "wallet", label: "Admin Wallet", Icon: Wallet, path: "/admin/wallet" },
  { id: "settlements", label: "Settlements", Icon: Send, path: "/admin/settlements" },
  { id: "returns", label: "Returns & Refunds", Icon: RotateCcw, path: "/admin/returns" },
  { id: "reviews", label: "Reviews", Icon: Star, path: "/admin/reviews" },
  { id: "notifications", label: "Notifications", Icon: Bell, path: "/admin/notifications" },
  { id: "invoices", label: "Invoices", Icon: FileText, path: "/admin/invoices" },
  { id: "reports", label: "Reports", Icon: BarChart2, path: "/admin/reports" },
  { id: "settings", label: "Website Settings", Icon: Settings, path: "/admin/settings" },
  { id: "profile", label: "Profile", Icon: User, path: "/admin/profile" },
  { id: "change-password", label: "Change Password", Icon: Lock, path: "/admin/change-password" },
];

export default function AdminDashboardPage({ onLogout }: Props) {
  const { user } = useAuth();
  const location = useLocation();
  const routerNavigate = useNextNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let isMounted = true;
    notificationService.getNotificationSummary()
      .then((res: any) => {
        const count = res?.data?.unread_count ?? res?.unread_count ?? 0;
        if (isMounted) setUnread(count);
      })
      .catch(() => {
        // Fallback to default if endpoint unavailable
      });
    return () => { isMounted = false; };
  }, [location.pathname]);

  const getSectionFromPath = (): AdminSection => {
    const p = location.pathname;
    if (p.includes("/admin/users")) return "users";
    if (p.includes("/admin/sellers")) return "sellers";
    if (p.includes("/admin/products")) return "products";
    if (p.includes("/admin/categories") || p.includes("/admin/sub-categories")) return "categories";
    if (p.includes("/admin/brands")) return "brands";
    if (p.includes("/admin/collections")) return "collections";
    if (p.includes("/admin/orders")) return "orders";
    if (p.includes("/admin/payments")) return "payments";
    if (p.includes("/admin/wallet")) return "wallet";
    if (p.includes("/admin/settlements")) return "settlements";
    if (p.includes("/admin/returns") || p.includes("/admin/refunds")) return "returns";
    if (p.includes("/admin/reviews")) return "reviews";
    if (p.includes("/admin/notifications")) return "notifications";
    if (p.includes("/admin/invoices")) return "invoices";
    if (p.includes("/admin/reports")) return "reports";
    if (p.includes("/admin/settings")) return "settings";
    if (p.includes("/admin/profile")) return "profile";
    if (p.includes("/admin/change-password")) return "change-password";
    return "home";
  };

  const active = getSectionFromPath();

  const adminName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "Super Admin" : "Super Admin";
  const adminRole = "Platform Administrator";
  const adminAvatar = user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop";

  const navigate: AdminNavigateFn = (section) => {
    const item = NAV.find((n) => n.id === section);
    if (item) {
      routerNavigate(item.path);
    } else {
      routerNavigate("/admin");
    }
    setDrawerOpen(false);
    window.scrollTo(0, 0);
  };

  const renderSection = () => {
    switch (active) {
      case "home": return <AdminHome onNavigate={navigate} />;
      case "users": return <UsersPage />;
      case "sellers": return <SellersPage onNavigate={navigate} />;
      case "products": return <AdminProducts />;
      case "categories": return <CategoriesPage />;
      case "brands": return <BrandsPage />;
      case "collections": return <CollectionsPage />;
      case "orders": return <AdminOrders />;
      case "payments": return <AdminPayments />;
      case "wallet": return <AdminWallet />;
      case "settlements": return <SellerSettlements />;
      case "returns": return <ReturnsRefunds />;
      case "reviews": return <AdminReviews />;
      case "notifications": return <AdminNotifications />;
      case "invoices": return <AdminInvoices />;
      case "reports": return <ReportsPage />;
      case "settings": return <WebsiteSettings />;
      case "profile": return <AdminProfile />;
      case "change-password": return <AdminChangePassword />;
      default: return <AdminHome onNavigate={navigate} />;
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Admin identity */}
      <div className="px-5 py-5 border-b border-[#ececec]">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <img src={adminAvatar} alt={adminName} className="w-10 h-10 rounded-full object-cover" />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#d4145a] rounded-full flex items-center justify-center">
              <Shield size={8} strokeWidth={2} className="text-white" />
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-[#1a1a1a] truncate">{adminName}</p>
            <p className="text-[9px] tracking-[0.1em] uppercase text-[#d4145a] font-semibold">{adminRole}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {NAV.map(item => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 font-medium transition-all duration-200 group relative ${isActive
                  ? "bg-[#fce8ef] text-[#d4145a]"
                  : "text-[#6e6e6e] hover:bg-[#faf7f4] hover:text-[#1a1a1a]"
                }`}
            >
              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#d4145a]" />}
              <item.Icon size={15} strokeWidth={1.5} className="flex-shrink-0" />
              <span className="flex-1 text-left text-[11px] tracking-[0.07em] uppercase">{item.label}</span>
              {item.id === "notifications" && unread > 0 && (
                <span className="min-w-[18px] h-[18px] bg-[#d4145a] text-white text-[8px] rounded-full flex items-center justify-center font-bold px-1">{unread}</span>
              )}
              <ChevronRight size={11} className={`flex-shrink-0 ${isActive ? "text-[#d4145a]" : "text-[#c0c0c0] group-hover:translate-x-0.5 transition-transform"}`} />
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#ececec]">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.08em] uppercase font-medium text-[#6e6e6e] hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={15} strokeWidth={1.5} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full overflow-hidden flex bg-[#faf7f4] font-['Jost',sans-serif]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 xl:w-68 flex-shrink-0 bg-white border-r border-[#ececec] h-screen sticky top-0" style={{ width: "clamp(220px, 17vw, 272px)" }}>
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

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen min-w-0 overflow-y-auto">

        {/* Top Navbar */}
        <div className="sticky top-0 z-30 bg-white border-b border-[#ececec] px-4 lg:px-6 py-3 flex items-center gap-3 flex-shrink-0">
          <button className="lg:hidden text-[#6e6e6e] hover:text-[#d4145a] transition-colors flex-shrink-0" onClick={() => setDrawerOpen(true)}>
            <Menu size={20} strokeWidth={1.5} />
          </button>

          {/* Global Search */}
          <div className="relative flex-1 max-w-sm hidden sm:block">
            <Search size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e9e9e]" />
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && searchVal.trim()) {
                  navigate("products");
                }
              }}
              placeholder="Search users, orders, products…"
              className="w-full border border-[#ececec] pl-8 pr-4 py-2 text-xs text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
            />
          </div>

          <div className="flex items-center gap-1 ml-auto">
            {/* Quick Add */}
            <button
              onClick={() => navigate("products")}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#d4145a] text-white text-[9px] tracking-[0.15em] uppercase font-semibold hover:bg-[#b8114d] transition-colors"
            >
              <Plus size={11} strokeWidth={2.5} />
              Quick Add
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(d => !d)}
              className="p-2 text-[#6e6e6e] hover:text-[#d4145a] transition-colors"
              title={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
            </button>

            {/* Bell */}
            <button
              onClick={() => navigate("notifications")}
              className={`relative p-2 transition-colors ${active === "notifications" ? "text-[#d4145a]" : "text-[#6e6e6e] hover:text-[#d4145a]"}`}
            >
              <Bell size={17} strokeWidth={1.5} />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#d4145a] text-white text-[8px] rounded-full flex items-center justify-center font-bold leading-none">{unread}</span>
              )}
            </button>

            {/* Profile */}
            <button
              onClick={() => navigate("profile")}
              className="flex items-center gap-2 pl-2 pr-3 py-1 hover:bg-[#faf7f4] transition-colors group ml-1"
            >
              <img src={adminAvatar} alt={adminName} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
              <div className="text-left hidden md:block">
                <p className="text-[11px] font-semibold text-[#1a1a1a] leading-tight group-hover:text-[#d4145a] transition-colors">{adminName.split(" ")[0]}</p>
                <p className="text-[9px] text-[#d4145a] tracking-wide leading-tight font-semibold">Admin</p>
              </div>
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="hidden lg:flex items-center justify-between px-6 xl:px-8 py-2.5 bg-[#faf7f4] border-b border-[#ececec] flex-shrink-0">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e]">
            <Shield size={10} className="text-[#d4145a]" strokeWidth={1.5} />
            <span className="text-[#d4145a] font-semibold">Admin</span>
            <ChevronRight size={9} />
            <button onClick={() => navigate("home")} className="hover:text-[#d4145a] transition-colors">Dashboard</button>
            {active !== "home" && (
              <>
                <ChevronRight size={9} />
                <span className="text-[#1a1a1a] font-semibold">{ADMIN_SECTION_LABELS[active]}</span>
              </>
            )}
          </div>
          <button onClick={onLogout} className="flex items-center gap-1.5 text-[9px] tracking-[0.15em] uppercase text-[#6e6e6e] hover:text-[#d4145a] transition-colors">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to Store
          </button>
        </div>

        {/* Section content */}
        <div className="p-4 md:p-6 xl:p-8 flex-1">
          {renderSection()}
        </div>
      </main>

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
              <p className="text-sm text-[#6e6e6e] font-light mb-7">Sign out of the Admin Panel?</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLogoutModal(false)} className="flex-1 border border-[#ececec] text-[#1a1a1a] py-3 text-[10px] tracking-[0.2em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">Cancel</button>
                <button onClick={() => { setShowLogoutModal(false); onLogout(); }} className="flex-1 bg-[#1a1a1a] text-white py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-red-600 transition-colors">Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
