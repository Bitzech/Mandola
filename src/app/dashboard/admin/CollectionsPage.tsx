import { useState } from "react";
import { Edit2, Trash2, Plus, Layers } from "lucide-react";
import { COLLECTIONS } from "./adminData";

export default function CollectionsPage() {
  const [cols, setCols] = useState(COLLECTIONS.map(c => ({ ...c })));
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");

  const add = () => {
    if (!newName.trim()) return;
    setCols(prev => [...prev, { id: `COL${Date.now()}`, name: newName, products: 0, status: "Active", banner: "" }]);
    setNewName(""); setShowAdd(false);
  };
  const del = (id: string) => setCols(prev => prev.filter(c => c.id !== id));
  const toggleStatus = (id: string) => setCols(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" } : c));

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Homepage</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Collections</h2>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2.5 bg-[#d4145a] text-white text-[9px] tracking-[0.15em] uppercase font-semibold hover:bg-[#b8114d] transition-colors">
          <Plus size={11} strokeWidth={2.5} /> Add Collection
        </button>
      </div>

      {showAdd && (
        <div className="bg-white border border-[#ececec] p-5 mb-5 flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Collection Name</label>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Monsoon Essentials" className="w-full border border-[#ececec] px-4 py-3 text-sm focus:outline-none focus:border-[#d4145a] bg-white" autoFocus />
          </div>
          <button onClick={add} className="px-5 py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors">Save</button>
          <button onClick={() => setShowAdd(false)} className="px-4 py-3 border border-[#ececec] text-[#6e6e6e] text-[10px] tracking-[0.2em] uppercase hover:border-[#1a1a1a] transition-colors">Cancel</button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cols.map(c => (
          <div key={c.id} className="bg-white border border-[#ececec] overflow-hidden">
            <div className="relative h-28 bg-[#faf7f4]">
              {c.banner
                ? <img src={c.banner} alt={c.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><Layers size={32} strokeWidth={1} className="text-[#ececec]" /></div>
              }
              <div className="absolute top-2 right-2 flex gap-1">
                <button className="w-6 h-6 bg-white border border-[#ececec] flex items-center justify-center hover:border-[#d4145a] transition-colors"><Edit2 size={10} strokeWidth={1.5} /></button>
                <button onClick={() => del(c.id)} className="w-6 h-6 bg-white border border-[#ececec] flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-colors"><Trash2 size={10} strokeWidth={1.5} /></button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-[#1a1a1a]">{c.name}</p>
              <p className="text-[10px] text-[#6e6e6e] mt-0.5">{c.products} products</p>
              <div className="flex items-center justify-between mt-3">
                <button onClick={() => toggleStatus(c.id)} className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${c.status === "Active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {c.status}
                </button>
                <button className="text-[9px] tracking-[0.1em] uppercase text-[#d4145a] hover:underline font-semibold">Assign Products</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
