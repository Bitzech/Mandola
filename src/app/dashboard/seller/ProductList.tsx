import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, Eye, ChevronLeft, ChevronRight, RefreshCw, X } from "lucide-react";
import { fmt, type SellerNavigateFn } from "./sellerData";
import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import { Category, Product } from "../../types/product.types";
import { useAuth } from "../../context/AuthContext";

const statusStyle = (s?: string) => {
  const status = (s || "").toLowerCase();
  if (status === "active" || status === "approved") return "bg-green-50 text-green-700";
  if (status === "inactive" || status === "draft") return "bg-gray-100 text-gray-600";
  if (status === "out of stock") return "bg-red-50 text-red-600";
  if (status === "pending") return "bg-amber-50 text-amber-700";
  if (status === "rejected") return "bg-red-50 text-red-700";
  return "bg-gray-50 text-gray-600";
};

export default function ProductList({ onNavigate }: { onNavigate: SellerNavigateFn }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Actions state
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  const fetchCategories = async () => {
    try {
      const cats = await categoryService.getCategories();
      setCategories(cats || []);
    } catch {
      // Quiet fail fallback
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const sellerUserId = user?.id || user?.user_id || user?.seller_id;
      const params: any = {
        page,
        limit: 10,
      };
      if (sellerUserId) {
        params.seller_id = Number(sellerUserId);
      }
      if (search.trim()) params.search = search.trim();
      if (category !== "All") params.category_id = category;
      if (status !== "All") {
        if (status === "Active" || status === "Approved") params.status = "approved";
        else if (status === "Draft") params.status = "draft";
        else if (status === "Pending") params.status = "pending";
        else if (status === "Inactive") params.status = "inactive";
        else if (status === "Rejected") params.status = "rejected";
        else params.status = status.toLowerCase();
      }

      console.log("[My Products Request Params]:", params);
      const res = await productService.getProducts(params);
      console.log("[My Products Response Data]:", res);

      const resData = res?.data || res;
      let itemsList: Product[] = [];
      let total = 0;

      if (Array.isArray(resData)) {
        itemsList = resData;
        total = res?.meta?.pagination?.total ?? resData.length;
      } else if (resData && Array.isArray(resData.items)) {
        itemsList = resData.items;
        total = res?.meta?.pagination?.total ?? resData.total ?? resData.items.length;
      } else if (resData && Array.isArray(resData.products)) {
        itemsList = resData.products;
        total = res?.meta?.pagination?.total ?? resData.total ?? resData.products.length;
      }

      setProducts(itemsList);
      setTotalCount(total);
      const calculatedPages = res?.meta?.pagination?.pages || Math.max(1, Math.ceil(total / 10));
      setTotalPages(calculatedPages);
    } catch (err: any) {
      console.error("[My Products Fetch Error]:", err?.response?.data || err);
      setError(err?.message || "Failed to fetch products list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, category, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productService.deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
      fetchProducts();
    } catch (err: any) {
      alert(err?.message || "Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusToggle = async (p: Product) => {
    const nextStatus = p.status === "active" ? "inactive" : "active";
    try {
      await productService.changeProductStatus(p.id, nextStatus);
      fetchProducts();
    } catch (err: any) {
      alert(err?.message || "Failed to change product status.");
    }
  };

  return (
    <div className="font-['Jost',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage Catalog</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Products ({totalCount})</h2>
        </div>
        <button
          onClick={() => onNavigate("add-product")}
          className="flex-shrink-0 px-5 py-2.5 bg-[#d4145a] text-white text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#b8114d] transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Error Bar */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs mb-5 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchProducts} className="flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase font-semibold underline">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* Filters Form */}
      <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e9e9e]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, SKU, or brand…"
            className="w-full border border-[#ececec] pl-9 pr-4 py-2.5 text-xs text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
          />
        </div>
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1); }}
          className="border border-[#ececec] px-3 py-2.5 text-xs text-[#6e6e6e] focus:outline-none focus:border-[#d4145a] bg-white"
        >
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="border border-[#ececec] px-3 py-2.5 text-xs text-[#6e6e6e] focus:outline-none focus:border-[#d4145a] bg-white"
        >
          <option value="All">All Statuses</option>
          <option value="Approved">Approved / Active</option>
          <option value="Pending">Pending Approval</option>
          <option value="Draft">Draft</option>
          <option value="Inactive">Inactive</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button type="submit" className="px-4 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.15em] uppercase hover:bg-[#d4145a] transition-colors">
          Search
        </button>
      </form>

      {/* Products Table */}
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
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[#ececec]">
                  <td colSpan={7} className="px-4 py-3">
                    <div className="h-6 bg-gray-100 animate-pulse rounded" />
                  </td>
                </tr>
              ))
            ) : products.length > 0 ? (
              products.map(p => {
                const imgUrl = (p.images && p.images.length > 0 ? (p.images.find(img => img.is_primary)?.image || p.images[0]?.image) : p.image || p.primary_image) || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=70";
                const priceVal = Number(p.sale_price || p.price || 0);
                const mrpVal = Number(p.mrp || p.regular_price || p.price || 0);
                const stockVal = p.stock_quantity !== undefined ? p.stock_quantity : (p.stock !== undefined ? p.stock : 0);

                return (
                  <tr key={p.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={imgUrl} alt={p.name} className="w-10 h-12 object-cover bg-[#faf7f4] flex-shrink-0 border border-[#ececec]" />
                        <div>
                          <span className="text-xs font-medium text-[#1a1a1a] block truncate max-w-[200px]">{p.name}</span>
                          {p.brand_name && <span className="text-[10px] text-[#9e9e9e]">{p.brand_name}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-[#9e9e9e] tracking-wide font-mono">{p.sku || "N/A"}</td>
                    <td className="px-4 py-3 text-xs text-[#6e6e6e]">{p.category_name || (typeof p.category === "object" ? p.category?.name : p.category) || "General"}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-[#1a1a1a]">{fmt(priceVal)}</p>
                      {mrpVal > priceVal && <p className="text-[10px] text-[#9e9e9e] line-through">{fmt(mrpVal)}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${stockVal === 0 ? "text-red-600" : stockVal <= 10 ? "text-amber-600" : "text-green-700"}`}>
                        {stockVal === 0 ? "Out of Stock" : stockVal}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleStatusToggle(p)}
                        title="Click to toggle status"
                        className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold hover:opacity-80 transition-opacity ${statusStyle(p.status)}`}
                      >
                        {p.status || "active"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onNavigate("add-product", String(p.id))} className="p-1.5 text-[#6e6e6e] hover:text-[#d4145a] transition-colors" title="Edit">
                          <Edit2 size={13} strokeWidth={1.5} />
                        </button>
                        <button onClick={() => setPreviewProduct(p)} className="p-1.5 text-[#6e6e6e] hover:text-blue-600 transition-colors" title="View Details">
                          <Eye size={13} strokeWidth={1.5} />
                        </button>
                        <button onClick={() => setDeleteTarget(p)} className="p-1.5 text-[#6e6e6e] hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={13} strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs text-[#9e9e9e] tracking-wide">No products found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#ececec] bg-white">
            <span className="text-[10px] text-[#6e6e6e] uppercase tracking-wide">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-1.5 border border-[#ececec] text-[#6e6e6e] disabled:opacity-40 hover:border-[#d4145a] hover:text-[#d4145a] transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 border border-[#ececec] text-[#6e6e6e] disabled:opacity-40 hover:border-[#d4145a] hover:text-[#d4145a] transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white w-full max-w-lg p-6 relative shadow-2xl space-y-4">
            <button onClick={() => setPreviewProduct(null)} className="absolute top-4 right-4 text-[#6e6e6e] hover:text-[#1a1a1a]">
              <X size={16} />
            </button>
            <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a]">{previewProduct.name}</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div><span className="text-[#9e9e9e] uppercase text-[9px]">SKU:</span> <p className="font-semibold text-[#1a1a1a]">{previewProduct.sku}</p></div>
              <div><span className="text-[#9e9e9e] uppercase text-[9px]">Category:</span> <p className="font-semibold text-[#1a1a1a]">{previewProduct.category_name || "General"}</p></div>
              <div><span className="text-[#9e9e9e] uppercase text-[9px]">Price:</span> <p className="font-semibold text-[#d4145a]">{fmt(Number(previewProduct.sale_price || previewProduct.price || 0))}</p></div>
              <div><span className="text-[#9e9e9e] uppercase text-[9px]">Stock:</span> <p className="font-semibold text-[#1a1a1a]">{previewProduct.stock_quantity ?? previewProduct.stock ?? 0}</p></div>
              <div><span className="text-[#9e9e9e] uppercase text-[9px]">Status:</span> <p className="font-semibold capitalize text-[#1a1a1a]">{previewProduct.status}</p></div>
            </div>
            {previewProduct.description && (
              <div>
                <span className="text-[#9e9e9e] uppercase text-[9px] block mb-1">Description:</span>
                <p className="text-xs text-[#6e6e6e] font-light leading-relaxed">{previewProduct.description}</p>
              </div>
            )}
            <div className="pt-2 flex justify-end gap-3">
              <a
                href={`/product/${previewProduct.slug || previewProduct.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-[#1a1a1a] text-[#1a1a1a] text-[10px] tracking-[0.15em] uppercase font-semibold hover:bg-[#1a1a1a] hover:text-white transition-colors"
              >
                View on Store
              </a>
              <button onClick={() => { setPreviewProduct(null); onNavigate("add-product", String(previewProduct.id)); }} className="px-5 py-2 bg-[#d4145a] text-white text-[10px] tracking-[0.15em] uppercase font-semibold">
                Edit Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white w-full max-w-sm p-6 relative shadow-2xl text-center space-y-4">
            <button onClick={() => setDeleteTarget(null)} className="absolute top-4 right-4 text-[#6e6e6e] hover:text-[#1a1a1a]">
              <X size={16} />
            </button>
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={20} />
            </div>
            <h4 className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Delete Product?</h4>
            <p className="text-xs text-[#6e6e6e]">Are you sure you want to delete <strong className="text-[#1a1a1a]">{deleteTarget.name}</strong>? This action cannot be undone.</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border border-[#ececec] text-xs text-[#1a1a1a] uppercase tracking-wider">
                Cancel
              </button>
              <button disabled={deleting} onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 text-white text-xs uppercase tracking-wider font-semibold disabled:opacity-50">
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
