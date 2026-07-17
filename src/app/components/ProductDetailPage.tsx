import { useState } from "react";
import { Heart, Star, ChevronDown, Truck, RefreshCw, Shield } from "lucide-react";
import { ALL_PRODUCTS } from "../data";
import type { ProductType } from "../data";
import logoImg from "@/imports/image.png";

interface Props {
  product: ProductType;
  onBack: () => void;
  onProductClick: (p: ProductType) => void;
  onAddToBag: () => void;
}

export default function ProductDetailPage({ product, onBack, onProductClick, onAddToBag }: Props) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>("description");
  const [added, setAdded] = useState(false);

  const images = [product.img1, product.img2, product.img1.replace("500,650", "600,750"), product.img2.replace("500,650", "600,750")];
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const related = ALL_PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

  const handleAddToBag = () => {
    if (!selectedSize) return;
    onAddToBag();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const details = [
    { title: "Description", content: `The ${product.name} is crafted from premium quality fabric, designed for the modern Indian woman who values both style and comfort. Each piece is carefully constructed with attention to detail, ensuring a flattering silhouette and lasting wear.` },
    { title: "Size & Fit", content: "Model is 5'7\" wearing size S. We recommend ordering your true size. Refer to our size chart for exact measurements. Fabric has a slight stretch for a comfortable fit." },
    { title: "Material & Care", content: "100% Premium Fabric (as labeled). Dry clean recommended. Do not bleach. Iron on low heat. Store in a cool, dry place." },
    { title: "Delivery & Returns", content: "Free delivery on orders above ₹999. Standard delivery in 3–5 business days. Express delivery available. 15-day hassle-free returns for unworn, unwashed items with tags intact." },
  ];

  // suppress unused import warning
  void logoImg;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="px-6 md:px-12 py-4 border-b border-[#ececec] max-w-[1440px] mx-auto">
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">
          <button onClick={onBack} className="hover:text-[#d4145a] transition-colors">Home</button>
          <span>/</span>
          <button onClick={onBack} className="hover:text-[#d4145a] transition-colors">Collections</button>
          <span>/</span>
          <span className="text-[#1a1a1a] font-semibold">{product.name}</span>
        </nav>
      </div>

      {/* Main product area */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 lg:gap-24">

          {/* Left: Image gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 h-20 md:w-20 md:h-24 overflow-hidden border-2 transition-colors ${activeImg === i ? "border-[#1a1a1a]" : "border-transparent"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 relative bg-[#faf7f4] aspect-[3/4] overflow-hidden">
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover transition-opacity duration-300" />
              {product.tag && (
                <span className="absolute top-4 left-4 text-[9px] font-semibold tracking-[0.15em] uppercase bg-white text-[#1a1a1a] px-3 py-1.5">{product.tag}</span>
              )}
              <span className="absolute top-4 right-4 text-[9px] font-semibold bg-[#d4145a] text-white px-2.5 py-1.5">-{discount}%</span>
            </div>
          </div>

          {/* Right: Product info */}
          <div className="flex flex-col">
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1a1a1a] leading-tight mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} className="fill-[#d4145a] text-[#d4145a]" />)}
              </div>
              <span className="text-xs text-[#6e6e6e] tracking-wide">4.9 (128 reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#ececec]">
              <span className="font-['Playfair_Display'] text-3xl font-bold text-[#1a1a1a]">₹{product.price.toLocaleString("en-IN")}</span>
              <span className="text-base text-[#6e6e6e] line-through">₹{product.mrp.toLocaleString("en-IN")}</span>
              <span className="text-xs font-semibold text-[#d4145a] bg-[#fce8ef] px-2 py-0.5">{discount}% OFF</span>
            </div>

            {/* Color */}
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1a1a1a] mb-3">
                Colour: <span className="font-normal text-[#6e6e6e]">{selectedColor}</span>
              </p>
              <div className="flex gap-2.5">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c ? "border-[#1a1a1a] scale-110" : "border-[#ececec] hover:border-[#6e6e6e]"}`}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1a1a1a]">
                  Size: <span className="font-normal text-[#6e6e6e]">{selectedSize || "Select a size"}</span>
                </p>
                <button className="text-[10px] tracking-wide text-[#d4145a] underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-10 text-xs font-medium border transition-all ${selectedSize === s ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!selectedSize && <p className="text-[10px] text-[#d4145a] mt-2 tracking-wide">Please select a size to continue</p>}
            </div>

            {/* Qty + CTA */}
            <div className="flex gap-3 mb-4">
              <div className="flex items-center border border-[#ececec]">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-12 text-[#6e6e6e] hover:text-[#d4145a] transition-colors text-lg">−</button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-10 h-12 text-[#6e6e6e] hover:text-[#d4145a] transition-colors text-lg">+</button>
              </div>
              <button
                onClick={handleAddToBag}
                className={`flex-1 py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 ${added ? "bg-[#d4145a] text-white" : selectedSize ? "bg-[#1a1a1a] text-white hover:bg-[#d4145a]" : "bg-[#ececec] text-[#9e9e9e] cursor-not-allowed"}`}
              >
                {added ? "✓ Added to Bag!" : "Add to Bag"}
              </button>
              <button
                onClick={() => setWished(w => !w)}
                className={`w-12 h-12 border flex items-center justify-center transition-all ${wished ? "border-[#d4145a] text-[#d4145a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a]"}`}
              >
                <Heart size={18} strokeWidth={1.5} className={wished ? "fill-[#d4145a]" : ""} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 py-5 border-t border-[#ececec] mb-6">
              {[
                { icon: <Truck size={16} strokeWidth={1.5} />, text: "Free Delivery above ₹999" },
                { icon: <RefreshCw size={16} strokeWidth={1.5} />, text: "15-Day Easy Returns" },
                { icon: <Shield size={16} strokeWidth={1.5} />, text: "Secure Checkout" },
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1.5">
                  <span className="text-[#d4145a]">{b.icon}</span>
                  <span className="text-[9px] text-[#6e6e6e] tracking-wide leading-tight">{b.text}</span>
                </div>
              ))}
            </div>

            {/* Accordion details */}
            <div className="border-t border-[#ececec]">
              {details.map(d => (
                <div key={d.title} className="border-b border-[#ececec]">
                  <button
                    onClick={() => setOpenSection(openSection === d.title ? null : d.title)}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1a1a1a]">{d.title}</span>
                    <ChevronDown size={14} className={`text-[#6e6e6e] transition-transform ${openSection === d.title ? "rotate-180" : ""}`} />
                  </button>
                  {openSection === d.title && (
                    <p className="text-xs text-[#6e6e6e] leading-relaxed pb-4 font-light">{d.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        <div className="mt-20 md:mt-28">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">You May Also Like</span>
              <h2 className="font-['Playfair_Display'] text-2xl md:text-4xl font-bold text-[#1a1a1a] mt-2">Complete the Look</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-7">
            {related.map(p => {
              const d = Math.round(((p.mrp - p.price) / p.mrp) * 100);
              return (
                <div key={p.id} className="group cursor-pointer" onClick={() => { onProductClick(p); window.scrollTo(0, 0); }}>
                  <div className="relative overflow-hidden bg-[#faf7f4] aspect-[3/4]">
                    <img src={p.img1} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute top-3 right-3 text-[9px] font-semibold bg-[#d4145a] text-white px-2 py-1">-{d}%</span>
                    <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] text-white text-center py-2.5 text-[10px] tracking-[0.15em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      View Product
                    </div>
                  </div>
                  <div className="pt-3">
                    <p className="text-sm font-medium text-[#1a1a1a] leading-snug mb-1">{p.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">₹{p.price.toLocaleString("en-IN")}</span>
                      <span className="text-xs text-[#6e6e6e] line-through">₹{p.mrp.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
