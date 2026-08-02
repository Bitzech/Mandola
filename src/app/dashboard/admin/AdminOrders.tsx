import { useState, useEffect } from "react";
import { Download, RefreshCw } from "lucide-react";
import { orderStatusColor, payStatusColor, fmt } from "./adminData";
import { adminService } from "../../services/admin.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";

const TABS = ["All", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"] as const;

export default function AdminOrders() {
  const [tab, setTab] = useState<typeof TABS[number]>("All");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { limit: 50 };
      if (tab !== "All") params.status = tab.toLowerCase();

      const response: any = await adminService.getOrders(params);
      const rawData = response.data || response;
      const itemsList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];
      setOrders(itemsList);
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load orders list.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [tab]);

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Orders</h2>
      </div>

      <div className="flex overflow-x-auto gap-1 mb-5 bg-white border border-[#ececec] p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-shrink-0 px-4 py-2 text-[10px] tracking-[0.12em] uppercase font-semibold transition-colors ${tab === t ? "bg-[#d4145a] text-white" : "text-[#6e6e6e] hover:text-[#1a1a1a]"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white border border-[#ececec] p-12 text-center animate-pulse">
          <p className="text-xs text-[#9e9e9e] uppercase tracking-widest">Loading orders data…</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-12 text-center">
          <p className="text-sm text-red-600 font-light mb-4">{error}</p>
          <button onClick={fetchOrders} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry Loading
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const orderNum = o.order_number || `ORD-${o.id}`;
            const orderStatus = o.order_status || o.status || "Pending";
            const payStatus = o.payment_status || "Paid";
            const orderTotal = Number(o.grand_total ?? o.total_amount ?? o.amount ?? o.subtotal ?? 0);
            const customerName = `${o.first_name || ""} ${o.last_name || ""}`.trim() || o.customer_name || o.email || "Customer";
            const sellerName = o.seller_name || o.store_name || "Mandola Seller";
            const itemImg = o.thumbnail || o.product_image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=120&fit=crop";
            const rawDate = o.created_at || o.placed_at || o.date;
            const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

            return (
              <div key={o.id} className="bg-white border border-[#ececec] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3 pb-3 border-b border-[#ececec]">
                  <div className="flex items-center gap-4">
                    <img src={itemImg} alt={orderNum} className="w-10 h-12 object-cover bg-[#faf7f4] flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#d4145a]">{orderNum}</p>
                      <p className="text-xs font-medium text-[#1a1a1a] mt-0.5">Order items ({o.items_count || 1})</p>
                      <p className="text-[10px] text-[#6e6e6e] mt-0.5">Customer: {customerName} · Seller: {sellerName}</p>
                      <p className="text-[10px] text-[#9e9e9e]">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${payStatusColor(payStatus)}`}>{payStatus}</span>
                    <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${orderStatusColor(orderStatus)}`}>{orderStatus}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[9px] uppercase text-[#9e9e9e] tracking-wide">Amount</p>
                      <p className="text-sm font-bold text-[#1a1a1a]">{fmt(orderTotal)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase text-[#9e9e9e] tracking-wide">Commission (Est)</p>
                      <p className="text-sm font-bold text-[#d4145a]">{fmt(orderTotal * 0.1)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {orders.length === 0 && (
            <div className="bg-white border border-[#ececec] py-16 text-center">
              <p className="text-xs text-[#9e9e9e]">No {tab.toLowerCase()} orders found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
