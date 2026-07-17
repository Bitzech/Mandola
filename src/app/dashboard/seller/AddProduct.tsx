import { useState } from "react";
import { Upload, X, Plus } from "lucide-react";
import { SELLER_PRODUCTS, type SellerNavigateFn } from "./sellerData";

const InputField = ({ label, placeholder, type = "text", defaultValue }: { label: string; placeholder?: string; type?: string; defaultValue?: string }) => (
  <div>
    <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">{label}</label>
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
    />
  </div>
);

const SIZES   = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
const COLORS  = ["Black", "White", "Red", "Pink", "Blue", "Green", "Yellow", "Orange", "Purple", "Beige", "Grey", "Gold"];
const CATEGORIES = ["Sarees", "Kurtas", "Lehengas", "Anarkalis", "Suits", "Western", "Accessories"];

export default function AddProduct({ onNavigate, editId }: { onNavigate: SellerNavigateFn; editId?: string | null }) {
  const existing = editId ? SELLER_PRODUCTS.find(p => p.id === editId) : null;
  const [selectedSizes,  setSelectedSizes]  = useState<string[]>(["M", "L"]);
  const [selectedColors, setSelectedColors] = useState<string[]>(["Black", "White"]);
  const [saved, setSaved] = useState(false);

  const toggle = (arr: string[], val: string, set: (a: string[]) => void) => {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => { setSaved(false); onNavigate("products"); }, 2000);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => onNavigate("products")} className="text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] hover:text-[#d4145a] transition-colors">← Products</button>
        <span className="text-[#ececec]">/</span>
        <span className="text-[10px] tracking-[0.15em] uppercase text-[#1a1a1a] font-semibold">{existing ? "Edit Product" : "Add Product"}</span>
      </div>

      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">{existing ? "Edit" : "New"}</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">{existing ? existing.name : "Add Product"}</h2>
      </div>

      {saved && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-xs tracking-wide">
          Product saved successfully. Redirecting…
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Basic Details</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2"><InputField label="Product Name" placeholder="e.g. Floral Silk Saree" defaultValue={existing?.name} /></div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Category</label>
              <select defaultValue={existing?.category} className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white">
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Sub Category</label>
              <input placeholder="e.g. Silk Sarees" className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] bg-white" />
            </div>
            <InputField label="Brand"   placeholder="e.g. Priya Fashions" />
            <InputField label="SKU"     placeholder="e.g. SAR-FS-001" defaultValue={existing?.sku} />
          </div>
        </div>

        {/* Description */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Description</h3>
          <textarea
            rows={4}
            placeholder="Describe the product in detail…"
            className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white resize-none"
          />
        </div>

        {/* Images */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Product Images</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {existing && (
              <div className="relative aspect-[3/4] bg-[#faf7f4] border border-[#ececec]">
                <img src={existing.img} alt="" className="w-full h-full object-cover" />
                <button type="button" className="absolute top-1 right-1 w-5 h-5 bg-white border border-[#ececec] flex items-center justify-center hover:bg-red-50">
                  <X size={10} />
                </button>
              </div>
            )}
            <label className="aspect-[3/4] bg-[#faf7f4] border-2 border-dashed border-[#ececec] flex flex-col items-center justify-center cursor-pointer hover:border-[#d4145a] hover:bg-[#fdf5f8] transition-colors">
              <Upload size={18} strokeWidth={1.5} className="text-[#9e9e9e] mb-2" />
              <span className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e]">Add Image</span>
              <input type="file" accept="image/*" multiple className="hidden" />
            </label>
          </div>
          <p className="text-[10px] text-[#9e9e9e] mt-3">Upload up to 8 images. First image will be the cover. Recommended: 1200×1600 px.</p>
        </div>

        {/* Variants */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Sizes & Colours</h3>
          <div className="space-y-5">
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-3">Available Sizes</p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <button
                    key={s} type="button"
                    onClick={() => toggle(selectedSizes, s, setSelectedSizes)}
                    className={`px-3 py-1.5 text-[10px] tracking-[0.08em] uppercase border transition-colors ${
                      selectedSizes.includes(s)
                        ? "border-[#d4145a] bg-[#fce8ef] text-[#d4145a]"
                        : "border-[#ececec] text-[#6e6e6e] hover:border-[#1a1a1a]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-3">Available Colours</p>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button
                    key={c} type="button"
                    onClick={() => toggle(selectedColors, c, setSelectedColors)}
                    className={`px-3 py-1.5 text-[10px] tracking-[0.08em] uppercase border transition-colors ${
                      selectedColors.includes(c)
                        ? "border-[#d4145a] bg-[#fce8ef] text-[#d4145a]"
                        : "border-[#ececec] text-[#6e6e6e] hover:border-[#1a1a1a]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing + Inventory */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-white border border-[#ececec] p-6">
            <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Pricing</h3>
            <div className="space-y-4">
              <InputField label="MRP (₹)" type="number" placeholder="0" defaultValue={existing ? String(existing.price) : ""} />
              <InputField label="Sale Price (₹)" type="number" placeholder="0" defaultValue={existing?.salePrice ? String(existing.salePrice) : ""} />
            </div>
          </div>
          <div className="bg-white border border-[#ececec] p-6">
            <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Inventory</h3>
            <div className="space-y-4">
              <InputField label="Stock Quantity" type="number" placeholder="0" defaultValue={existing ? String(existing.stock) : ""} />
              <InputField label="Low Stock Alert at" type="number" placeholder="10" />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">SEO</h3>
          <div className="space-y-4">
            <InputField label="Meta Title"       placeholder="Page title for search engines" />
            <InputField label="Meta Description" placeholder="Brief description for search results" />
            <InputField label="Tags"             placeholder="saree, silk, festive (comma separated)" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="px-8 py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors">
            {existing ? "Save Changes" : "Publish Product"}
          </button>
          <button type="button" className="px-6 py-3 border border-[#ececec] text-[#6e6e6e] text-[10px] tracking-[0.2em] uppercase hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors">
            Save as Draft
          </button>
          <button type="button" onClick={() => onNavigate("products")} className="px-6 py-3 text-[#6e6e6e] text-[10px] tracking-[0.15em] uppercase hover:text-[#d4145a] transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
