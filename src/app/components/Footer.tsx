import { Instagram, Phone } from "lucide-react";
import logoImg from "@/imports/image.png";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Top: logo + tagline */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 pb-12 border-b border-white/10 gap-6">
          <div>
            <img src={logoImg} alt="Mandola" className="h-12 w-auto object-contain brightness-0 invert" />
            <p className="text-[#6e6e6e] text-xs mt-3 tracking-wide font-light">A Woman Fashion</p>
          </div>
          <div className="flex gap-5">
            {[Instagram, Phone].map((Icon, i) => (
              <button key={i} className="w-9 h-9 border border-white/20 flex items-center justify-center text-[#9e9e9e] hover:border-[#d4145a] hover:text-[#d4145a] transition-all">
                <Icon size={15} strokeWidth={1.5} />
              </button>
            ))}
            {/* Pinterest */}
            <button className="w-9 h-9 border border-white/20 flex items-center justify-center text-[#9e9e9e] hover:border-[#d4145a] hover:text-[#d4145a] transition-all">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.16 1.22-5.16s-.31-.62-.31-1.55c0-1.46.84-2.55 1.89-2.55.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.87 3.48-.25 1.04.52 1.88 1.53 1.88 1.84 0 3.08-2.36 3.08-5.15 0-2.13-1.44-3.62-3.49-3.62-2.38 0-3.77 1.78-3.77 3.63 0 .72.28 1.49.62 1.91.07.08.08.15.06.23l-.23.94c-.04.15-.13.18-.29.11-1.08-.5-1.76-2.08-1.76-3.35 0-2.72 1.98-5.22 5.71-5.22 3 0 5.33 2.14 5.33 5 0 2.97-1.87 5.37-4.47 5.37-.87 0-1.69-.45-1.97-1l-.54 2.01c-.19.74-.72 1.67-1.07 2.23.81.25 1.66.38 2.55.38 5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg>
            </button>
            {/* YouTube */}
            <button className="w-9 h-9 border border-white/20 flex items-center justify-center text-[#9e9e9e] hover:border-[#d4145a] hover:text-[#d4145a] transition-all">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg>
            </button>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
          {[
            { title: "Shop",          links: ["Casual Wear", "Party Wear", "Ethnic Wear", "Indo-Western", "New Arrivals", "Sale"] },
            { title: "Customer Care", links: ["Track Order", "Shipping", "Returns", "FAQs", "Contact Us"] },
            { title: "Company",       links: ["About Mandola", "Privacy Policy", "Terms & Conditions", "Careers"] },
            { title: "Contact",       links: ["+91 98765 43210", "hello@mandola.in", "Mon–Sat 10am–7pm", "Mumbai, India"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-white mb-5">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-xs text-[#6e6e6e] hover:text-[#d4145a] transition-colors font-light tracking-wide">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Footer newsletter */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-white mb-5">Newsletter</h4>
            <p className="text-xs text-[#6e6e6e] mb-4 leading-relaxed font-light">Get early access to launches and exclusive deals.</p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="bg-white/5 border border-white/15 text-white placeholder-[#4e4e4e] px-4 py-2.5 text-xs focus:outline-none focus:border-[#d4145a] transition-colors"
              />
              <button className="bg-[#d4145a] text-white text-[10px] tracking-[0.2em] uppercase py-2.5 hover:bg-[#b0103e] transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-[#4e4e4e] tracking-wide">© 2026 Mandola. All Rights Reserved.</p>
          <p className="text-[10px] text-[#4e4e4e] tracking-wide italic">Designed with elegance.</p>
        </div>
      </div>
    </footer>
  );
}
