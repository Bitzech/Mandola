import { useState, useEffect } from "react";
import { useLocation, useNavigate as useNextNavigate, useParams } from "react-router";
import {
  LayoutGrid, User, ShoppingBag, Truck, Heart, MapPin,
  Bell, Star, FileText, Lock, LogOut, ChevronRight, Menu, X
} from "lucide-react";
import type { DashboardSection, NavigateFn } from "./dashboardData";
import DashboardHome from "./DashboardHome";
import MyProfile from "./MyProfile";
import MyOrders from "./MyOrders";
import OrderDetails from "./OrderDetails";
import OrderTracking from "./OrderTracking";
import WishlistPage from "./WishlistPage";
import SavedAddresses from "./SavedAddresses";
import NotificationsPage from "./NotificationsPage";
import MyReviews from "./MyReviews";
import InvoicesPage from "./InvoicesPage";
import ChangePasswordPage from "./ChangePasswordPage";
import logoImg from "@/imports/image.png";
import { useAuth } from "../context/AuthContext";
import { notificationService } from "../services/notification.service";

interface Props { onLogout: () => void; }

const NAV = [
  { id: "home"            as DashboardSection, label: "Dashboard",        Icon: LayoutGrid, path: "/customer" },
  { id: "profile"         as DashboardSection, label: "My Profile",       Icon: User,       path: "/customer/profile" },
  { id: "orders"          as DashboardSection, label: "My Orders",        Icon: ShoppingBag,  path: "/customer/orders" },
  { id: "tracking"        as DashboardSection, label: "Order Tracking",   Icon: Truck,        path: "/customer/order-tracking" },
  { id: "wishlist"        as DashboardSection, label: "My Wishlist",      Icon: Heart,      path: "/customer/wishlist" },
  { id: "addresses"       as DashboardSection, label: "Saved Addresses",  Icon: MapPin,     path: "/customer/addresses" },
  { id: "notifications"   as DashboardSection, label: "Notifications",    Icon: Bell,       path: "/customer/notifications" },
  { id: "reviews"         as DashboardSection, label: "My Reviews",       Icon: Star,       path: "/customer/reviews" },
  { id: "invoices"        as DashboardSection, label: "Invoices",         Icon: FileText,   path: "/customer/invoices" },
  { id: "change-password" as DashboardSection, label: "Change Password", Icon: Lock,       path: "/customer/change-password" },
];

const SECTION_LABELS: Record<DashboardSection, string> = {
  home: "Dashboard Overview",
  profile: "My Profile",
  orders: "My Orders",
  "order-details": "Order Details",
  tracking: "Order Tracking",
  wishlist: "My Wishlist",
  addresses: "Saved Addresses",
  notifications: "Notifications",
  reviews: "My Reviews",
  invoices: "Download Invoices",
  "change-password": "Change Password",
};

