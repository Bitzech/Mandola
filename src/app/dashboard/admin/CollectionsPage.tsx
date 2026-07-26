import { useState, useEffect } from "react";
import { Trash2, Plus, Layers, RefreshCw } from "lucide-react";
import { categoryService } from "../../services/category.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCollections = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await categoryService.getCollections();
      const rawData = response.data || response;
      const itemsList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];
      setCollections(itemsList);
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load collections.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleAddCollection = async () => {
    if (!newName.trim()) {
      toast.error("Please enter a collection name.");
      return;
    }
    setSaving(true);
    try {
      await categoryService.createCollection({ name: newName.trim() });
      toast.success("Collection created successfully!");
      setNewName("");
      setShowAdd(false);
      fetchCollections();
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to create collection."));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCollection = async (id: string | number) => {
    try {
      await categoryService.deleteCollection(id);
      toast.success("Collection deleted.");
      fetchCollections();
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to delete collection."));
    }
  };

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
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Collection Name *</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Monsoon Essentials"
              className="w-full border border-[#ececec] px-4 py-3 text-sm focus:outline-none focus:border-[#d4145a] bg-white"
              autoFocus
            />
          </div>
          <button
            onClick={handleAddCollection}
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
          <p className="text-xs text-[#9e9e9e] uppercase tracking-widest">Loading collections…</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-12 text-center">
          <p className="text-sm text-red-600 font-light mb-4">{error}</p>
          <button onClick={fetchCollections} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry Loading
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {collections.map((c) => (
            <div key={c.id} className="bg-white border border-[#ececec] overflow-hidden">
              <div className="relative h-28 bg-[#faf7f4]">
                {c.image || c.banner ? (
                  <img src={c.image || c.banner} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Layers size={32} strokeWidth={1} className="text-[#ececec]" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => handleDeleteCollection(c.id)} className="w-6 h-6 bg-white border border-[#ececec] flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-colors">
                    <Trash2 size={10} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-[#1a1a1a]">{c.name}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold bg-green-50 text-green-700">
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))}
          {collections.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 bg-white border border-[#ececec] py-16 text-center">
              <p className="text-xs text-[#9e9e9e]">No collections found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
