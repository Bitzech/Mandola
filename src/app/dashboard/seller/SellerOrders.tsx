import { useState, useEffect } from "react";
import { Printer, RefreshCw, Eye, X, ChevronLeft, ChevronRight, Package, Truck, CheckCircle, Clock, Search, AlertCircle } from "lucide-react";
import { orderStatusColor, payStatusColor, fmt, type SellerNavigateFn } from "./sellerData";
import { sellerService } from "../../services/seller.service";
import { invoiceService } from "../../services/invoice.service";
import { formatImageUrl } from "../../utils/imageUrl";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";

const STATUSES = ["All", "Pending", "Processing", "Packed", "Ready to Ship", "Shipped", "Delivered", "Cancelled"];

export default function SellerOrders({ onNavigate: _, selectedOrderId }: { onNavigate: SellerNavigateFn; selectedOrderId?: string | null }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [detailOrder, setDetailOrder] = useState<any | null>(null);
  const [timelineHistory, setTimelineHistory] = useState<any[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierName, setCourierName] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, limit: 10 };
      if (filter !== "All") params.order_status = filter.toLowerCase().replace(/ /g, "_");
      if (search.trim()) params.search = search.trim();

      const res = await sellerService.getSellerOrders(params);
      const resData = (res?.data || res) as any;

      if (Array.isArray(resData)) {
        setOrders(resData);
        setTotalPages(1);
      } else if (resData && Array.isArray(resData.orders)) {
        setOrders(resData.orders);
        setTotalPages(resData.pagination?.total_pages || resData.totalPages || 1);
      } else if (resData && Array.isArray(resData.items)) {
        setOrders(resData.items);
        setTotalPages(resData.pagination?.total_pages || resData.totalPages || 1);
      } else {
        setOrders([]);
        setTotalPages(1);
      }
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load seller orders.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, filter, search]);

  useEffect(() => {
    if (selectedOrderId) {
      handleViewDetails(selectedOrderId);
    }
  }, [selectedOrderId]);

  const handleUpdateStatus = async (orderId: string | number, newStatus: string, extraData?: any) => {
    setUpdatingId(orderId);
    try {
      await sellerService.updateOrderStatus(orderId, newStatus, extraData);
      toast.success(`Order status updated to ${newStatus.replace(/_/g, " ")}.`);
      if (detailOrder && (detailOrder.id === orderId || detailOrder.order_number === orderId)) {
        setDetailOrder((prev: any) => ({ ...prev, order_status: newStatus, status: newStatus }));
      }
      fetchOrders();
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to update order status.");
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewDetails = async (orderId: string | number) => {
    setLoadingDetail(true);
    try {
      const res = await sellerService.getSellerOrderById(orderId);
      const orderData = (res.data || res) as any;
      setDetailOrder(orderData);
      setTrackingNumber(orderData?.tracking_number || "");
      setCourierName(orderData?.courier_name || "");

      try {
        const histRes = await sellerService.getOrderHistory(orderId);
        const histData = histRes.data || histRes;
        setTimelineHistory(Array.isArray(histData) ? histData : (histData?.history || histData?.items || []));
      } catch {
        setTimelineHistory([]);
      }
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load order details.");
      toast.error(msg);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDownloadInvoice = async (orderId: string | number) => {
    try {
      toast.info("Generating invoice...");
      const invoice = await invoiceService.generateInvoice(orderId);
      if (invoice?.id) {
        window.open(`/customer/invoices/${invoice.id}`, "_blank");
        toast.success("Invoice opened!");
      } else {
        window.print();
      }
    } catch {
      window.print();
    }
  };

  const NEXT_STATUS: Record<string, string> = {
    pending: "processing",
    processing: "packed",
    packed: "ready_to_ship",
    ready_to_ship: "shipped",
    shipped: "delivered"
  };

  return (
    <div className="font-['Jost',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Sub-Orders</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Seller Orders</h2>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") fetchOrders(); }}
            placeholder="Search order # or customer…"
            className="w-full border border-[#ececec] px-3 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs mb-5 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchOrders} className="flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase font-semibold underline">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex overflow-x-auto gap-1 mb-5 bg-white border border-[#ececec] p-1">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`flex-shrink-0 px-4 py-2 text-[10px] tracking-[0.12em] uppercase font-semibold transition-colors ${
              filter === s
                ? "bg-[#d4145a] text-white"
                : "text-[#6e6e6e] hover:text-[#1a1a1a]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders Listing */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#ececec] p-5 h-36 animate-pulse" />
          ))
        ) : orders.length > 0 ? (
          orders.map(o => {
            const currentStatus = (o.order_status || o.status || "pending").toLowerCase();
            const nextStatus = NEXT_STATUS[currentStatus];
            const items = o.items || o.order_items || [];
            const firstItem = items[0] || {};
            const itemImg = formatImageUrl(firstItem.product_image || firstItem.image);

            return (
              <div key={o.id} className="bg-white border border-[#ececec] p-5 hover:border-[#c0c0c0] transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-[#ececec]">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs font-bold text-[#d4145a]">{o.order_number || `#ORD-${o.id}`}</p>
                      <p className="text-[10px] text-[#9e9e9e] tracking-wide mt-0.5">
                        {o.created_at ? new Date(o.created_at).toLocaleDateString() : o.date || "Recent"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1a1a1a]">
                        {o.first_name ? `${o.first_name} ${o.last_name || ""}` : o.customer_name || o.customer || "Customer"}
                      </p>
                      <p className="text-[10px] text-[#6e6e6e] mt-0.5 font-light truncate max-w-64">
                        {o.shipping_address || o.address || "Standard Delivery"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${payStatusColor(o.payment_status || "Paid")}`}>
                      {o.payment_status || "Paid"}
                    </span>
                    <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${orderStatusColor(currentStatus)}`}>
                      {currentStatus}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-48">
                    <img src={itemImg} alt="" className="w-10 h-12 object-cover bg-[#faf7f4] flex-shrink-0 border border-[#ececec]" />
                    <div>
                      <p className="text-xs font-medium text-[#1a1a1a]">{firstItem.product_name || o.product || "Product Item"}</p>
                      <p className="text-[10px] text-[#6e6e6e] mt-0.5">
                        Qty: {firstItem.quantity || o.qty || 1} · {fmt(Number(o.subtotal || o.amount || 0))}
                        {items.length > 1 && <span className="ml-2 text-[#d4145a] font-medium">+{items.length - 1} more items</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleViewDetails(o.id)}
                      className="flex items-center gap-1 px-3 py-2 border border-[#ececec] text-[9px] tracking-[0.1em] uppercase text-[#1a1a1a] hover:border-[#d4145a] hover:text-[#d4145a] transition-colors"
                    >
                      <Eye size={12} />
                      View
                    </button>

                    <button
                      onClick={() => handleDownloadInvoice(o.id)}
                      className="flex items-center gap-1.5 px-3 py-2 border border-[#ececec] text-[9px] tracking-[0.1em] uppercase text-[#6e6e6e] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
                    >
                      <Printer size={11} strokeWidth={1.5} />
                      Invoice
                    </button>

                    {nextStatus && currentStatus !== "cancelled" && currentStatus !== "delivered" && (
                      <button
                        disabled={updatingId === o.id}
                        onClick={() => handleUpdateStatus(o.id, nextStatus)}
                        className="px-4 py-2 bg-[#1a1a1a] text-white text-[9px] tracking-[0.12em] uppercase hover:bg-[#d4145a] transition-colors font-semibold disabled:opacity-50"
                      >
                        {updatingId === o.id ? "Updating…" : `Mark ${nextStatus.replace(/_/g, " ")}`}
                      </button>
                    )}
                  </div>
                </div>

                {(o.tracking_number || o.courier_name) && (
                  <div className="mt-3 pt-3 border-t border-[#ececec] flex items-center gap-2">
                    <span className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e]">Tracking:</span>
                    <span className="text-[10px] font-mono text-[#d4145a] font-semibold">{o.tracking_number}</span>
                    <span className="text-[9px] text-[#9e9e9e]">via {o.courier_name || "Express Courier"}</span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-[#ececec] py-16 text-center">
            <p className="text-xs text-[#9e9e9e] tracking-wide">No {filter.toLowerCase()} orders found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5 px-4 py-3 bg-white border border-[#ececec]">
          <span className="text-[10px] text-[#6e6e6e] uppercase tracking-wide">Page {page} of {totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="p-1.5 border border-[#ececec] text-[#6e6e6e] disabled:opacity-40 hover:border-[#d4145a] hover:text-[#d4145a]"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 border border-[#ececec] text-[#6e6e6e] disabled:opacity-40 hover:border-[#d4145a] hover:text-[#d4145a]"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl p-6 md:p-8 relative shadow-2xl space-y-6 my-8">
            <button onClick={() => setDetailOrder(null)} className="absolute top-4 right-4 text-[#6e6e6e] hover:text-[#1a1a1a]">
              <X size={18} />
            </button>

            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Sub-Order Details</span>
              <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a1a] mt-1">
                {detailOrder.order_number || `#ORD-${detailOrder.id}`}
              </h3>
              <p className="text-xs text-[#9e9e9e] mt-1">Placed on {detailOrder.created_at ? new Date(detailOrder.created_at).toLocaleString() : "N/A"}</p>
            </div>

            {/* Status overview */}
            <div className="bg-[#faf7f4] p-4 border border-[#ececec] flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#9e9e9e]">Current Status</span>
                <p className="text-sm font-bold uppercase text-[#1a1a1a]">{detailOrder.order_status || detailOrder.status}</p>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#9e9e9e]">Payment</span>
                <p className="text-sm font-bold text-green-700">{detailOrder.payment_status || "Paid"}</p>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#9e9e9e]">Seller Amount</span>
                <p className="text-sm font-bold text-[#d4145a]">{fmt(Number(detailOrder.seller_amount || detailOrder.subtotal || 0))}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1a1a1a] mb-3 pb-2 border-b border-[#ececec]">Order Items</h4>
              <div className="space-y-3">
                {(detailOrder.items || detailOrder.order_items || []).map((it: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 py-2 border-b border-[#f0f0f0]">
                    <img src={formatImageUrl(it.product_image || it.image)} alt="" className="w-12 h-14 object-cover border border-[#ececec]" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#1a1a1a]">{it.product_name || "Product Item"}</p>
                      <p className="text-[10px] text-[#9e9e9e]">Qty: {it.quantity || 1} · Unit Price: {fmt(Number(it.unit_price || it.price || 0))}</p>
                    </div>
                    <p className="text-xs font-bold text-[#1a1a1a]">{fmt(Number(it.total_price || (it.quantity * it.price) || 0))}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            {timelineHistory.length > 0 && (
              <div>
                <h4 className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1a1a1a] mb-3 pb-2 border-b border-[#ececec]">Order Timeline History</h4>
                <div className="space-y-2">
                  {timelineHistory.map((h: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <Clock size={12} className="text-[#d4145a]" />
                      <span className="font-semibold uppercase text-[#1a1a1a]">{h.status}</span>
                      <span className="text-[#9e9e9e] text-[10px]">{h.created_at ? new Date(h.created_at).toLocaleString() : ""}</span>
                      {h.notes && <span className="text-[#6e6e6e] text-[10px]">— {h.notes}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end gap-3 border-t border-[#ececec]">
              <button onClick={() => handleDownloadInvoice(detailOrder.id)} className="px-5 py-2.5 border border-[#ececec] text-xs uppercase tracking-wider text-[#1a1a1a] hover:border-[#d4145a] hover:text-[#d4145a]">
                Print Invoice
              </button>
              <button onClick={() => setDetailOrder(null)} className="px-6 py-2.5 bg-[#1a1a1a] text-white text-xs uppercase tracking-wider">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
