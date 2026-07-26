import { useState, useEffect } from "react";
import { Download, FileText, RefreshCw } from "lucide-react";
import { fmt } from "./adminData";
import { adminService } from "../../services/admin.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";

const REPORT_TYPES = [
  { label: "Sales Report",   desc: "Total sales by date, category, and seller",    color: "bg-blue-50 text-blue-700" },
  { label: "Revenue Report", desc: "Platform revenue and commission breakdown",     color: "bg-green-50 text-green-700" },
  { label: "Order Report",   desc: "Order status, fulfilment, and return rates",   color: "bg-purple-50 text-purple-700" },
  { label: "Seller Report",  desc: "Seller performance and settlement history",     color: "bg-amber-50 text-amber-700" },
  { label: "Product Report", desc: "Top products, inventory, and approval status", color: "bg-[#fce8ef] text-[#d4145a]" },
  { label: "Return Report",  desc: "Return requests, refunds, and resolution rate",color: "bg-red-50 text-red-600" },
];

export default function ReportsPage() {
  const [reportStats, setReportStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getDashboard();
      setReportStats(response.data || response);
    } catch (err: any) {
      setError(extractErrorMessage(err, "Failed to load platform reports."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDownloadReport = (label: string, format: string) => {
    toast.success(`Exporting ${label} (${format.toUpperCase()})...`);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-slate-200" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="bg-white border border-[#ececec] h-24 bg-slate-50" />)}
        </div>
      </div>
    );
  }

  if (error && !reportStats) {
    return (
      <div className="bg-white border border-[#ececec] p-12 text-center">
        <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a] mb-2">Reports Data Unavailable</p>
        <p className="text-sm text-[#6e6e6e] font-light mb-4">{error}</p>
        <button onClick={fetchReports} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
          <RefreshCw size={13} /> Retry Loading
        </button>
      </div>
    );
  }

  const payments = reportStats?.payments || {};
  const orders = reportStats?.orders || {};
  const totalRev = payments.total_revenue || 0;
  const totalOrdersCount = orders.total_orders || 0;
  const commEst = totalRev * 0.1;
  const avgOrderVal = totalOrdersCount > 0 ? Math.round(totalRev / totalOrdersCount) : 0;

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Analytics</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Reports</h2>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue",    value: fmt(totalRev) },
          { label: "Total Orders",     value: totalOrdersCount.toLocaleString() },
          { label: "Est Commission",   value: fmt(commEst) },
          { label: "Avg Order Value",  value: fmt(avgOrderVal) },
        ].map((c) => (
          <div key={c.label} className="bg-white border border-[#ececec] p-5">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-2">{c.label}</p>
            <p className="text-xl font-bold font-['Playfair_Display'] text-[#1a1a1a]">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Report cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {REPORT_TYPES.map((r) => (
          <div key={r.label} className="bg-white border border-[#ececec] p-5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-3 ${r.color}`}>
              <FileText size={16} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-semibold text-[#1a1a1a] mb-1">{r.label}</p>
            <p className="text-xs text-[#6e6e6e] font-light mb-4">{r.desc}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownloadReport(r.label, "pdf")}
                className="flex items-center gap-1.5 px-3 py-2 border border-[#ececec] text-[9px] tracking-[0.1em] uppercase text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a] transition-colors"
              >
                <Download size={10} strokeWidth={2} /> PDF
              </button>
              <button
                onClick={() => handleDownloadReport(r.label, "excel")}
                className="flex items-center gap-1.5 px-3 py-2 border border-[#ececec] text-[9px] tracking-[0.1em] uppercase text-[#6e6e6e] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
              >
                <Download size={10} strokeWidth={2} /> Excel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
