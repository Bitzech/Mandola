import { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, RefreshCw } from "lucide-react";
import { categoryService } from "../../services/category.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await categoryService.getCategories();
      const rawData = response.data || response;
      const itemsList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];
      setCategories(itemsList);
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load categories.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newName.trim()) {
      toast.error("Please enter a category name.");
      return;
    }
    setSaving(true);
    try {
      await categoryService.createCategory({ name: newName.trim() });
      toast.success("Category created successfully!");
      setNewName("");
      setShowAdd(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to create category."));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string | number) => {
    try {
      await categoryService.deleteCategory(id);
      toast.success("Category deleted.");
      fetchCategories();
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to delete category."));
    }
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Categories</h2>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2.5 bg-[#d4145a] text-white text-[9px] tracking-[0.15em] uppercase font-semibold hover:bg-[#b8114d] transition-colors">
          <Plus size={11} strokeWidth={2.5} /> Add Category
        </button>
      </div>

      {showAdd && (
        <div className="bg-white border border-[#ececec] p-5 mb-5 flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Category Name *</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Fusion Wear"
              className="w-full border border-[#ececec] px-4 py-3 text-sm focus:outline-none focus:border-[#d4145a] bg-white"
              autoFocus
            />
          </div>
          <button
            onClick={handleAddCategory}
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
          <p className="text-xs text-[#9e9e9e] uppercase tracking-widest">Loading categories…</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-12 text-center">
          <p className="text-sm text-red-600 font-light mb-4">{error}</p>
          <button onClick={fetchCategories} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry Loading
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#ececec] overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-[#ececec]">
                {["Category", "Slug", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => {
                const catStatus = (c.status || (c.is_active ? "active" : "inactive")).toLowerCase();
                const isCatActive = catStatus === "active";

                return (
                  <tr key={c.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#fce8ef] text-[#d4145a] flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-[#1a1a1a]">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-[#9e9e9e] font-mono">{c.slug || c.name.toLowerCase().replace(/\s+/g, "-")}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${isCatActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {isCatActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDeleteCategory(c.id)} className="p-1.5 text-[#6e6e6e] hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={13} strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {categories.length === 0 && <div className="py-12 text-center text-xs text-[#9e9e9e]">No categories registered.</div>}
        </div>
      )}
    </div>
  );
}
