import { useState, useEffect } from "react";
import { Download, RefreshCw, Eye, X } from "lucide-react";
import { fmt } from "./sellerData";
import { sellerService } from "../../services/seller.service";
import { SellerSettlement } from "../../types/seller.types";

const settlementStyle = (s?: string) => {
  const status = (s || "").toLowerCase();
  if (status === "paid" || status === "completed") return "bg-green-50 text-green-700";
  if (status === "processing" || status === "approved") return "bg-blue-50 text-blue-700";
  if (status === "pending") return "bg-amber-50 text-amber-700";
  return "bg-gray-50 text-gray-500";
};

export default function PaymentsPage() {
  const [settlements, setSettlements] = useState<SellerSettlement[]>([]);
  const [revenueStats, setRevenueStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<SellerSettlement | null>(null);

  const fetchFinanceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [revRes, setRes] = await Promise.allSettled([
        sellerService.getRevenue(),
        sellerService.getSettlements()
      ]);

      if (revRes.status === "fulfilled" && revRes.value) {
        setRevenueStats(revRes.value.data || revRes.value);
      }

      if (setRes.status === "fulfilled" && setRes.value) {
        const data = setRes.value.data || setRes.value;
        const items = Array.isArray(data) ? data : data.settlements || data.items || [];
        setSettlements(items);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch settlements and payment data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const totalEarnings = Number(revenueStats.net_earnings || revenueStats.total_revenue || 0);
  const pendingSettlement = Number(revenueStats.pending_settlement || 0);
  const paidSettlement = Number(revenueStats.paid_settlement || (totalEarnings - pendingSettlement));
  const totalRevenue = Number(revenueStats.total_revenue || 0);

  const handleExportStatement = () => {
    if (settlements.length === 0) return;
    const headers = ["Settlement #", "Period", "Orders", "Gross Sales", "Platform Fee", "Net Payout", "Status"];
    const rows = settlements.map((s: any) => [
      s.settlement_number || `SET-${s.id}`,
      s.period || "Monthly",
      s.orders_count || 1,
      s.gross_amount || 0,
      s.commission_amount || s.platform_fees || 0,
      s.net_settlement_amount || s.net_amount || 0,
      s.status || "pending",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "seller_statement.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="font-['Jost',sans-serif]">
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Finance & Payouts</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Payments & Settlements</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs mb-5 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchFinanceData} className="flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase font-semibold underline">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* Financial Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Net Earnings",        value: fmt(totalEarnings),     accent: true  },
          { label: "Pending Settlement",  value: fmt(pendingSettlement), accent: false },
          { label: "Paid Settlements",   value: fmt(paidSettlement),    accent: false },
          { label: "Gross Sales Revenue", value: fmt(totalRevenue),      accent: false },
        ].map(c => (
          <div key={c.label} className={`bg-white border border-[#ececec] p-5 ${c.accent ? "border-l-2 border-l-[#d4145a]" : ""}`}>
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-2">{c.label}</p>
            {loading ? (
              <div className="h-6 w-20 bg-gray-100 animate-pulse rounded" />
            ) : (
              <p className={`text-xl font-bold font-['Playfair_Display'] ${c.accent ? "text-[#d4145a]" : "text-[#1a1a1a]"}`}>{c.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Settlement History Table */}
      <div className="bg-white border border-[#ececec]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#ececec]">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Settlement Payouts</p>
            <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">History ({settlements.length})</p>
          </div>
          <button
            onClick={handleExportStatement}
            className="flex items-center gap-1.5 px-4 py-2 border border-[#ececec] text-[9px] tracking-[0.12em] uppercase text-[#6e6e6e] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
          >
            <Download size={12} strokeWidth={1.5} />
            Statement
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="border-b border-[#ececec]">
                {["Settlement #", "Period", "Orders", "Gross Sales", "Platform Fee", "Net Payout", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#ececec]">
                    <td colSpan={8} className="px-4 py-3">
                      <div className="h-6 bg-gray-100 animate-pulse rounded" />
                    </td>
                  </tr>
                ))
              ) : settlements.length > 0 ? (
                settlements.map((s: any) => {
                  const sId = s.settlement_number || `#SET-${s.id}`;
                  const grossVal = Number(s.gross_amount || s.gross || 0);
                  const feeVal = Number(s.platform_fees || s.commission || s.fees || 0);
                  const netVal = Number(s.net_amount || s.net || (grossVal - feeVal));
                  const statusStr = s.status || s.settlement_status || "pending";

                  return (
                    <tr key={s.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                      <td className="px-4 py-3 text-xs font-semibold text-[#d4145a]">{sId}</td>
                      <td className="px-4 py-3 text-xs text-[#1a1a1a]">{s.period || s.payout_period || "Monthly Cycle"}</td>
                      <td className="px-4 py-3 text-xs text-[#6e6e6e]">{s.orders_count || s.orders || 1}</td>
                      <td className="px-4 py-3 text-xs font-medium text-[#1a1a1a]">{fmt(grossVal)}</td>
                      <td className="px-4 py-3 text-xs text-red-500">-{fmt(feeVal)}</td>
                      <td className="px-4 py-3 text-xs font-bold text-green-700">{fmt(netVal)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${settlementStyle(statusStr)}`}>
                          {statusStr}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setDetailItem(s)} className="p-1.5 text-[#6e6e6e] hover:text-[#d4145a] transition-colors" title="View Breakdown">
                          <Eye size={13} strokeWidth={1.5} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#9e9e9e] tracking-wide">No settlement records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white w-full max-w-md p-6 relative shadow-2xl space-y-4">
            <button onClick={() => setDetailItem(null)} className="absolute top-4 right-4 text-[#6e6e6e] hover:text-[#1a1a1a]">
              <X size={16} />
            </button>
            <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a]">
              Settlement Details {detailItem.settlement_number || `#SET-${detailItem.id}`}
            </h3>
            <div className="space-y-2 text-xs divide-y divide-[#ececec]">
              <div className="py-2 flex justify-between">
                <span className="text-[#9e9e9e]">Gross Sales Amount:</span>
                <span className="font-semibold">{fmt(Number(detailItem.gross_amount || 0))}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#9e9e9e]">Platform Commission Fee:</span>
                <span className="font-semibold text-red-500">-{fmt(Number(detailItem.platform_fees || 0))}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#9e9e9e]">Net Amount Credited:</span>
                <span className="font-bold text-green-700 text-sm">{fmt(Number(detailItem.net_amount || 0))}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#9e9e9e]">Payout Status:</span>
                <span className="font-semibold capitalize">{detailItem.status}</span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button onClick={() => setDetailItem(null)} className="px-5 py-2 bg-[#1a1a1a] text-white text-[10px] tracking-[0.15em] uppercase">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
