import { useState, useEffect } from "react";
import { Download, RefreshCw, FileText, CheckCircle, Truck, Package, XCircle } from "lucide-react";
import { orderStatusColor, payStatusColor, fmt } from "./adminData";
import { adminService } from "../../services/admin.service";
import { orderService } from "../../services/order.service";
import { invoiceService } from "../../services/invoice.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";

const TABS = ["All", "Pending", "Confirmed", "Processing", "Packed", "Shipped", "Delivered", "Cancelled"] as const;

export default function AdminOrders() {
  const [tab, setTab] = useState<typeof TABS[number]>("All");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { limit: 50 };
      if (tab !== "All") params.order_status = tab.toLowerCase();

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

  const handleUpdateStatus = async (orderId: string | number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      if (newStatus === "cancelled") {
        await orderService.cancelOrder(orderId, "Cancelled by Admin");
      } else {
        await orderService.updateOrderStatus(orderId, newStatus, `Status updated to ${newStatus} by Admin`);
      }
      toast.success(`Order status updated to ${newStatus.replace(/_/g, " ")}.`);
      fetchOrders();
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to update order status.");
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleGenerateInvoice = async (orderId: string | number) => {
    try {
      toast.info("Generating invoice...");
      const invoice = await invoiceService.generateInvoice(orderId);
      toast.success("Invoice ready!");
      if (invoice?.id) {
        window.open(`/customer/invoices/${invoice.id}`, "_blank");
      }
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to generate invoice.");
      toast.error(msg);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Orders Management</h2>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-white border border-[#ececec] text-xs font-medium text-[#1a1a1a] hover:bg-[#faf7f4] flex items-center gap-2"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Orders
        </button>
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
        <div className="space-y-4">
          {orders.map((o) => {
            const orderNum = o.order_number || `ORD-${o.id}`;
            const orderStatus = o.order_status || o.status || "pending";
            const payStatus = o.payment_status || "pending";
            const orderTotal = Number(o.grand_total ?? o.total_amount ?? o.amount ?? o.subtotal ?? 0);
            const customerName = `${o.first_name || ""} ${o.last_name || ""}`.trim() || o.customer_name || o.email || "Customer";
            const sellerName = o.seller_name || o.store_name || "Mandola Vendor";
            const rawDate = o.created_at || o.placed_at || o.date;
            const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
            const isUpdating = updatingId === o.id;

            return (
              <div key={o.id} className="bg-white border border-[#ececec] p-5 rounded-sm shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3 pb-3 border-b border-[#ececec]">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[#d4145a]">{orderNum}</p>
                      <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-0.5 font-semibold ${payStatusColor(payStatus)}`}>{payStatus}</span>
                      <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-0.5 font-semibold ${orderStatusColor(orderStatus)}`}>{orderStatus}</span>
                    </div>
                    <p className="text-xs text-[#6e6e6e] mt-1">
                      Customer: <strong className="text-[#1a1a1a]">{customerName}</strong> ({o.customer_email || o.customer_phone || "N/A"}) · Seller: <strong className="text-[#1a1a1a]">{sellerName}</strong>
                    </p>
                    {o.address_line_1 && (
                      <p className="text-[11px] text-[#9e9e9e] mt-0.5">
                        Address: {o.address_line_1}, {o.city}, {o.state} - {o.pincode}
                      </p>
                    )}
                    <p className="text-[10px] text-[#9e9e9e] mt-0.5">Placed on {formattedDate}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] uppercase text-[#9e9e9e] tracking-wide">Total Order Amount</p>
                    <p className="text-lg font-bold text-[#1a1a1a]">{fmt(orderTotal)}</p>
                  </div>
                </div>

                {/* Items preview */}
                {o.items && o.items.length > 0 && (
                  <div className="mb-4 space-y-2 bg-[#faf7f4] p-3 border border-[#ececec]">
                    {o.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-[#1a1a1a]">
                        <span>{item.product_name || item.name} {item.size ? `(${item.size})` : ""} × {item.quantity || 1}</span>
                        <span className="font-semibold">{fmt(Number(item.price || item.total || 0) * Number(item.quantity || 1))}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#6e6e6e] font-medium">Update Status:</span>
                    <select
                      disabled={isUpdating || orderStatus === "cancelled" || orderStatus === "delivered"}
                      value={orderStatus}
                      onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                      className="text-xs border border-[#ececec] px-3 py-1.5 bg-white text-[#1a1a1a] font-medium rounded-sm focus:outline-none focus:border-[#d4145a]"
                    >
                      <option value="pending" disabled={orderStatus !== "pending"}>Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="packed">Packed</option>
                      <option value="shipped">Shipped</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleGenerateInvoice(o.id)}
                      className="px-3 py-1.5 text-xs border border-[#ececec] bg-white text-[#1a1a1a] hover:bg-[#faf7f4] flex items-center gap-1 font-medium"
                    >
                      <FileText size={14} className="text-[#d4145a]" /> Invoice
                    </button>

                    {orderStatus !== "cancelled" && orderStatus !== "delivered" && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(o.id, "cancelled")}
                        className="px-3 py-1.5 text-xs bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 flex items-center gap-1 font-medium"
                      >
                        <XCircle size={14} /> Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {orders.length === 0 && (
            <div className="bg-white border border-[#ececec] py-16 text-center">
              <p className="text-xs text-[#9e9e9e]">No {tab.toLowerCase()} orders found in the database.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
