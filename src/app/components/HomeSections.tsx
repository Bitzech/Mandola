import { useState } from "react";
import { ArrowRight, Star, Instagram, Quote, Award, RefreshCw, Shield, Truck } from "lucide-react";
import { CATEGORIES, PRODUCTS, BEST_SELLERS, REVIEWS, LOOKBOOK, u } from "../data";
import type { Page } from "../data";
import ProductCard from "./ProductCard";

interface Props {
  setCurrentPage: (p: Page) => void;
  email: string;
  setEmail: (v: string) => void;
  subscribed: boolean;
  setSubscribed: (v: boolean) => void;
}

const WHY_ITEMS = [
  { icon: <Award size={28} strokeWidth={1.5} />, title: "Premium Quality", desc: "Ethically sourced fabrics, masterfully crafted for lasting wear." },
  { icon: <RefreshCw size={28} strokeWidth={1.5} />, title: "Easy Returns", desc: "15-day hassle-free returns, no questions asked." },
  { icon: <Shield size={28} strokeWidth={1.5} />, title: "Secure Payments", desc: "100% safe checkout with encrypted payment gateways." },
  { icon: <Truck size={28} strokeWidth={1.5} />, title: "Fast Delivery", desc: "Pan-India delivery in 3–5 business days." },
];

