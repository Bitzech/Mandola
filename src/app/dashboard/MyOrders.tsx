import { useState, useEffect } from "react";
import { Search, Eye, Truck, Download, RefreshCw, Package } from "lucide-react";
import { deliveryStatusColor, paymentStatusColor } from "./dashboardData";
import type { NavigateFn } from "./dashboardData";
import { orderService } from "../services/order.service";
import { formatImageUrl } from "../utils/imageUrl";
import { extractErrorMessage } from "../utils/errorExtractor";
import { toast } from "sonner";

type StatusFilter = "All" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export default function MyOrders({ onNavigate }: { onNavigate: NavigateFn }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams: any = {
        page,
        limit: 20,
      };

      if (search.trim()) {
        queryParams.search = search.trim();
      }

      if (filter !== "All") {
        queryParams.order_status = filter.toLowerCase();
      }

      const response: any = await orderService.getOrders(queryParams);
      const resData = response?.data || response;
      const itemsList = Array.isArray(resData)
        ? resData
        : Array.isArray(resData?.items)
        ? resData.items
        : Array.isArray(resData?.data)
        ? resData.data
        : [];
      const meta = response?.pagination || resData?.pagination;

      setOrders(itemsList);
      setTotalItems(meta?.total_items || meta?.total || itemsList.length);
      setTotalPages(meta?.total_pages || meta?.totalPages || 1);
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load customer orders.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter, page]);

  // Handle client-side search debounce or manual trigger
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const filtered = orders.filter((o) => {
    const orderIdStr = String(o.order_number || o.id || "").toLowerCase();
    const matchesSearch = !search || orderIdStr.includes(search.toLowerCase()) || (o.items || o.order_items || []).some((i: any) => (i.product_name || i.name || "").toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  const formatCurrency = (val: number | string) => {
    const num = Number(val) || 0;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  return (
    <div>
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">History</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">My Orders</h2>
        <p className="text-sm text-[#6e6e6e] font-light mt-1">{totalItems || orders.length} orders placed</p>
      </div>

      {/* Search + filters */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9e9e9e]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or product…"
            className="w-full border border-[#ececec] pl-10 pr-4 py-2.5 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["All", "Processing", "Shipped", "Delivered", "Cancelled"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { setFilter(s); setPage(1); }}
              className={`px-3 py-2 text-[10px] tracking-[0.1em] uppercase border transition-colors ${filter === s ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a]"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </form>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-[#ececec] p-5 h-44 bg-slate-50" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-12 text-center">
          <p className="text-sm text-red-600 font-light mb-3">{error}</p>
          <button onClick={fetchOrders} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry Loading Orders
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#ececec] p-16 text-center">
          <Package size={48} className="text-[#ececec] mx-auto mb-4" strokeWidth={1} />
          <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a]">No orders found</p>
          <p className="text-sm text-[#6e6e6e] font-light mt-1">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const orderIdStr = order.order_number || order.id || `MND-${order.id}`;
            const orderItems = order.items || order.order_items || [];
            const delStatus = order.delivery_status || order.deliveryStatus || order.order_status || order.status || "Processing";
            const payStatus = order.payment_status || order.paymentStatus || "Paid";
            const totalAmt = order.grand_total || order.total_amount || order.amount || 0;
            const orderDate = order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : order.date || "Today";
            const isDelivered = String(delStatus).toLowerCase() === "delivered";
            const isCancelled = String(delStatus).toLowerCase() === "cancelled";

            return (
              <div key={order.id || orderIdStr} className="bg-white border border-[#ececec] p-5">
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#ececec] mb-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    <span className="text-xs font-semibold text-[#1a1a1a] tracking-wide">{orderIdStr}</span>
                    <span className="text-[10px] text-[#6e6e6e] tracking-wide">{orderDate}</span>
                    <span className={`text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 ${deliveryStatusColor(delStatus)}`}>
                      {delStatus}
                    </span>
                    <span className={`text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 ${paymentStatusColor(payStatus)}`}>
                      {payStatus}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[#1a1a1a]">{formatCurrency(totalAmt)}</span>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {orderItems.map((item: any, i: number) => {
                    const rawImg = item.thumbnail || item.product_image || item.image || item.img;
                    const itemImg = formatImageUrl(rawImg);
                    const itemName = item.product_name || item.name || "Product Item";
                    const itemPrice = item.price || item.unit_price || 0;
                    const itemQty = item.quantity || item.qty || 1;
                    const itemSize = item.size_name || item.size || "M";
                    const sellerName = item.seller_name || order.seller_name || "Mandola Official";

                    return (
                      <div key={i} className="flex items-center gap-3">
                        <img src={itemImg} alt={itemName} className="w-14 h-16 object-cover bg-[#faf7f4] flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-[#1a1a1a]">{itemName}</p>
                          <p className="text-[10px] text-[#6e6e6e] tracking-wide mt-0.5">
                            Size: {itemSize} &nbsp;·&nbsp; Qty: {itemQty} &nbsp;·&nbsp; {formatCurrency(itemPrice)}
                          </p>
                          <p className="text-[10px] text-[#9e9e9e] tracking-wide">Seller: {sellerName}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-[#ececec]">
                  <button onClick={() => onNavigate("order-details", String(order.id || orderIdStr))}
                    className="flex items-center gap-1.5 px-4 py-2 border border-[#ececec] text-[#1a1a1a] text-[10px] tracking-[0.15em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
                    <Eye size={12} /> View Details
                  </button>
                  {!isCancelled && !isDelivered && (
                    <button onClick={() => onNavigate("tracking", String(order.id || orderIdStr))}
                      className="flex items-center gap-1.5 px-4 py-2 border border-[#ececec] text-[#1a1a1a] text-[10px] tracking-[0.15em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
                      <Truck size={12} /> Track Order
                    </button>
                  )}
                  {(payStatus === "Paid" || payStatus === "paid" || isDelivered) && (
                    <button onClick={() => onNavigate("invoices")} className="flex items-center gap-1.5 px-4 py-2 border border-[#ececec] text-[#1a1a1a] text-[10px] tracking-[0.15em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
                      <Download size={12} /> Invoice
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-[#ececec]">
              <span className="text-xs text-[#6e6e6e]">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border border-[#ececec] text-xs uppercase disabled:opacity-40 hover:border-[#d4145a]"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 border border-[#ececec] text-xs uppercase disabled:opacity-40 hover:border-[#d4145a]"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
