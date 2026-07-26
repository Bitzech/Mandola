import { useState, useEffect } from "react";
import { Trash2, Plus, RefreshCw } from "lucide-react";
import { categoryService } from "../../services/category.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await categoryService.getBrands();
      const rawData = response.data || response;
      const itemsList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];
      setBrands(itemsList);
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load brands.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleAddBrand = async () => {
    if (!newName.trim()) {
      toast.error("Please enter a brand name.");
      return;
    }
    setSaving(true);
    try {
      await categoryService.createBrand({ name: newName.trim() });
      toast.success("Brand created successfully!");
      setNewName("");
      setShowAdd(false);
      fetchBrands();
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to create brand."));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBrand = async (id: string | number) => {
    try {
      await categoryService.deleteBrand(id);
      toast.success("Brand deleted.");
      fetchBrands();
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to delete brand."));
    }
  };

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
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Brand Name *</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Zari Creations"
              className="w-full border border-[#ececec] px-4 py-3 text-sm focus:outline-none focus:border-[#d4145a] bg-white"
              autoFocus
            />
          </div>
          <button
            onClick={handleAddBrand}
            disabled={saving}
            className="px-5 py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <RefreshCw size={13} className="animate-spin" /> : null} Save
          </button>
          <button onClick={() => setShowAdd(false)} className="px-4 py-3 border border-[#ececec] text-[#6e6e6e] text-[10px] tracking-[0.2em] uppercase hover:border-[#1a1a1a] transition-colors">
            Cancel
          </button>
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-[#ececec] p-12 text-center animate-pulse">
          <p className="text-xs text-[#9e9e9e] uppercase tracking-widest">Loading brands…</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-12 text-center">
          <p className="text-sm text-red-600 font-light mb-4">{error}</p>
          <button onClick={fetchBrands} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry Loading
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#ececec] overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="border-b border-[#ececec]">
                {["Brand Name", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-[#1a1a1a]">{b.name}</td>
                  <td className="px-5 py-3">
                    <span className="text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold bg-green-50 text-green-700">
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDeleteBrand(b.id)} className="p-1.5 text-[#6e6e6e] hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 size={13} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {brands.length === 0 && <div className="py-12 text-center text-xs text-[#9e9e9e]">No brands registered.</div>}
        </div>
      )}
    </div>
  );
}
