import { useState } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import { BRANDS } from "./adminData";

export default function BrandsPage() {
  const [brands, setBrands] = useState(BRANDS.map(b => ({ ...b })));
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");

  const add = () => {
    if (!newName.trim()) return;
    setBrands(prev => [...prev, { id: `B${Date.now()}`, name: newName, products: 0, status: "Active" }]);
    setNewName(""); setShowAdd(false);
  };
  const del = (id: string) => setBrands(prev => prev.filter(b => b.id !== id));
  const toggleStatus = (id: string) => setBrands(prev => prev.map(b => b.id === id ? { ...b, status: b.status === "Active" ? "Inactive" : "Active" } : b));

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Brands</h2>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2.5 bg-[#d4145a] text-white text-[9px] tracking-[0.15em] uppercase font-semibold hover:bg-[#b8114d] transition-colors">
          <Plus size={11} strokeWidth={2.5} /> Add Brand
        </button>
      </div>

      {showAdd && (
        <div className="bg-white border border-[#ececec] p-5 mb-5 flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Brand Name</label>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Zari Creations" className="w-full border border-[#ececec] px-4 py-3 text-sm focus:outline-none focus:border-[#d4145a] bg-white" autoFocus />
          </div>
          <button onClick={add} className="px-5 py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors">Save</button>
          <button onClick={() => setShowAdd(false)} className="px-4 py-3 border border-[#ececec] text-[#6e6e6e] text-[10px] tracking-[0.2em] uppercase hover:border-[#1a1a1a] transition-colors">Cancel</button>
        </div>
      )}

      <div className="bg-white border border-[#ececec] overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr className="border-b border-[#ececec]">
              {["Brand Name", "Products", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {brands.map(b => (
              <tr key={b.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                <td className="px-5 py-3 text-sm font-medium text-[#1a1a1a]">{b.name}</td>
                <td className="px-5 py-3 text-xs font-semibold text-[#1a1a1a]">{b.products}</td>
                <td className="px-5 py-3">
                  <button onClick={() => toggleStatus(b.id)} className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${b.status === "Active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {b.status}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-[#6e6e6e] hover:text-[#d4145a] transition-colors"><Edit2 size={13} strokeWidth={1.5} /></button>
                    <button onClick={() => del(b.id)} className="p-1.5 text-[#6e6e6e] hover:text-red-500 transition-colors"><Trash2 size={13} strokeWidth={1.5} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