export default function HomeSections({ setCurrentPage, email, setEmail, subscribed, setSubscribed }: Props) {
  const [reviewIdx] = useState(0);
  void reviewIdx;

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-[#faf7f4] overflow-hidden">
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 min-h-[90vh] md:min-h-[85vh]">
          {/* Left */}
          <div className="relative flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 md:py-0 order-2 md:order-1 overflow-hidden" style={{ background: "linear-gradient(145deg,#ffffff 0%,#fdf4f7 35%,#fce8ef 65%,#faf0f5 100%)" }}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-25" style={{ background: "radial-gradient(circle,#d4145a 0%,transparent 65%)" }} />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full opacity-15" style={{ background: "radial-gradient(circle,#c8175c 0%,transparent 65%)" }} />
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(45deg,#d4145a 0,#d4145a 1px,transparent 0,transparent 12px)", backgroundSize: "18px 18px" }} />
              <svg className="absolute top-8 right-8 opacity-10" width="160" height="160" viewBox="0 0 160 160" fill="none">
                <circle cx="80" cy="80" r="70" stroke="#d4145a" strokeWidth="1" strokeDasharray="4 6" />
                <circle cx="80" cy="80" r="50" stroke="#d4145a" strokeWidth="0.5" />
              </svg>
              <svg className="absolute bottom-12 left-6 opacity-[0.08]" width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="42" stroke="#d4145a" strokeWidth="1" strokeDasharray="3 5" />
              </svg>
            </div>

            <span className="relative z-10 text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold mb-6">
              New Collection 2026
            </span>
            <h1 className="relative z-10 font-['Playfair_Display'] text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-[#1a1a1a] mb-6">
              Style That Speaks<br />
              <em className="italic text-[#d4145a]">Before You Do.</em>
            </h1>
            <p className="relative z-10 text-[#6e6e6e] text-base md:text-lg leading-relaxed mb-10 max-w-md font-light">
              Discover premium casual wear, partywear, ethnic and Indo-western collections crafted for every woman.
            </p>
            <div className="relative z-10 flex flex-wrap gap-4">
              <button
                onClick={() => { setCurrentPage({ category: "Casual Wear", sub: "Casual Wear" }); window.scrollTo(0, 0); }}
                className="px-8 py-3.5 bg-[#1a1a1a] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#d4145a] transition-colors duration-300"
              >
                Shop Collection
              </button>
              <button
                onClick={() => { setCurrentPage({ category: "New Arrivals", sub: "Just In" }); window.scrollTo(0, 0); }}
                className="flex items-center gap-2 px-8 py-3.5 border border-[#1a1a1a] text-[#1a1a1a] text-xs tracking-[0.2em] uppercase font-medium hover:border-[#d4145a] hover:text-[#d4145a] transition-colors duration-300"
              >
                Explore New Arrivals <ArrowRight size={14} />
              </button>
            </div>

            <div className="relative z-10 flex gap-10 mt-14 pt-10 border-t border-[#ececec]/60">
              {[["2,400+", "Styles"], ["4.9★", "Rating"], ["50K+", "Happy Women"]].map(([val, label]) => (
                <div key={label}>
                  <div className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a1a]">{val}</div>
                  <div className="text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: model image */}
          <div className="relative order-1 md:order-2 h-64 md:h-auto">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-8 right-8 w-64 h-64 rounded-full bg-[#fce8ef] opacity-40 blur-3xl" />
              <div className="absolute bottom-12 left-4 w-40 h-40 rounded-full bg-[#f5e6ec] opacity-30 blur-2xl" />
            </div>
            <img
              src={u("1664076458686-3449062080ac", 800, 1000)}
              alt="Elegant woman in premium fashion"
              className="w-full h-full object-cover object-top relative z-10"
            />
            <div className="absolute bottom-8 left-6 z-20 bg-white/95 backdrop-blur-sm px-5 py-3 shadow-lg hidden md:block">
              <div className="text-[9px] tracking-[0.2em] uppercase text-[#d4145a] font-semibold mb-0.5">Just Dropped</div>
              <div className="text-sm font-semibold text-[#1a1a1a]">Pearl Organza Gown</div>
              <div className="text-sm text-[#6e6e6e] font-light">₹4,199</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trending Categories ── */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="text-left mb-12 md:mb-16">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Discover</span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-3">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map(cat => (
            <div
              key={cat.name}
              className="group relative overflow-hidden cursor-pointer aspect-[3/4]"
              onClick={() => { setCurrentPage({ category: cat.name, sub: cat.name }); window.scrollTo(0, 0); }}
            >
              <img
                src={cat.img}
                alt={cat.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#1a1a1a] opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                  <div className="text-[9px] tracking-[0.25em] uppercase text-white/80 mb-1">{cat.tagline}</div>
                  <h3 className="font-['Playfair_Display'] text-xl md:text-2xl font-bold text-white leading-snug">{cat.name}</h3>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setCurrentPage({ category: cat.name, sub: cat.name }); window.scrollTo(0, 0); }}
                  className="mt-4 self-start flex items-center gap-2 bg-white text-[#1a1a1a] text-[10px] tracking-[0.2em] uppercase font-semibold px-5 py-2.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 delay-100 hover:bg-[#d4145a] hover:text-white"
                >
                  Shop Now <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="py-16 md:py-24 bg-[#faf7f4]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Fresh In</span>
              <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-2">New Arrivals</h2>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-medium text-[#1a1a1a] hover:text-[#d4145a] transition-colors group">
              View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7">
            {PRODUCTS.map(p => <ProductCard key={p.id} p={p} />)}
          </div>

          <div className="text-center mt-10 md:hidden">
            <a href="#" className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-medium border border-[#1a1a1a] px-8 py-3 hover:bg-[#1a1a1a] hover:text-white transition-colors">
              View All <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Best Sellers ── */}
      <section className="py-20 md:py-28 max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Customer Favourites</span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-3">Best Sellers</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {BEST_SELLERS.map(item => (
            <div key={item.name} className="group cursor-pointer">
              <div className="relative overflow-hidden aspect-[3/4] bg-[#faf7f4]">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 text-[9px] tracking-[0.15em] uppercase bg-white text-[#d4145a] font-semibold px-2.5 py-1">
                  {item.tag}
                </span>
              </div>
              <div className="pt-4">
                <h3 className="text-sm font-medium text-[#1a1a1a] tracking-wide leading-snug">{item.name}</h3>
                <p className="text-sm text-[#6e6e6e] mt-1">₹{item.price.toLocaleString("en-IN")}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Mandola ── */}
      <section className="bg-[#faf7f4] py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1a1a1a]">Why Mandola?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {WHY_ITEMS.map(item => (
              <div key={item.title} className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 border border-[#ececec] flex items-center justify-center text-[#d4145a] mb-5 group-hover:bg-[#d4145a] group-hover:text-white group-hover:border-[#d4145a] transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold tracking-wide text-[#1a1a1a] mb-2">{item.title}</h3>
                <p className="text-xs text-[#6e6e6e] leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Full-width editorial banner ── */}
      <section className="relative h-[55vh] md:h-[65vh] overflow-hidden flex items-center">
        <img
          src={u("1756483510882-55bc1249642d", 1440, 900)}
          alt="Mandola editorial collection"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-[#1a1a1a]/45" />
        <div className="relative z-10 text-white max-w-[1440px] mx-auto px-8 md:px-20 lg:px-28">
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#d4145a] font-semibold mb-4 block">The Mandola Edit</span>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 max-w-2xl">
            Crafted for the<br /><em className="italic">Modern Indian Woman</em>
          </h2>
          <button className="px-10 py-4 border border-white text-white text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-[#1a1a1a] transition-all duration-300">
            Explore the Collection
          </button>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">What She Says</span>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-3">Customer Love</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-[#faf7f4] p-8 relative group hover:shadow-md transition-shadow">
                <Quote size={32} className="text-[#d4145a] opacity-30 mb-4" strokeWidth={1} />
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} size={13} className="fill-[#d4145a] text-[#d4145a]" />
                  ))}
                </div>
                <p className="text-[#1a1a1a] text-sm leading-relaxed mb-7 font-light italic">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-semibold text-[#1a1a1a]">{r.name}</div>
                    <div className="text-[10px] text-[#6e6e6e] tracking-wide">{r.city} · {r.product}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instagram Lookbook ── */}
      <section className="py-16 md:py-24 bg-[#faf7f4]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">@mandola.in</span>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#1a1a1a] mt-3">The Lookbook</h2>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
            {LOOKBOOK.map((img, i) => (
              <div key={i} className="relative group aspect-square overflow-hidden cursor-pointer col-span-2">
                <img src={img} alt={`Lookbook ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-[#1a1a1a]/0 group-hover:bg-[#1a1a1a]/50 transition-all duration-400 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Instagram size={22} className="text-white" strokeWidth={1.5} />
                  <span className="text-white text-[9px] tracking-[0.2em] uppercase font-medium">Shop the Look</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-20 md:py-28 bg-[#1a1a1a] text-white">
        <div className="max-w-xl mx-auto px-6 text-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Community</span>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold mt-4 mb-4">
            Join the Mandola Community
          </h2>
          <p className="text-[#9e9e9e] text-sm md:text-base font-light leading-relaxed mb-10">
            Get exclusive offers, latest launches and fashion inspiration — delivered straight to your inbox.
          </p>

          {subscribed ? (
            <div className="text-[#d4145a] text-sm tracking-wide font-medium py-4">
              ✓ Welcome to the Mandola family! Check your inbox.
            </div>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder-[#6e6e6e] px-5 py-3.5 text-sm focus:outline-none focus:border-[#d4145a] transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#d4145a] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#b0103e] transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[#6e6e6e] text-xs mt-5 font-light">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </>
  );
}
