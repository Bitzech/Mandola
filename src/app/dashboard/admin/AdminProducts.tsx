import { useState } from "react";
import { Search, CheckCircle, XCircle, Eye, Trash2 } from "lucide-react";
import { ADMIN_PRODUCTS, fmt } from "./adminData";

const statusStyle = (s: string) => {
  if (s === "Approved") return "bg-green-50 text-green-700";
  if (s === "Pending")  return "bg-amber-50 text-amber-700";
  if (s === "Rejected") return "bg-red-50 text-red-600";
  return "";
};

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(ADMIN_PRODUCTS.map(p => [p.id, p.status]))
  );

  const update = (id: string, val: string) => setStatuses(prev => ({ ...prev, [id]: val }));

  const filtered = ADMIN_PRODUCTS.filter(p => {
    if (filter !== "All" && statuses[p.id] !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Products</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e9e9e]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" className="border border-[#ececec] pl-8 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#d4145a] bg-white w-52" />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-[#ececec] px-3 py-2.5 text-xs text-[#6e6e6e] focus:outline-none focus:border-[#d4145a] bg-white">
            {["All", "Approved", "Pending", "Rejected"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white border border-[#ececec] overflow-x-auto">
        <table className="w-full min-w-[750px]">
          <thead>
            <tr className="border-b border-[#ececec]">
              {["Product", "SKU", "Seller", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const status = statuses[p.id];
              return (
                <tr key={p.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.img} alt={p.name} className="w-9 h-11 object-cover bg-[#faf7f4] flex-shrink-0" />
                      <span className="text-xs font-medium text-[#1a1a1a]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-[#9e9e9e] font-mono tracking-wide">{p.sku}</td>
                  <td className="px-4 py-3 text-xs text-[#6e6e6e]">{p.seller}</td>
                  <td className="px-4 py-3 text-xs text-[#6e6e6e]">{p.category}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-[#1a1a1a]">{fmt(p.price)}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-[#1a1a1a]">{p.stock}</td>
                  <td className="px-4 py-3"><span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${statusStyle(status)}`}>{status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-[#6e6e6e] hover:text-blue-600 transition-colors" title="View"><Eye size={13} strokeWidth={1.5} /></button>
                      {status === "Pending" && <>
                        <button onClick={() => update(p.id, "Approved")} className="p-1.5 text-[#6e6e6e] hover:text-green-600 transition-colors" title="Approve"><CheckCircle size={13} strokeWidth={1.5} /></button>
                        <button onClick={() => update(p.id, "Rejected")} className="p-1.5 text-[#6e6e6e] hover:text-red-500 transition-colors" title="Reject"><XCircle size={13} strokeWidth={1.5} /></button>
                      </>}
                      <button className="p-1.5 text-[#6e6e6e] hover:text-red-500 transition-colors" title="Delete"><Trash2 size={13} strokeWidth={1.5} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-12 text-center text-xs text-[#9e9e9e]">No products found.</div>}
      </div>
    </div>
  );
}