export default function DashboardPage({ onLogout }: Props) {
  const { user } = useAuth();
  const location = useLocation();
  const routerNavigate = useNextNavigate();
  const { orderId: paramOrderId } = useParams<{ orderId?: string }>();

  const getSectionFromPath = (): { section: DashboardSection; orderId: string | null } => {
    const p = location.pathname;
    if (p.includes("/customer/order-details/")) {
      const parts = p.split("/");
      return { section: "order-details", orderId: parts[parts.length - 1] || null };
    }
    if (p.includes("/customer/order-tracking/")) {
      const parts = p.split("/");
      return { section: "tracking", orderId: parts[parts.length - 1] || null };
    }
    if (p === "/customer/profile") return { section: "profile", orderId: null };
    if (p === "/customer/orders") return { section: "orders", orderId: null };
    if (p === "/customer/order-tracking") return { section: "tracking", orderId: paramOrderId || null };
    if (p === "/customer/wishlist") return { section: "wishlist", orderId: null };
    if (p === "/customer/addresses") return { section: "addresses", orderId: null };
    if (p === "/customer/notifications") return { section: "notifications", orderId: null };
    if (p === "/customer/reviews") return { section: "reviews", orderId: null };
    if (p === "/customer/invoices") return { section: "invoices", orderId: null };
    if (p === "/customer/change-password") return { section: "change-password", orderId: null };
    return { section: "home", orderId: null };
  };

  const initial = getSectionFromPath();
  const [active, setActive] = useState<DashboardSection>(initial.section);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(initial.orderId);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const s = getSectionFromPath();
    setActive(s.section);
    if (s.orderId) setSelectedOrderId(s.orderId);
  }, [location.pathname, paramOrderId]);

  // Fetch unread notification count
  useEffect(() => {
    let isMounted = true;
    const fetchUnread = async () => {
      try {
        const res = await notificationService.getNotificationSummary();
        const data = res.data || res;
        if (isMounted && typeof data.unread_count === "number") {
          setUnreadCount(data.unread_count);
        }
      } catch {
        // Fallback quiet ignore
      }
    };
    fetchUnread();
    return () => { isMounted = false; };
  }, [active]);

  const navigate: NavigateFn = (section, orderId) => {
    setActive(section);
    if (orderId) setSelectedOrderId(orderId);
    setDrawerOpen(false);

    switch (section) {
      case "home":
        routerNavigate("/customer");
        break;
      case "profile":
        routerNavigate("/customer/profile");
        break;
      case "orders":
        routerNavigate("/customer/orders");
        break;
      case "order-details":
        routerNavigate(`/customer/order-details/${orderId || ""}`);
        break;
      case "tracking":
        routerNavigate(orderId ? `/customer/order-tracking/${orderId}` : "/customer/order-tracking");
        break;
      case "wishlist":
        routerNavigate("/customer/wishlist");
        break;
      case "addresses":
        routerNavigate("/customer/addresses");
        break;
      case "notifications":
        routerNavigate("/customer/notifications");
        break;
      case "reviews":
        routerNavigate("/customer/reviews");
        break;
      case "invoices":
        routerNavigate("/customer/invoices");
        break;
      case "change-password":
        routerNavigate("/customer/change-password");
        break;
    }
  };

  const renderSection = () => {
    switch (active) {
      case "home":            return <DashboardHome   onNavigate={navigate} />;
      case "profile":         return <MyProfile />;
      case "orders":          return <MyOrders        onNavigate={navigate} />;
      case "order-details":   return <OrderDetails    orderId={selectedOrderId} onNavigate={navigate} />;
      case "tracking":        return <OrderTracking   orderId={selectedOrderId} onNavigate={navigate} />;
      case "wishlist":        return <WishlistPage />;
      case "addresses":       return <SavedAddresses />;
      case "notifications":   return <NotificationsPage />;
      case "reviews":         return <MyReviews />;
      case "invoices":        return <InvoicesPage    onNavigate={navigate} />;
      case "change-password": return <ChangePasswordPage />;
      default:                return <DashboardHome   onNavigate={navigate} />;
    }
  };

  // User display name & completion calculation
  const userName = user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Customer";
  const userEmail = user?.email || "";
  const userAvatar = user?.avatar || user?.profile_image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop";

  // Calculate live profile completion
  const profileFields = [user?.first_name, user?.last_name, user?.email, user?.phone, user?.dob, user?.gender, user?.avatar || user?.profile_image];
  const filledFields = profileFields.filter(Boolean).length;
  const profileCompletion = Math.min(100, Math.round((filledFields / profileFields.length) * 100)) || 75;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* User avatar */}
      <div className="px-5 py-6 border-b border-[#ececec] flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src={userAvatar} alt={userName} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-[#1a1a1a] truncate">{userName}</p>
            <p className="text-[10px] text-[#9e9e9e] tracking-wide truncate">{userEmail}</p>
          </div>
        </div>
        {/* Profile completion mini */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e]">Profile</span>
            <span className="text-[9px] font-semibold text-[#d4145a]">{profileCompletion}%</span>
          </div>
          <div className="h-1 bg-[#ececec] rounded-full overflow-hidden">
            <div className="h-full bg-[#d4145a] rounded-full" style={{ width: `${profileCompletion}%` }} />
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {NAV.map(item => {
          const isActive = active === item.id || (item.id === "orders" && active === "order-details");
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
                <span className="w-4.5 h-4.5 bg-[#d4145a] text-white text-[8px] rounded-full flex items-center justify-center font-bold min-w-[18px] min-h-[18px]">
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
          className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.08em] uppercase font-medium text-[#6e6e6e] hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-[#faf7f4] font-['Jost',sans-serif] overflow-hidden flex">

      {/* ── Desktop Fixed Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 bg-white border-r border-[#ececec] h-screen sticky top-0 z-20">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Drawer ── */}
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

      {/* ── Right Column: Sticky Header + Scrollable Content ── */}
      <div className="flex-1 h-screen flex flex-col min-w-0 overflow-hidden">
        
        {/* ── Sticky Top Header ── */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#ececec] flex-shrink-0">
          {/* Mobile topbar */}
          <div className="lg:hidden flex items-center gap-3 px-4 py-3">
            <button onClick={() => setDrawerOpen(true)} className="text-[#6e6e6e] hover:text-[#d4145a] transition-colors">
              <Menu size={20} strokeWidth={1.5} />
            </button>
            <img src={logoImg} alt="Mandola" className="h-8 w-auto object-contain" />
            <div className="flex-1" />
            <span className="text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] font-medium">{SECTION_LABELS[active]}</span>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between px-6 xl:px-8 py-3">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e]">
              <button onClick={() => navigate("home")} className="hover:text-[#d4145a] transition-colors">Dashboard</button>
              {active !== "home" && (
                <>
                  <ChevronRight size={10} />
                  <span className="text-[#1a1a1a] font-semibold">{SECTION_LABELS[active]}</span>
                </>
              )}
            </div>

            {/* Right-side action buttons */}
            <div className="flex items-center gap-1">
              {/* Back to store */}
              <button
                onClick={() => routerNavigate("/")}
                className="flex items-center gap-1.5 px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] hover:text-[#d4145a] border border-transparent hover:border-[#ececec] transition-all"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back to Store
              </button>

              {/* Divider */}
              <span className="w-px h-4 bg-[#ececec] mx-1" />

              {/* Notifications bell */}
              <button
                onClick={() => navigate("notifications")}
                className={`relative p-2 transition-colors ${active === "notifications" ? "text-[#d4145a]" : "text-[#6e6e6e] hover:text-[#d4145a]"}`}
                title="Notifications"
              >
                <Bell size={17} strokeWidth={1.5} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#d4145a] text-white text-[8px] rounded-full flex items-center justify-center font-bold leading-none">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Change password */}
              <button
                onClick={() => navigate("change-password")}
                className={`p-2 transition-colors ${active === "change-password" ? "text-[#d4145a]" : "text-[#6e6e6e] hover:text-[#d4145a]"}`}
                title="Change Password"
              >
                <Lock size={17} strokeWidth={1.5} />
              </button>

              {/* Logout */}
              <button
                onClick={() => setShowLogoutModal(true)}
                className="p-2 text-[#6e6e6e] hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                <LogOut size={17} strokeWidth={1.5} />
              </button>

              {/* Divider */}
              <span className="w-px h-4 bg-[#ececec] mx-1" />

              {/* User avatar + name */}
              <button
                onClick={() => navigate("profile")}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1 hover:bg-[#faf7f4] transition-colors group"
              >
                <img src={userAvatar} alt={userName} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                <div className="text-left">
                  <p className="text-[11px] font-semibold text-[#1a1a1a] leading-tight group-hover:text-[#d4145a] transition-colors">{userName.split(" ")[0]}</p>
                  <p className="text-[9px] text-[#9e9e9e] tracking-wide leading-tight">My Account</p>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* ── Scrollable Main Section ── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8">
          {renderSection()}
        </main>
      </div>

      {/* ── Logout Confirmation Modal ── */}
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
              <p className="text-sm text-[#6e6e6e] font-light mb-7">
                Are you sure you want to sign out of your Mandola account?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 border border-[#ececec] text-[#1a1a1a] py-3 text-[10px] tracking-[0.2em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setShowLogoutModal(false); onLogout(); }}
                  className="flex-1 bg-[#1a1a1a] text-white py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-red-600 transition-colors"
                >
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
