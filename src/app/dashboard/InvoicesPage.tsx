import { useState, useEffect } from "react";
import { Download, FileText, RefreshCw } from "lucide-react";
import { deliveryStatusColor, paymentStatusColor } from "./dashboardData";
import type { NavigateFn } from "./dashboardData";
import { invoiceService } from "../services/invoice.service";
import { orderService } from "../services/order.service";
import { extractErrorMessage } from "../utils/errorExtractor";
import { formatImageUrl } from "../utils/imageUrl";
import { toast } from "sonner";

export default function InvoicesPage({ onNavigate }: { onNavigate: NavigateFn }) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const [invRes, orderRes] = await Promise.allSettled([
        invoiceService.getInvoices(),
        orderService.getOrders({ limit: 50 }),
      ]);

      let combinedInvoices: any[] = [];

      if (invRes.status === "fulfilled") {
        const rawInv = (invRes.value?.data || invRes.value) as any;
        const invList = Array.isArray(rawInv) ? rawInv : (rawInv?.items || rawInv?.invoices || rawInv?.data || []);
        if (invList.length > 0) {
          combinedInvoices = invList;
        }
      }

      // If invoices endpoint returned empty, fallback to paid orders list
      if (combinedInvoices.length === 0 && orderRes.status === "fulfilled") {
        const rawOrders = (orderRes.value?.data || orderRes.value) as any;
        const orderList = Array.isArray(rawOrders) ? rawOrders : (rawOrders?.items || rawOrders?.orders || rawOrders?.data || []);
        if (orderList.length > 0) {
          combinedInvoices = orderList.filter(
            (o: any) => (o.payment_status || o.paymentStatus || "").toLowerCase() === "paid"
          );
        }
      }

      setInvoices(combinedInvoices);
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load invoices.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownload = async (item: any) => {
    const id = item.id || item.invoice_id || item.order_number || item.order_id;
    setDownloadingId(id);
    try {
      const res = await invoiceService.downloadInvoice(id);
      const rawUrl = res.data?.pdf_url || res.data?.url || res.url;
      const url = rawUrl ? formatImageUrl(rawUrl) : "";
      if (url) {
        window.open(url, "_blank");
        toast.success("Downloading invoice PDF...");
      } else {
        toast.info("Invoice document generated. Downloading file...");
      }
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Unable to download PDF. Opening invoice preview."));
    } finally {
      setDownloadingId(null);
    }
  };

  const formatCurrency = (val: number | string) => {
    const num = Number(val) || 0;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  return (
    <div>
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Documents</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Download Invoices</h2>
        <p className="text-sm text-[#6e6e6e] font-light mt-1">{invoices.length} invoice{invoices.length !== 1 ? "s" : ""} available</p>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-[#ececec] p-5 h-24 bg-slate-50" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-16 text-center">
          <p className="text-sm text-red-600 font-light mb-4">{error}</p>
          <button onClick={fetchInvoices} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry Loading
          </button>
        </div>
      ) : invoices.length === 0 ? (
        <div className="bg-white border border-[#ececec] p-16 text-center">
          <FileText size={48} className="text-[#ececec] mx-auto mb-4" strokeWidth={1} />
          <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a]">No invoices available</p>
          <p className="text-sm text-[#6e6e6e] font-light mt-1">Invoices will appear here once your orders are completed and paid.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((item) => {
            const invId = item.invoice_number || item.id || item.order_number || `MND-${item.id}`;
            const payStatus = item.payment_status || item.paymentStatus || "Paid";
            const delStatus = item.delivery_status || item.deliveryStatus || item.status || "Delivered";
            const invDate = item.created_at ? new Date(item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : item.date || "Today";
            const totalAmt = item.grand_total || item.amount || item.total_amount || 0;
            const itemsList = item.items || item.order_items || [];
            const itemsSummary = itemsList.map((i: any) => i.product_name || i.name).join(", ") || "Order Package";

            const isDownloading = downloadingId === (item.id || item.invoice_id || item.order_number);

            return (
              <div key={item.id || invId} className="bg-white border border-[#ececec] p-5">
                <div className="flex items-center gap-4">
                  {/* Invoice icon */}
                  <div className="w-12 h-12 bg-[#faf7f4] flex items-center justify-center flex-shrink-0">
                    <FileText size={22} strokeWidth={1.5} className="text-[#d4145a]" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-[#1a1a1a]">Invoice #{invId}</p>
                      <span className={`text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 ${paymentStatusColor(payStatus)}`}>
                        {payStatus}
                      </span>
                      <span className={`text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 ${deliveryStatusColor(delStatus)}`}>
                        {delStatus}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-0.5">
                      <span className="text-[10px] text-[#6e6e6e] tracking-wide">Date: {invDate}</span>
                      <span className="text-[10px] text-[#6e6e6e] tracking-wide truncate max-w-xs">
                        Items: {itemsSummary}
                      </span>
                      <span className="text-[10px] font-semibold text-[#1a1a1a] tracking-wide">
                        {formatCurrency(totalAmt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onNavigate("order-details", String(item.order_id || item.id || invId))}
                      className="hidden sm:block text-[10px] tracking-[0.15em] uppercase border border-[#ececec] px-3 py-2 text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a] transition-colors"
                    >
                      View
                    </button>
                    <button
                      disabled={isDownloading}
                      onClick={() => handleDownload(item)}
                      className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase bg-[#1a1a1a] text-white px-4 py-2 hover:bg-[#d4145a] transition-colors disabled:opacity-50"
                    >
                      {isDownloading ? <RefreshCw size={12} className="animate-spin" /> : <Download size={12} />}
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[10px] text-[#9e9e9e] tracking-wide mt-6 text-center">
        Invoices are generated for all paid orders. Downloads are in PDF format.
      </p>
    </div>
  );
}
