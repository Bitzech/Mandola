import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/MobileBottomNav";
import { CartPanel, WishlistPanel, AccountDropdown } from "../components/Panels";
import type { Page } from "../data";
import { useAuth } from "../context/AuthContext";
import { getDashboardPathForRole } from "../routes/GuestRoute";

export interface PublicOutletCtx {
  cartCount: number;
  addToBag: () => void;
  wishCount: number;
}

const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export default function PublicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, role, roleId } = useAuth();

  const isLogged = isAuthenticated || Boolean(user?.id);

  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [megaMenu, setMegaMenu] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(2);
  const [wishCount] = useState(3);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const closeAllPanels = () => {
    setCartOpen(false);
    setWishOpen(false);
    setAccountOpen(false);
  };

  const handleSetCurrentPage = (page: Page) => {
    if (page) {
      navigate(`/category/${toSlug(page.category)}/${toSlug(page.sub)}`);
    } else {
      navigate("/");
    }
  };

  const isOnDashboard = location.pathname.startsWith("/customer") ||
    location.pathname.startsWith("/seller") ||
    location.pathname.startsWith("/admin");

  const showAuth = location.pathname === "/login" ||
    location.pathname === "/seller/login" ||
    location.pathname === "/admin/login" ||
    location.pathname === "/register";

  const ctx: PublicOutletCtx = {
    cartCount,
    addToBag: () => setCartCount(c => c + 1),
    wishCount,
  };

  return (
    <div className="min-h-screen bg-white font-['Jost',sans-serif] text-[#1a1a1a] overflow-x-hidden">
      {!isOnDashboard && (
        <Header
          announcementVisible={announcementVisible}
          onCloseAnnouncement={() => setAnnouncementVisible(false)}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          megaMenu={megaMenu}
          setMegaMenu={setMegaMenu}
          scrolled={scrolled}
          wishCount={wishCount}
          cartCount={cartCount}
          wishOpen={wishOpen}
          setWishOpen={setWishOpen as (fn: (v: boolean) => boolean) => void}
          cartOpen={cartOpen}
          setCartOpen={setCartOpen as (fn: (v: boolean) => boolean) => void}
          accountOpen={accountOpen}
          setAccountOpen={setAccountOpen as (fn: (v: boolean) => boolean) => void}
          showAuth={showAuth}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          setCurrentPage={handleSetCurrentPage}
          setCurrentProduct={() => navigate("/")}
          setShowAuth={(v) => v && navigate(isLogged ? getDashboardPathForRole(roleId || user?.role_id, role || user?.role) : "/login")}
        />
      )}

      <Outlet context={ctx} />

      {!isOnDashboard && <Footer />}

      {!isOnDashboard && (
        <MobileBottomNav
          currentPage={location.pathname.startsWith("/category") ? {} : null}
          currentProduct={location.pathname.startsWith("/product") ? {} : null}
          showAuth={showAuth}
          cartOpen={cartOpen}
          wishOpen={wishOpen}
          mobileOpen={mobileOpen}
          cartCount={cartCount}
          wishCount={wishCount}
          onHome={() => { navigate("/"); closeAllPanels(); }}
          onCategories={() => { setMobileOpen(true); setCartOpen(false); setWishOpen(false); }}
          onWishlist={() => { setWishOpen(o => !o); setCartOpen(false); setMobileOpen(false); }}
          onCart={() => { setCartOpen(o => !o); setWishOpen(false); setMobileOpen(false); }}
          onProfile={() => {
            if (isLogged) {
              const dashPath = getDashboardPathForRole(roleId || user?.role_id, role || user?.role);
              navigate(dashPath);
            } else {
              navigate("/login");
            }
            closeAllPanels();
          }}
        />
      )}

      {cartOpen && (
        <CartPanel
          cartCount={cartCount}
          setCartCount={setCartCount}
          onClose={() => setCartOpen(false)}
        />
      )}

      {wishOpen && (
        <WishlistPanel
          wishCount={wishCount}
          onClose={() => setWishOpen(false)}
        />
      )}

      {accountOpen && (
        <AccountDropdown
          onClose={() => setAccountOpen(false)}
          onSignIn={() => {
            if (isLogged) {
              const dashPath = getDashboardPathForRole(roleId || user?.role_id, role || user?.role);
              navigate(dashPath);
            } else {
              navigate("/login");
            }
            setAccountOpen(false);
          }}
        />
      )}
    </div>
  );
}
