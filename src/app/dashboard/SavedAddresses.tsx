import { useState } from "react";
import { MapPin, Edit2, Trash2, Plus, Check } from "lucide-react";
import { MOCK_ADDRESSES, type Address } from "./dashboardData";

const blankAddress = (): Address => ({
  id: `addr-${Date.now()}`, label: "Home", name: "", phone: "",
  line1: "", line2: "", city: "", state: "", pincode: "", isDefault: false,
});

export default function SavedAddresses() {
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Address>(blankAddress());

  const set = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const startEdit = (addr: Address) => { setEditing(addr.id); setAdding(false); setForm({ ...addr }); };
  const startAdd  = () => { setAdding(true); setEditing(null); setForm(blankAddress()); };

  const save = () => {
    if (adding) {
      setAddresses(prev => [...prev, { ...form, isDefault: prev.length === 0 }]);
    } else {
      setAddresses(prev => prev.map(a => a.id === editing ? { ...form } : a));
    }
    setEditing(null); setAdding(false);
  };

  const deleteAddr = (id: string) => setAddresses(prev => {
    const updated = prev.filter(a => a.id !== id);
    if (updated.length > 0 && !updated.some(a => a.isDefault)) updated[0].isDefault = true;
    return updated;
  });

  const setDefault = (id: string) =>
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));

  const showForm = editing !== null || adding;

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Delivery</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Saved Addresses</h2>
        </div>
        {!showForm && (
          <button onClick={startAdd} className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors">
            <Plus size={13} /> Add New
          </button>
        )}
      </div>

      {/* Address cards */}
      {!showForm && (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {addresses.map(addr => (
            <div key={addr.id} className={`bg-white p-5 border transition-colors ${addr.isDefault ? "border-[#d4145a]" : "border-[#ececec]"}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-[0.15em] uppercase font-semibold bg-[#faf7f4] text-[#1a1a1a] px-2.5 py-1">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="text-[9px] tracking-[0.1em] uppercase font-semibold bg-[#fce8ef] text-[#d4145a] px-2 py-0.5">Default</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(addr)} className="text-[#6e6e6e] hover:text-[#d4145a] transition-colors"><Edit2 size={14} /></button>
                  {!addr.isDefault && (
                    <button onClick={() => deleteAddr(addr.id)} className="text-[#6e6e6e] hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={15} strokeWidth={1.5} className="text-[#d4145a] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{addr.name}</p>
                  <p className="text-xs text-[#6e6e6e] font-light leading-relaxed mt-0.5">
                    {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
                    {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  <p className="text-xs text-[#6e6e6e] mt-1">{addr.phone}</p>
                </div>
              </div>
              {!addr.isDefault && (
                <button onClick={() => setDefault(addr.id)} className="mt-4 flex items-center gap-1.5 text-[10px] tracking-[0.1em] uppercase text-[#d4145a] hover:underline transition-colors">
                  <Check size={11} /> Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit form */}
      {showForm && (
        <div className="bg-white border border-[#ececec] p-6 space-y-4">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] pb-3 border-b border-[#ececec]">
            {adding ? "Add New Address" : "Edit Address"}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Label</label>
              <select value={form.label} onChange={set("label")} className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white">
                <option>Home</option><option>Office</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Full Name</label>
              <input value={form.name} onChange={set("name")} required className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Phone</label>
              <input value={form.phone} onChange={set("phone")} className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Pincode</label>
              <input value={form.pincode} onChange={set("pincode")} className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Address Line 1</label>
            <input value={form.line1} onChange={set("line1")} required className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Address Line 2 (optional)</label>
            <input value={form.line2} onChange={set("line2")} className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">City</label>
              <input value={form.city} onChange={set("city")} required className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">State</label>
              <input value={form.state} onChange={set("state")} className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white" />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={save} className="px-8 py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors">
              {adding ? "Save Address" : "Update Address"}
            </button>
            <button onClick={() => { setEditing(null); setAdding(false); }} className="px-8 py-3 border border-[#ececec] text-[#6e6e6e] text-[10px] tracking-[0.2em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
