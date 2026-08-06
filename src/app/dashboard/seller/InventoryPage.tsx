import { useState, useEffect } from "react";
import { productService } from "../../services/product.service";
import { apiClient } from "../../services/apiClient";
import { useAuth } from "../../context/AuthContext";
import { RefreshCw, Search } from "lucide-react";
import { formatImageUrl } from "../../utils/imageUrl";

export default function InventoryPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "low" | "out">("all");
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editVal, setEditVal] = useState<number>(0);
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, logRes] = await Promise.allSettled([
        productService.getProducts({ seller_id: user?.id, limit: 100 }),
        apiClient.get("/inventory-logs", { params: { limit: 20 } })
      ]);

      if (prodRes.status === "fulfilled" && prodRes.value) {
        const data = prodRes.value.data || prodRes.value;
        const items = Array.isArray(data) ? data : data.products || data.items || [];
        setProducts(items);
      }

      if (logRes.status === "fulfilled" && logRes.value?.data) {
        const logData = logRes.value.data.data || logRes.value.data;
        setHistoryLogs(Array.isArray(logData) ? logData : logData.items || []);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load inventory details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const startEdit = (id: string | number, currentStock: number) => {
    setEditingId(id);
    setEditVal(currentStock || 0);
  };

  const saveEdit = async (product: any) => {
    setUpdating(true);
    try {
      await productService.updateProduct(product.id, { stock_quantity: editVal, stock: editVal });
      setEditingId(null);
      fetchData();
    } catch (err: any) {
      alert(err?.message || "Failed to update stock quantity.");
    } finally {
      setUpdating(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const stockVal = p.stock_quantity !== undefined ? p.stock_quantity : (p.stock !== undefined ? p.stock : 0);
    if (filterTab === "low" && (stockVal === 0 || stockVal > 10)) return false;
    if (filterTab === "out" && stockVal > 0) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q);
      return matchName || matchSku;
    }
    return true;
  });

  return (
    <div className="font-['Jost',sans-serif]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Stock & Warehouse</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Inventory Management</h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 border border-[#ececec] p-1 bg-white">
          <button
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1 text-[10px] tracking-[0.1em] uppercase transition-colors ${filterTab === "all" ? "bg-[#1a1a1a] text-white" : "text-[#6e6e6e] hover:text-[#1a1a1a]"}`}
          >
            All Stock
          </button>
          <button
            onClick={() => setFilterTab("low")}
            className={`px-3 py-1 text-[10px] tracking-[0.1em] uppercase transition-colors ${filterTab === "low" ? "bg-amber-500 text-white" : "text-[#6e6e6e] hover:text-[#1a1a1a]"}`}
          >
            Low Stock
          </button>
          <button
            onClick={() => setFilterTab("out")}
            className={`px-3 py-1 text-[10px] tracking-[0.1em] uppercase transition-colors ${filterTab === "out" ? "bg-red-600 text-white" : "text-[#6e6e6e] hover:text-[#1a1a1a]"}`}
          >
            Out of Stock
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs mb-5 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchData} className="flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase font-semibold underline">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative mb-5 max-w-md">
        <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e9e9e]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter by product name or SKU…"
          className="w-full border border-[#ececec] pl-9 pr-4 py-2.5 text-xs text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-[#ececec] overflow-x-auto mb-8">
        <div className="px-5 py-4 border-b border-[#ececec] flex items-center justify-between">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Current Stock Levels ({filteredProducts.length})</p>
        </div>
        <table className="w-full min-w-[650px]">
          <thead>
            <tr className="border-b border-[#ececec]">
              {["Product", "SKU", "Category", "Current Stock", "Low Alert Level", "Status", "Action"].map(h => (
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
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(p => {
                const stockVal = p.stock_quantity !== undefined ? p.stock_quantity : (p.stock !== undefined ? p.stock : 0);
                const rawImg = p.thumbnail || (p.images && p.images.length > 0 ? (typeof p.images[0] === "string" ? p.images[0] : p.images[0].image || p.images[0].url || p.images[0].image_url) : p.image);
                const imgUrl = formatImageUrl(rawImg);

                return (
                  <tr key={p.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={imgUrl} alt={p.name} className="w-9 h-11 object-cover bg-[#faf7f4] flex-shrink-0 border border-[#ececec]" />
                        <span className="text-xs font-medium text-[#1a1a1a] truncate max-w-[220px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-[#9e9e9e] tracking-wide font-mono">{p.sku || "N/A"}</td>
                    <td className="px-4 py-3 text-xs text-[#6e6e6e]">{p.category_name || p.category || "General"}</td>
                    <td className="px-4 py-3">
                      {editingId === p.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editVal}
                            onChange={e => setEditVal(Number(e.target.value))}
                            className="w-20 border border-[#d4145a] px-2 py-1 text-xs text-[#1a1a1a] focus:outline-none"
                            min={0}
                            autoFocus
                          />
                          <button disabled={updating} onClick={() => saveEdit(p)} className="text-[9px] tracking-[0.1em] uppercase text-green-600 hover:underline font-semibold disabled:opacity-50">
                            Save
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] hover:underline">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className={`text-sm font-bold ${stockVal === 0 ? "text-red-600" : stockVal <= 10 ? "text-amber-600" : "text-green-700"}`}>
                          {stockVal}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#6e6e6e]">10</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${
                        stockVal === 0 ? "bg-red-50 text-red-600" :
                        stockVal <= 10 ? "bg-amber-50 text-amber-700" :
                        "bg-green-50 text-green-700"
                      }`}>
                        {stockVal === 0 ? "Out of Stock" : stockVal <= 10 ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => startEdit(p.id, stockVal)} className="text-[10px] tracking-[0.1em] uppercase text-[#d4145a] hover:underline font-semibold">
                        Update Stock
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs text-[#9e9e9e] tracking-wide">No stock items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Inventory Logs / History */}
      <div className="bg-white border border-[#ececec]">
        <div className="px-5 py-4 border-b border-[#ececec]">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Recent Activity</p>
          <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Inventory Logs & Adjustments</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#ececec]">
                {["Date", "Product", "SKU", "Transaction Type", "Qty Change", "Final Balance"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#9e9e9e]">Loading inventory logs…</td>
                </tr>
              ) : historyLogs.length > 0 ? (
                historyLogs.map((row, i) => (
                  <tr key={row.id || i} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                    <td className="px-4 py-3 text-xs text-[#6e6e6e]">
                      {row.created_at ? new Date(row.created_at).toLocaleDateString() : row.date || "Recent"}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-[#1a1a1a]">{row.product_name || row.product || "Product"}</td>
                    <td className="px-4 py-3 text-[10px] text-[#9e9e9e] tracking-wide font-mono">{row.sku || "N/A"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${
                        row.type === "Restock" || row.action === "add" ? "bg-green-50 text-green-700" :
                        row.type === "Return" || row.action === "return" ? "bg-blue-50 text-blue-700"  :
                        "bg-[#faf7f4] text-[#6e6e6e]"
                      }`}>
                        {row.type || row.action || "Adjustment"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold">
                      <span className={(row.quantity_change || row.qty || 0) > 0 ? "text-green-600" : "text-red-600"}>
                        {(row.quantity_change || row.qty || 0) > 0 ? `+${row.quantity_change || row.qty}` : (row.quantity_change || row.qty)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-[#1a1a1a]">{row.balance_after || row.balance || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#9e9e9e]">No inventory adjustment history recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
