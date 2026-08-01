import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, RefreshCw, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { fmt } from "./adminData";
import { adminService } from "../../services/admin.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";

const statusStyle = (s: string) => {
  const lower = (s || "").toLowerCase();
  if (lower === "approved") return "bg-green-50 text-green-700";
  if (lower === "pending")  return "bg-amber-50 text-amber-700";
  if (lower === "rejected") return "bg-red-50 text-red-600";
  return "bg-gray-50 text-gray-600";
};

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, limit };
      if (search.trim()) params.search = search.trim();
      if (filter !== "All") params.approval_status = filter.toLowerCase();

      const response: any = await adminService.getProducts(params);
      const rawData = response.data || response;
      const itemsList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];

      const pagination = response?.meta?.pagination || rawData?.pagination || response?.pagination;
      const total = pagination?.total ?? itemsList.length;
      const pages = pagination?.totalPages ?? pagination?.pages ?? Math.max(1, Math.ceil(total / limit));

      setProducts(itemsList);
      setTotalProducts(total);
      setTotalPages(pages);
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load products list.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, filter, page]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleFilterChange = (val: string) => {
    setFilter(val);
    setPage(1);
  };

  const handleApproval = async (productId: string | number, nextStatus: string) => {
    let rejectionReason: string | undefined = undefined;
    const lowerStatus = nextStatus.toLowerCase();

    if (lowerStatus === "rejected") {
      const reason = window.prompt("Please enter a reason for rejecting this product:");
      if (reason === null) return;
      if (!reason.trim()) {
        toast.error("Rejection reason is required when rejecting a product.");
        return;
      }
      rejectionReason = reason.trim();
    }

    setUpdatingId(productId);
    try {
      await adminService.updateProductApproval(productId, lowerStatus, rejectionReason);
      toast.success(`Product status updated to ${nextStatus}.`);
      await fetchProducts();
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to update product status.");
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

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
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search products…"
              className="border border-[#ececec] pl-8 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#d4145a] bg-white w-52"
            />
          </div>
          <select value={filter} onChange={(e) => handleFilterChange(e.target.value)} className="border border-[#ececec] px-3 py-2.5 text-xs text-[#6e6e6e] focus:outline-none focus:border-[#d4145a] bg-white cursor-pointer">
            {["All", "Approved", "Pending", "Rejected"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-[#ececec] p-12 text-center animate-pulse">
          <p className="text-xs text-[#9e9e9e] uppercase tracking-widest">Loading products data…</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-12 text-center">
          <p className="text-sm text-red-600 font-light mb-4">{error}</p>
          <button onClick={fetchProducts} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry Loading
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white border border-[#ececec] overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr className="border-b border-[#ececec]">
                  {["Product", "SKU", "Seller", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const statusRaw = p.approval_status || p.status || "Approved";
                  const statusFormatted = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);
                  const isUpdating = updatingId === p.id;
                  const pImg = p.thumbnail || p.image || p.img || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=120&fit=crop";
                  const productTarget = p.slug || p.id;

                  return (
                    <tr key={p.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={pImg} alt={p.name} className="w-9 h-11 object-cover bg-[#faf7f4] flex-shrink-0" />
                          <a
                            href={`/product/${productTarget}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-[#1a1a1a] hover:text-[#d4145a] transition-colors"
                          >
                            {p.name || p.product_name}
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[10px] text-[#9e9e9e] font-mono tracking-wide">{p.sku || `MND-${p.id}`}</td>
                      <td className="px-4 py-3 text-xs text-[#6e6e6e]">{p.seller_business_name || p.seller_name || p.seller || "Mandola Direct"}</td>
                      <td className="px-4 py-3 text-xs text-[#6e6e6e]">{p.category_name || p.category || "General"}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-[#1a1a1a]">{fmt(p.sale_price || p.price || p.base_price || 0)}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-[#1a1a1a]">{p.total_stock ?? p.stock ?? p.quantity ?? 0}</td>
                      <td className="px-4 py-3"><span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${statusStyle(statusFormatted)}`}>{statusFormatted}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <a
                            href={`/product/${productTarget}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-[#6e6e6e] hover:text-blue-600 transition-colors"
                            title="View Product Details"
                          >
                            <Eye size={13} strokeWidth={1.5} />
                          </a>
                          {statusRaw.toLowerCase() === "pending" && (
                            <>
                              <button onClick={() => handleApproval(p.id, "approved")} disabled={isUpdating} className="p-1.5 text-[#6e6e6e] hover:text-green-600 transition-colors" title="Approve">
                                {isUpdating ? <RefreshCw size={13} className="animate-spin" /> : <CheckCircle size={13} strokeWidth={1.5} />}
                              </button>
                              <button onClick={() => handleApproval(p.id, "rejected")} disabled={isUpdating} className="p-1.5 text-[#6e6e6e] hover:text-red-500 transition-colors" title="Reject">
                                <XCircle size={13} strokeWidth={1.5} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {products.length === 0 && <div className="py-12 text-center text-xs text-[#9e9e9e]">No products found matching selection.</div>}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-[#ececec] px-4 py-3">
              <p className="text-xs text-[#6e6e6e]">
                Showing <span className="font-semibold text-[#1a1a1a]">{products.length}</span> of <span className="font-semibold text-[#1a1a1a]">{totalProducts}</span> products
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 border border-[#ececec] text-[#1a1a1a] disabled:opacity-30 hover:border-[#d4145a] transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs text-[#6e6e6e] font-medium px-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 border border-[#ececec] text-[#1a1a1a] disabled:opacity-30 hover:border-[#d4145a] transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
