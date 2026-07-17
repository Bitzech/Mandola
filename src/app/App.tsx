import { useState, useEffect } from "react";
import type { Page, ProductType } from "./data";
import Header from "./components/Header";
import HomeSections from "./components/HomeSections";
import Footer from "./components/Footer";
import CategoryPage from "./components/CategoryPage";
import ProductDetailPage from "./components/ProductDetailPage";
import AuthPage from "./components/AuthPage";
import { CartPanel, WishlistPanel, AccountDropdown } from "./components/Panels";
import MobileBottomNav from "./components/MobileBottomNav";
import DashboardPage from "./dashboard/DashboardPage";
import SellerDashboardPage from "./dashboard/seller/SellerDashboardPage";
import AdminDashboardPage from "./dashboard/admin/AdminDashboardPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(null);
  const [currentProduct, setCurrentProduct] = useState<ProductType | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showSellerDashboard, setShowSellerDashboard] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  const goToProduct = (p: ProductType) => { setCurrentProduct(p); setCurrentPage(null); window.scrollTo(0, 0); };
  const goBack = () => { setCurrentProduct(null); window.scrollTo(0, 0); };

  const handleLogin = () => {
    setShowAuth(false);
    setShowDashboard(true);
    window.scrollTo(0, 0);
  };

  const handleSellerLogin = () => {
    setShowAuth(false);
    setShowSellerDashboard(true);
    window.scrollTo(0, 0);
  };

  const handleAdminLogin = () => {
    setShowAuth(false);
    setShowAdminDashboard(true);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setShowDashboard(false);
    setShowSellerDashboard(false);
    setShowAdminDashboard(false);
    setCurrentPage(null);
    setCurrentProduct(null);
    window.scrollTo(0, 0);
  };

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
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeAllPanels = () => { setCartOpen(false); setWishOpen(false); setAccountOpen(false); };

  return (
    <div className="min-h-screen bg-white font-['Jost',sans-serif] text-[#1a1a1a] overflow-x-hidden">

      {!showDashboard && !showSellerDashboard && !showAdminDashboard && (
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
          setCurrentPage={p => { setCurrentPage(p); setShowDashboard(false); }}
          setCurrentProduct={() => setCurrentProduct(null)}
          setShowAuth={setShowAuth}
        />
      )}

      {/* Page routing */}
      {showAdminDashboard ? (
        <AdminDashboardPage onLogout={handleLogout} />
      ) : showSellerDashboard ? (
        <SellerDashboardPage onLogout={handleLogout} />
      ) : showDashboard ? (
        <DashboardPage onLogout={handleLogout} />
      ) : showAuth ? (
        <AuthPage onBack={() => { setShowAuth(false); window.scrollTo(0, 0); }} onLogin={handleLogin} onSellerLogin={handleSellerLogin} onAdminLogin={handleAdminLogin} />
      ) : currentProduct ? (
        <ProductDetailPage
          product={currentProduct}
          onBack={goBack}
          onProductClick={goToProduct}
          onAddToBag={() => setCartCount(c => c + 1)}
        />
      ) : currentPage ? (
        <CategoryPage
          page={currentPage}
          onBack={() => setCurrentPage(null)}
          onNavigate={(category, sub) => setCurrentPage({ category, sub })}
        />
      ) : (
        <HomeSections
          setCurrentPage={setCurrentPage}
          email={email}
          setEmail={setEmail}
          subscribed={subscribed}
          setSubscribed={setSubscribed}
        />
      )}

      {!showDashboard && !showSellerDashboard && !showAdminDashboard && <Footer />}

      {!showDashboard && !showSellerDashboard && !showAdminDashboard && <MobileBottomNav
        currentPage={currentPage}
        currentProduct={currentProduct}
        showAuth={showAuth}
        cartOpen={cartOpen}
        wishOpen={wishOpen}
        mobileOpen={mobileOpen}
        cartCount={cartCount}
        wishCount={wishCount}
        onHome={() => { setCurrentPage(null); setCurrentProduct(null); setShowAuth(false); setShowDashboard(false); closeAllPanels(); window.scrollTo(0, 0); }}
        onCategories={() => { setMobileOpen(true); setCartOpen(false); setWishOpen(false); }}
        onWishlist={() => { setWishOpen(o => !o); setCartOpen(false); setMobileOpen(false); }}
        onCart={() => { setCartOpen(o => !o); setWishOpen(false); setMobileOpen(false); }}
        onProfile={() => { setShowAuth(true); setCurrentPage(null); setCurrentProduct(null); setShowDashboard(false); closeAllPanels(); window.scrollTo(0, 0); }}
      />}

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
          onSignIn={() => { setShowAuth(true); setAccountOpen(false); window.scrollTo(0, 0); }}
        />
      )}
    </div>
  );
}
