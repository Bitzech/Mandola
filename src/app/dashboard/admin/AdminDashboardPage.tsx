import { useState } from "react";
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

interface Props { onLogout: () => void; }

const NAV: { id: AdminSection; label: string; Icon: React.FC<{ size?: number; strokeWidth?: number; className?: string }> }[] = [
  { id: "home",          label: "Dashboard",          Icon: LayoutGrid  },
  { id: "users",         label: "Users",              Icon: Users       },
  { id: "sellers",       label: "Sellers",            Icon: Store       },
  { id: "products",      label: "Products",           Icon: Package     },
  { id: "categories",    label: "Categories",         Icon: Tag         },
  { id: "brands",        label: "Brands",             Icon: Bookmark    },
  { id: "collections",   label: "Collections",        Icon: Layers      },
  { id: "orders",        label: "Orders",             Icon: ShoppingBag },
  { id: "payments",      label: "Payments",           Icon: CreditCard  },
  { id: "wallet",        label: "Admin Wallet",       Icon: Wallet      },
  { id: "settlements",   label: "Settlements",        Icon: Send        },
  { id: "returns",       label: "Returns & Refunds",  Icon: RotateCcw   },
  { id: "reviews",       label: "Reviews",            Icon: Star        },
  { id: "notifications", label: "Notifications",      Icon: Bell        },
  { id: "invoices",      label: "Invoices",           Icon: FileText    },
  { id: "reports",       label: "Reports",            Icon: BarChart2   },
  { id: "settings",      label: "Website Settings",   Icon: Settings    },
  { id: "profile",       label: "Profile",            Icon: User        },
  { id: "change-password",label: "Change Password",  Icon: Lock        },
];

export default function AdminDashboardPage({ onLogout }: Props) {
  const [active, setActive] = useState<AdminSection>("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const unread = ADMIN_NOTIFICATIONS.filter(n => !n.read).length;

  const navigate: AdminNavigateFn = (section) => {
    setActive(section);
    setDrawerOpen(false);
    window.scrollTo(0, 0);
  };

  const renderSection = () => {
    switch (active) {
      case "home":            return <AdminHome         onNavigate={navigate} />;
      case "users":           return <UsersPage />;
      case "sellers":         return <SellersPage       onNavigate={navigate} />;
      case "products":        return <AdminProducts />;
      case "categories":      return <CategoriesPage />;
      case "brands":          return <BrandsPage />;
      case "collections":     return <CollectionsPage />;
      case "orders":          return <AdminOrders />;
      case "payments":        return <AdminPayments />;
      case "wallet":          return <AdminWallet />;
      case "settlements":     return <SellerSettlements />;
      case "returns":         return <ReturnsRefunds />;
      case "reviews":         return <AdminReviews />;
      case "notifications":   return <AdminNotifications />;
      case "invoices":        return <AdminInvoices />;
      case "reports":         return <ReportsPage />;
      case "settings":        return <WebsiteSettings />;
      case "profile":         return <AdminProfile />;
      case "change-password": return <AdminChangePassword />;
      default:                return <AdminHome         onNavigate={navigate} />;
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Admin identity */}
      <div className="px-5 py-5 border-b border-[#ececec]">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <img src={MOCK_ADMIN.avatar} alt={MOCK_ADMIN.name} className="w-10 h-10 rounded-full object-cover" />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#d4145a] rounded-full flex items-center justify-center">
              <Shield size={8} strokeWidth={2} className="text-white" />
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-[#1a1a1a] truncate">{MOCK_ADMIN.name}</p>
            <p className="text-[9px] tracking-[0.1em] uppercase text-[#d4145a] font-semibold">{MOCK_ADMIN.role}</p>
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 font-medium transition-all duration-200 group relative ${
                isActive
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
              {item.id === "sellers" && (
                <span className="min-w-[18px] h-[18px] bg-amber-400 text-white text-[8px] rounded-full flex items-center justify-center font-bold px-1">2</span>
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
    <div className="min-h-screen bg-[#faf7f4] font-['Jost',sans-serif]">
      <div className="max-w-[1440px] mx-auto flex">

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-60 xl:w-68 flex-shrink-0 bg-white border-r border-[#ececec] sticky top-0 h-screen overflow-y-auto" style={{ width: "clamp(220px, 17vw, 272px)" }}>
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
        <main className="flex-1 min-w-0">

          {/* Top Navbar */}
          <div className="sticky top-0 z-30 bg-white border-b border-[#ececec] px-4 lg:px-6 py-3 flex items-center gap-3">
            <button className="lg:hidden text-[#6e6e6e] hover:text-[#d4145a] transition-colors flex-shrink-0" onClick={() => setDrawerOpen(true)}>
              <Menu size={20} strokeWidth={1.5} />
            </button>

            {/* Global Search */}
            <div className="relative flex-1 max-w-sm hidden sm:block">
              <Search size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e9e9e]" />
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search users, orders, products…"
                className="w-full border border-[#ececec] pl-8 pr-4 py-2 text-xs text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
              />
            </div>

            <div className="flex items-center gap-1 ml-auto">
              {/* Quick Add */}
              <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#d4145a] text-white text-[9px] tracking-[0.15em] uppercase font-semibold hover:bg-[#b8114d] transition-colors">
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
                <img src={MOCK_ADMIN.avatar} alt={MOCK_ADMIN.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                <div className="text-left hidden md:block">
                  <p className="text-[11px] font-semibold text-[#1a1a1a] leading-tight group-hover:text-[#d4145a] transition-colors">{MOCK_ADMIN.name.split(" ")[0]}</p>
                  <p className="text-[9px] text-[#d4145a] tracking-wide leading-tight font-semibold">{MOCK_ADMIN.role}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="hidden lg:flex items-center justify-between px-6 xl:px-8 py-2.5 bg-[#faf7f4] border-b border-[#ececec]">
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
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Store
            </button>
          </div>

          {/* Section content */}
          <div className="p-4 md:p-6 xl:p-8">
            {renderSection()}
          </div>
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
