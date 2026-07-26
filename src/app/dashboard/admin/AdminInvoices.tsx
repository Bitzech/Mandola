import { useState, useEffect } from "react";
import { Download, FileText, RefreshCw } from "lucide-react";
import { fmt } from "./adminData";
import { invoiceService } from "../../services/invoice.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await invoiceService.getInvoices({ limit: 50 });
      const rawData = response.data || response;
      const itemsList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];
      setInvoices(itemsList);
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

  const handleDownload = async (id: string | number) => {
    try {
      await invoiceService.downloadInvoice(id);
      toast.success("Downloading invoice PDF...");
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to download invoice."));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Documents</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Invoices</h2>
      </div>

      {loading ? (
        <div className="bg-white border border-[#ececec] p-12 text-center animate-pulse">
          <p className="text-xs text-[#9e9e9e] uppercase tracking-widest">Loading invoice documents…</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-12 text-center">
          <p className="text-sm text-red-600 font-light mb-4">{error}</p>
          <button onClick={fetchInvoices} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry Loading
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#ececec] overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="border-b border-[#ececec]">
                {["Invoice #", "Order #", "Customer", "Seller", "Amount", "Date", "Action"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const invNumber = inv.invoice_number || `INV-${inv.id}`;
                const orderNumber = inv.order_number || (inv.order_id ? `ORD-${inv.order_id}` : "—");
                const customerName = `${inv.customer_first_name || ""} ${inv.customer_last_name || ""}`.trim() || inv.customer_name || "Customer";
                const sellerName = inv.seller_name || inv.store_name || "Mandola Seller";
                const amount = inv.total_amount || inv.grand_total || inv.amount || 0;
                const date = inv.created_at ? new Date(inv.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

                return (
                  <tr key={inv.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <FileText size={13} strokeWidth={1.5} className="text-[#d4145a] flex-shrink-0" />
                        <span className="text-xs font-semibold text-[#d4145a]">{invNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-[#6e6e6e]">{orderNumber}</td>
                    <td className="px-4 py-4 text-xs font-medium text-[#1a1a1a]">{customerName}</td>
                    <td className="px-4 py-4 text-xs text-[#6e6e6e]">{sellerName}</td>
                    <td className="px-4 py-4 text-xs font-semibold text-[#1a1a1a]">{fmt(amount)}</td>
                    <td className="px-4 py-4 text-xs text-[#6e6e6e]">{date}</td>
                    <td className="px-4 py-4">
                      <button onClick={() => handleDownload(inv.id)} className="flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase text-[#d4145a] hover:underline font-semibold">
                        <Download size={11} strokeWidth={2} /> PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {invoices.length === 0 && <div className="py-12 text-center text-xs text-[#9e9e9e]">No invoices found.</div>}
        </div>
      )}
    </div>
  );
}
