import { useState, useEffect } from "react";
import { Download, FileText, RefreshCw, Search } from "lucide-react";
import { fmt } from "./sellerData";
import { invoiceService } from "../../services/invoice.service";
import { formatImageUrl } from "../../utils/imageUrl";

export default function SellerInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { limit: 50 };
      if (search.trim()) params.search = search.trim();

      const res = await invoiceService.getInvoices(params);
      const resData = (res?.data || res) as any;
      if (Array.isArray(resData)) {
        setInvoices(resData);
      } else if (resData && Array.isArray(resData.invoices)) {
        setInvoices(resData.invoices);
      } else if (resData && Array.isArray(resData.items)) {
        setInvoices(resData.items);
      } else {
        setInvoices([]);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load seller invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownload = async (invId: string | number) => {
    try {
      const res: any = await invoiceService.downloadInvoice(invId);
      const rawUrl = res.data?.pdf_url || res.data?.url || res.url;
      const downloadUrl = rawUrl ? formatImageUrl(rawUrl) : "";
      if (downloadUrl) {
        window.open(downloadUrl, "_blank");
      } else {
        window.print();
      }
    } catch {
      window.print();
    }
  };

  return (
    <div className="font-['Jost',sans-serif]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Tax & Billing Documents</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Invoices ({invoices.length})</h2>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e9e9e]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") fetchInvoices(); }}
            placeholder="Search invoice # or order #…"
            className="w-full border border-[#ececec] pl-9 pr-4 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs mb-5 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchInvoices} className="flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase font-semibold underline">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      <div className="bg-white border border-[#ececec] overflow-x-auto">
        <table className="w-full min-w-[550px]">
          <thead>
            <tr className="border-b border-[#ececec]">
              {["Invoice #", "Order #", "Customer", "Amount", "Date", "Status", "Download"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-[#ececec]">
                  <td colSpan={7} className="px-5 py-4">
                    <div className="h-6 bg-gray-100 animate-pulse rounded" />
                  </td>
                </tr>
              ))
            ) : invoices.length > 0 ? (
              invoices.map(inv => {
                const invNo = inv.invoice_number || `#INV-${inv.id}`;
                const orderNo = inv.order_number || `#ORD-${inv.order_id || inv.id}`;
                const amountVal = Number(inv.total_amount || inv.amount || 0);

                return (
                  <tr key={inv.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <FileText size={14} strokeWidth={1.5} className="text-[#d4145a] flex-shrink-0" />
                        <span className="text-xs font-semibold text-[#d4145a]">{invNo}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#6e6e6e] font-mono">{orderNo}</td>
                    <td className="px-5 py-4 text-xs font-medium text-[#1a1a1a]">{inv.customer_name || inv.customer || "Customer"}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-[#1a1a1a]">{fmt(amountVal)}</td>
                    <td className="px-5 py-4 text-xs text-[#6e6e6e]">
                      {inv.created_at ? new Date(inv.created_at).toLocaleDateString() : inv.date || "Recent"}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${(inv.status || "Paid").toLowerCase() === "paid" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                        {inv.status || "Paid"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleDownload(inv.id)} className="flex items-center gap-1.5 text-[10px] tracking-[0.1em] uppercase text-[#d4145a] hover:underline font-semibold">
                        <Download size={11} strokeWidth={2} />
                        PDF
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs text-[#9e9e9e] tracking-wide">No billing invoices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
