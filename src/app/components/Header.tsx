import { useRef } from "react";
import {
  Search, Heart, User, ShoppingBag, Menu, X, ChevronDown,
} from "lucide-react";
import image_image_1 from "@/imports/image-1.png";
import logoImg from "@/imports/image.png";
import { NAV_ITEMS } from "../data";
import type { Page } from "../data";

interface Props {
  announcementVisible: boolean;
  onCloseAnnouncement: () => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  megaMenu: string | null;
  setMegaMenu: (v: string | null) => void;
  scrolled: boolean;
  wishCount: number;
  cartCount: number;
  wishOpen: boolean;
  setWishOpen: (fn: (v: boolean) => boolean) => void;
  cartOpen: boolean;
  setCartOpen: (fn: (v: boolean) => boolean) => void;
  accountOpen: boolean;
  setAccountOpen: (fn: (v: boolean) => boolean) => void;
  showAuth: boolean;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  setCurrentPage: (p: Page) => void;
  setCurrentProduct: (p: null) => void;
  setShowAuth: (v: boolean) => void;
}

export default function Header({
  announcementVisible, onCloseAnnouncement,
  searchOpen, setSearchOpen, searchQuery, setSearchQuery,
  megaMenu, setMegaMenu, scrolled,
  wishCount, cartCount,
  wishOpen, setWishOpen, cartOpen, setCartOpen, accountOpen, setAccountOpen,
  showAuth, mobileOpen, setMobileOpen,
  setCurrentPage, setCurrentProduct, setShowAuth,
}: Props) {
  const megaRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Announcement Bar */}
      {announcementVisible && (
        <div className="relative bg-[#1a1a1a] text-white text-center py-2.5 text-xs tracking-[0.2em] uppercase font-medium">
          ✨ Free Shipping on Orders Above ₹999 &nbsp;|&nbsp; New Collection 2026 Now Live
          <button
            onClick={onCloseAnnouncement}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            aria-label="Close announcement"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>
      )}

      {/* Header */}
      <header
        ref={megaRef}
        className={`sticky top-0 z-40 bg-white transition-shadow duration-300 ${scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.06)]" : ""}`}
      >
        {/* Top row */}
        <div className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-[#ececec]">
          {/* Left: search */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setSearchOpen(!searchOpen); setSearchQuery(""); }}
              className={`transition-colors ${searchOpen ? "text-[#d4145a]" : "text-[#6e6e6e] hover:text-[#d4145a]"}`}
            >
              {searchOpen ? <X size={20} strokeWidth={1.5} /> : <Search size={20} strokeWidth={1.5} />}
            </button>
          </div>

          {/* Center: Logo */}
          <a
            href="#"
            onClick={e => { e.preventDefault(); setCurrentPage(null); window.scrollTo(0, 0); }}
            className="absolute left-1/2 -translate-x-1/2"
          >
            <img
              src={image_image_1}
              alt="Mandola — A Woman Fashion"
              className="h-16 w-auto object-contain rounded-sm cursor-pointer"
              style={{ maxWidth: "180px" }}
              onClick={e => {
                e.stopPropagation();
                setCurrentPage(null);
                setCurrentProduct(null);
                setShowAuth(false);
                window.scrollTo(0, 0);
              }}
            />
          </a>

          {/* Right: icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setWishOpen(o => !o); setCartOpen(() => false); setAccountOpen(() => false); }}
              className={`hidden md:flex items-center gap-1 relative transition-colors ${wishOpen ? "text-[#d4145a]" : "text-[#6e6e6e] hover:text-[#d4145a]"}`}
            >
              <Heart size={20} strokeWidth={1.5} />
              {wishCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#d4145a] text-white text-[9px] flex items-center justify-center rounded-full font-semibold">
                  {wishCount}
                </span>
              )}
            </button>
            <button
              onClick={() => { setAccountOpen(o => !o); setCartOpen(() => false); setWishOpen(() => false); }}
              className={`hidden md:flex transition-colors ${accountOpen || showAuth ? "text-[#d4145a]" : "text-[#6e6e6e] hover:text-[#d4145a]"}`}
            >
              <User size={20} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => { setCartOpen(o => !o); setWishOpen(() => false); setAccountOpen(() => false); }}
              className={`relative transition-colors ${cartOpen ? "text-[#d4145a]" : "text-[#6e6e6e] hover:text-[#d4145a]"}`}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#d4145a] text-white text-[9px] flex items-center justify-center rounded-full font-semibold">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="md:hidden text-[#1a1a1a]" onClick={() => setMobileOpen(true)}>
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Search overlay */}
        <div className={`overflow-hidden transition-all duration-300 ${searchOpen ? "max-h-20 border-b border-[#ececec]" : "max-h-0"}`}>
          <div className="flex items-center gap-4 px-6 md:px-12 py-4">
            <Search size={18} strokeWidth={1.5} className="text-[#6e6e6e] flex-shrink-0" />
            <input
              autoFocus={searchOpen}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === "Escape" && setSearchOpen(false)}
              placeholder="Search for dresses, sarees, co-ords…"
              className="flex-1 text-sm text-[#1a1a1a] placeholder-[#b0b0b0] bg-transparent border-none outline-none tracking-wide"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-[#6e6e6e] hover:text-[#d4145a] transition-colors">
                <X size={16} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        {/* Nav row */}
        <nav className="hidden md:flex items-center justify-center gap-8 px-12 py-3 bg-white">
          {NAV_ITEMS.map(item => (
            <div key={item.label} className="relative">
              <button
                className={`flex items-center gap-1 text-xs tracking-[0.12em] uppercase font-medium transition-colors ${megaMenu === item.label ? "text-[#d4145a]" : "text-[#1a1a1a] hover:text-[#d4145a]"} ${item.label === "Sale" ? "text-[#d4145a]" : ""}`}
                onMouseEnter={() => setMegaMenu(item.label)}
                onMouseLeave={() => setMegaMenu(null)}
              >
                {item.label}
                <ChevronDown size={12} className={`transition-transform ${megaMenu === item.label ? "rotate-180" : ""}`} />
              </button>

              {megaMenu === item.label && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-44 bg-white border border-[#ececec] shadow-lg py-3 z-50"
                  onMouseEnter={() => setMegaMenu(item.label)}
                  onMouseLeave={() => setMegaMenu(null)}
                >
                  {item.sub.map(s => (
                    <a
                      key={s}
                      href="#"
                      onClick={e => { e.preventDefault(); setCurrentPage({ category: item.label, sub: s }); setMegaMenu(null); window.scrollTo(0, 0); }}
                      className="block px-5 py-2 text-xs tracking-wide text-[#6e6e6e] hover:text-[#d4145a] hover:bg-[#faf7f4] transition-colors"
                    >
                      {s}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative w-80 max-w-[90vw] bg-white h-full flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-[#ececec]">
              <img src={logoImg} alt="Mandola" className="h-10 w-auto object-contain" />
              <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
            </div>
            <nav className="flex-1 overflow-y-auto p-5 space-y-0">
              {NAV_ITEMS.map(item => (
                <a
                  key={item.label}
                  href="#"
                  className={`block py-3.5 border-b border-[#f0f0f0] text-sm tracking-wide ${item.label === "Sale" ? "text-[#d4145a] font-semibold" : "text-[#1a1a1a]"}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="p-5 space-y-3">
              <button className="w-full flex items-center gap-3 text-sm text-[#6e6e6e]">
                <User size={16} /> Account
              </button>
              <button className="w-full flex items-center gap-3 text-sm text-[#6e6e6e]">
                <Heart size={16} /> Wishlist ({wishCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
