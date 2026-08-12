import { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, RefreshCw, FolderPlus, Layers, ChevronDown, ChevronRight, Tag } from "lucide-react";
import { categoryService } from "../../services/category.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";
import { Category, SubCategory } from "../../types/product.types";

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<"categories" | "subcategories">("categories");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for Category
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [savingCat, setSavingCat] = useState(false);

  // Form states for Sub-Category
  const [showAddSub, setShowAddSub] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<number | string>("");
  const [newSubName, setNewSubName] = useState("");
  const [newSubDesc, setNewSubDesc] = useState("");
  const [savingSub, setSavingSub] = useState(false);

  // Expanded categories state
  const [expandedCatIds, setExpandedCatIds] = useState<Set<number>>(new Set());

  const fetchTaxonomy = async () => {
    setLoading(true);
    setError(null);
    try {
      const [catsData, subsData] = await Promise.all([
        categoryService.getCategoriesWithSubCategories(true),
        categoryService.getSubCategories({ limit: 100 })
      ]);
      setCategories(catsData || []);
      setSubCategories(subsData || []);
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load taxonomy data.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxonomy();
  }, []);

  const toggleExpand = (catId: number) => {
    setExpandedCatIds((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      toast.error("Category name is required.");
      return;
    }
    setSavingCat(true);
    try {
      await categoryService.createCategory({
        name: newCatName.trim(),
        description: newCatDesc.trim() || undefined
      });
      toast.success(`Category "${newCatName.trim()}" created successfully!`);
      setNewCatName("");
      setNewCatDesc("");
      setShowAddCat(false);
      fetchTaxonomy();
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to create category."));
    } finally {
      setSavingCat(false);
    }
  };

  const handleAddSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParentId) {
      toast.error("Please select a parent category.");
      return;
    }
    if (!newSubName.trim()) {
      toast.error("Sub-Category name is required.");
      return;
    }
    setSavingSub(true);
    try {
      await categoryService.createSubCategory({
        category_id: selectedParentId,
        name: newSubName.trim(),
        description: newSubDesc.trim() || undefined
      });
      toast.success(`Sub-Category "${newSubName.trim()}" created successfully!`);
      setNewSubName("");
      setNewSubDesc("");
      setShowAddSub(false);
      fetchTaxonomy();
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to create sub-category."));
    } finally {
      setSavingSub(false);
    }
  };

  const handleDeleteCategory = async (id: string | number, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await categoryService.deleteCategory(id);
      toast.success(`Category "${name}" deleted.`);
      fetchTaxonomy();
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to delete category."));
    }
  };

  const handleDeleteSubCategory = async (id: string | number, name: string) => {
    if (!confirm(`Are you sure you want to delete sub-category "${name}"?`)) return;
    try {
      await categoryService.deleteSubCategory(id);
      toast.success(`Sub-Category "${name}" deleted.`);
      fetchTaxonomy();
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to delete sub-category."));
    }
  };

  const openAddSubForCategory = (catId: number | string) => {
    setSelectedParentId(catId);
    setShowAddSub(true);
    setActiveTab("subcategories");
  };

  return (
    <div>
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Taxonomy</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">
            Categories & Sub-Categories
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowAddCat(true);
              setShowAddSub(false);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1a1a1a] text-white text-[9px] tracking-[0.15em] uppercase font-semibold hover:bg-[#d4145a] transition-colors"
          >
            <FolderPlus size={12} strokeWidth={2} /> Add Category
          </button>
          <button
            onClick={() => {
              setShowAddSub(true);
              setShowAddCat(false);
              if (categories.length > 0 && !selectedParentId) {
                setSelectedParentId(categories[0].id);
              }
              setActiveTab("subcategories");
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#d4145a] text-white text-[9px] tracking-[0.15em] uppercase font-semibold hover:bg-[#b8114d] transition-colors"
          >
            <Plus size={12} strokeWidth={2.5} /> Add Sub-Category
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[#ececec] mb-6">
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-5 py-3 text-xs tracking-[0.15em] uppercase font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "categories"
              ? "border-[#d4145a] text-[#d4145a]"
              : "border-transparent text-[#6e6e6e] hover:text-[#1a1a1a]"
          }`}
        >
          <Layers size={14} /> Parent Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab("subcategories")}
          className={`px-5 py-3 text-xs tracking-[0.15em] uppercase font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "subcategories"
              ? "border-[#d4145a] text-[#d4145a]"
              : "border-transparent text-[#6e6e6e] hover:text-[#1a1a1a]"
          }`}
        >
          <Tag size={14} /> Sub-Categories ({subCategories.length})
        </button>
      </div>

      {/* Add Parent Category Form Card */}
      {showAddCat && (
        <form onSubmit={handleAddCategory} className="bg-white border border-[#ececec] p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#ececec]">
            <h3 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider flex items-center gap-2">
              <FolderPlus size={16} className="text-[#d4145a]" /> Add New Parent Category
            </h3>
            <button
              type="button"
              onClick={() => setShowAddCat(false)}
              className="text-xs text-[#6e6e6e] hover:text-[#1a1a1a]"
            >
              Close
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-1.5 font-semibold">Category Name *</label>
              <input
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Ethnic Wear, Party Wear, Western"
                className="w-full border border-[#ececec] px-4 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-1.5 font-semibold">Description (Optional)</label>
              <input
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="e.g. Traditional and ethnic collection"
                className="w-full border border-[#ececec] px-4 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddCat(false)}
              className="px-4 py-2 border border-[#ececec] text-[#6e6e6e] text-[10px] tracking-[0.15em] uppercase hover:border-[#1a1a1a]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingCat}
              className="px-5 py-2 bg-[#d4145a] text-white text-[10px] tracking-[0.15em] uppercase font-semibold hover:bg-[#b8114d] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {savingCat && <RefreshCw size={12} className="animate-spin" />} Save Category
            </button>
          </div>
        </form>
      )}

      {/* Add Sub-Category Form Card */}
      {showAddSub && (
        <form onSubmit={handleAddSubCategory} className="bg-white border-2 border-[#d4145a]/30 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#ececec]">
            <h3 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider flex items-center gap-2">
              <Tag size={16} className="text-[#d4145a]" /> Add New Sub-Category
            </h3>
            <button
              type="button"
              onClick={() => setShowAddSub(false)}
              className="text-xs text-[#6e6e6e] hover:text-[#1a1a1a]"
            >
              Close
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-1.5 font-semibold">1. Parent Category *</label>
              <select
                required
                value={selectedParentId}
                onChange={(e) => setSelectedParentId(e.target.value)}
                className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white cursor-pointer"
              >
                <option value="">Select Parent Category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-1.5 font-semibold">2. Sub-Category Name *</label>
              <input
                required
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="e.g. Sarees, Lehengas, Kurtas, Tops"
                className="w-full border border-[#ececec] px-4 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-1.5 font-semibold">3. Description (Optional)</label>
              <input
                value={newSubDesc}
                onChange={(e) => setNewSubDesc(e.target.value)}
                placeholder="e.g. Handcrafted festive sarees"
                className="w-full border border-[#ececec] px-4 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddSub(false)}
              className="px-4 py-2 border border-[#ececec] text-[#6e6e6e] text-[10px] tracking-[0.15em] uppercase hover:border-[#1a1a1a]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingSub}
              className="px-5 py-2 bg-[#d4145a] text-white text-[10px] tracking-[0.15em] uppercase font-semibold hover:bg-[#b8114d] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {savingSub && <RefreshCw size={12} className="animate-spin" />} Save Sub-Category
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="bg-white border border-[#ececec] p-12 text-center animate-pulse">
          <p className="text-xs text-[#9e9e9e] uppercase tracking-widest">Loading taxonomy data…</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-12 text-center">
          <p className="text-sm text-red-600 font-light mb-4">{error}</p>
          <button
            onClick={fetchTaxonomy}
            className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={13} /> Retry Loading
          </button>
        </div>
      ) : activeTab === "categories" ? (
        /* PARENT CATEGORIES TAB */
        <div className="space-y-4">
          <div className="bg-white border border-[#ececec] overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#ececec] bg-[#faf7f4]">
                  {["", "Category Name", "Slug", "Sub-Categories", "Products", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => {
                  const catStatus = String(c.status || "active").toLowerCase();
                  const isCatActive = catStatus === "active";
                  const subsCount = c.subCategories ? c.subCategories.length : 0;
                  const isExpanded = expandedCatIds.has(c.id);

                  return (
                    <tr key={c.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors group">
                      <td className="px-3 py-3 w-10 text-center">
                        <button
                          onClick={() => toggleExpand(c.id)}
                          className="p-1 text-[#6e6e6e] hover:text-[#d4145a] transition-colors"
                          title={isExpanded ? "Collapse subcategories" : "Expand subcategories"}
                        >
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#fce8ef] text-[#d4145a] flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-[#1a1a1a] block">{c.name}</span>
                            {c.description && <span className="text-[10px] text-[#6e6e6e] font-light">{c.description}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-[#9e9e9e] font-mono">{c.slug}</td>
                      <td className="px-5 py-3 text-xs">
                        <button
                          onClick={() => toggleExpand(c.id)}
                          className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-pink-50 text-[#d4145a] border border-pink-200 hover:bg-pink-100 transition-colors"
                        >
                          {subsCount} Sub-Categories
                        </button>
                      </td>
                      <td className="px-5 py-3 text-xs font-semibold text-[#1a1a1a]">
                        {c.product_count ?? c.products_count ?? 0} Products
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${
                            isCatActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {isCatActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openAddSubForCategory(c.id)}
                            className="px-2 py-1 bg-[#1a1a1a] text-white text-[9px] tracking-[0.1em] uppercase font-semibold hover:bg-[#d4145a] transition-colors flex items-center gap-1"
                            title="Add Sub-Category under this Category"
                          >
                            <Plus size={10} /> Add Sub
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(c.id, c.name)}
                            className="p-1.5 text-[#6e6e6e] hover:text-red-500 transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 size={13} strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {categories.length === 0 && (
              <div className="py-12 text-center text-xs text-[#9e9e9e]">No parent categories registered.</div>
            )}
          </div>
        </div>
      ) : (
        /* SUB-CATEGORIES TAB */
        <div className="space-y-4">
          <div className="bg-white border border-[#ececec] overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="border-b border-[#ececec] bg-[#faf7f4]">
                  {["Sub-Category", "Parent Category", "Slug", "Products", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subCategories.map((sub: any) => {
                  const parentCat = categories.find((c) => c.id === Number(sub.category_id));
                  const parentName = parentCat ? parentCat.name : sub.category_name || `Category #${sub.category_id}`;
                  const subStatus = String(sub.status || "active").toLowerCase();
                  const isSubActive = subStatus === "active";

                  return (
                    <tr key={sub.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {sub.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-[#1a1a1a] block">{sub.name}</span>
                            {sub.description && <span className="text-[10px] text-[#6e6e6e] font-light">{sub.description}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs">
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 bg-pink-50 text-[#d4145a] border border-pink-200">
                          {parentName}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-[#9e9e9e] font-mono">{sub.slug}</td>
                      <td className="px-5 py-3 text-xs font-semibold text-[#1a1a1a]">
                        {sub.product_count ?? sub.products_count ?? 0} Products
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${
                            isSubActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {isSubActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleDeleteSubCategory(sub.id, sub.name)}
                          className="p-1.5 text-[#6e6e6e] hover:text-red-500 transition-colors"
                          title="Delete Sub-Category"
                        >
                          <Trash2 size={13} strokeWidth={1.5} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {subCategories.length === 0 && (
              <div className="py-12 text-center text-xs text-[#9e9e9e]">
                No sub-categories registered yet. Click "Add Sub-Category" to create one.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
