import { useState } from "react";
import { Search, Edit2, Trash2, Eye } from "lucide-react";
import { SELLER_PRODUCTS, fmt, type SellerNavigateFn } from "./sellerData";

const statusStyle = (s: string) => {
  if (s === "Active")       return "bg-green-50 text-green-700";
  if (s === "Inactive")     return "bg-gray-100 text-gray-500";
  if (s === "Out of Stock") return "bg-red-50 text-red-600";
  return "";
};

export default function ProductList({ onNavigate }: { onNavigate: SellerNavigateFn }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const categories = ["All", ...Array.from(new Set(SELLER_PRODUCTS.map(p => p.category)))];
  const statuses   = ["All", "Active", "Inactive", "Out of Stock"];

  const filtered = SELLER_PRODUCTS.filter(p => {
    if (category !== "All" && p.category !== category) return false;
    if (status   !== "All" && p.status   !== status)   return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Products</h2>
        </div>
        <button
          onClick={() => onNavigate("add-product")}
          className="flex-shrink-0 px-5 py-2.5 bg-[#d4145a] text-white text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#b8114d] transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e9e9e]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or SKU…"
            className="w-full border border-[#ececec] pl-9 pr-4 py-2.5 text-xs text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
          />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="border border-[#ececec] px-3 py-2.5 text-xs text-[#6e6e6e] focus:outline-none focus:border-[#d4145a] bg-white">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className="border border-[#ececec] px-3 py-2.5 text-xs text-[#6e6e6e] focus:outline-none focus:border-[#d4145a] bg-white">
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#ececec] overflow-x-auto">
        <table className="w-full min-w-[750px]">
          <thead>
            <tr className="border-b border-[#ececec]">
              {["Product", "SKU", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.img} alt={p.name} className="w-10 h-12 object-cover bg-[#faf7f4] flex-shrink-0" />
                    <span className="text-xs font-medium text-[#1a1a1a]">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[10px] text-[#9e9e9e] tracking-wide font-mono">{p.sku}</td>
                <td className="px-4 py-3 text-xs text-[#6e6e6e]">{p.category}</td>
                <td className="px-4 py-3">
                  <p className="text-xs font-semibold text-[#1a1a1a]">{fmt(p.salePrice ?? p.price)}</p>
                  {p.salePrice && <p className="text-[10px] text-[#9e9e9e] line-through">{fmt(p.price)}</p>}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold ${p.stock === 0 ? "text-red-600" : p.stock <= 10 ? "text-amber-600" : "text-green-700"}`}>
                    {p.stock === 0 ? "Out" : p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${statusStyle(p.status)}`}>{p.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onNavigate("add-product", p.id)} className="p-1.5 text-[#6e6e6e] hover:text-[#d4145a] transition-colors" title="Edit">
                      <Edit2 size={13} strokeWidth={1.5} />
                    </button>
                    <button className="p-1.5 text-[#6e6e6e] hover:text-blue-600 transition-colors" title="View">
                      <Eye size={13} strokeWidth={1.5} />
                    </button>
                    <button className="p-1.5 text-[#6e6e6e] hover:text-red-500 transition-colors" title="Delete">
                      <Trash2 size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs text-[#9e9e9e] tracking-wide">No products found.</div>
        )}
      </div>
    </div>
  );
}
