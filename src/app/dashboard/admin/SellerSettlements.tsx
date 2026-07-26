import { useState, useEffect } from "react";
import { fmt } from "./adminData";
import { adminService } from "../../services/admin.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

export default function SellerSettlements() {
  const [settlements, setSettlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  const fetchSettlements = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await adminService.getSettlements({ limit: 50 });
      const rawData = response.data || response;
      const itemsList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];
      setSettlements(itemsList);
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load settlement records.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  const handleProcessPayout = async (id: string | number) => {
    setUpdatingId(id);
    try {
      await adminService.updateSettlementStatus(id, "completed");
      toast.success("Settlement payout processed successfully.");
      setSettlements((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "completed" } : s))
      );
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to process settlement payout."));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Finance</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Seller Settlements</h2>
      </div>

      {loading ? (
        <div className="bg-white border border-[#ececec] p-12 text-center animate-pulse">
          <p className="text-xs text-[#9e9e9e] uppercase tracking-widest">Loading settlement data…</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-12 text-center">
          <p className="text-sm text-red-600 font-light mb-4">{error}</p>
          <button onClick={fetchSettlements} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry Loading
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {settlements.map((s) => {
            const stId = `SET-${s.id}`;
            const statusRaw = (s.status || "pending").toLowerCase();
            const statusFormatted = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);
            const sellerName = s.business_name || s.store_name || s.seller_name || `Seller #${s.seller_id || ""}`;
            const gross = s.gross_amount || s.total_sales || 0;
            const fee = s.commission_amount || s.fees || gross * 0.1;
            const net = s.net_amount || s.net_payout || gross - fee;
            const isUpdating = updatingId === s.id;

            return (
              <div key={s.id} className="bg-white border border-[#ececec] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-[#ececec]">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-[#d4145a]">{stId}</p>
                      <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${statusRaw === "completed" || statusRaw === "paid" ? "bg-green-50 text-green-700" : statusRaw === "processing" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>
                        {statusFormatted}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#1a1a1a] mt-1">{sellerName}</p>
                    <p className="text-[10px] text-[#6e6e6e] mt-0.5">{s.period || "Monthly Period"} · {s.orders_count || 1} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase text-[#9e9e9e] tracking-wide">Due Date</p>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{s.payout_date || s.created_at ? new Date(s.payout_date || s.created_at).toLocaleDateString() : "Immediate"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[["Gross Amount", fmt(gross)], ["Platform Fee", `-${fmt(fee)}`], ["Net Payout", fmt(net)]].map(([l, v]) => (
                    <div key={String(l)}>
                      <p className="text-[9px] uppercase text-[#9e9e9e] tracking-wide mb-1">{l}</p>
                      <p className={`text-sm font-bold ${String(l) === "Net Payout" ? "text-[#d4145a]" : String(l) === "Platform Fee" ? "text-red-500" : "text-[#1a1a1a]"}`}>{v}</p>
                    </div>
                  ))}
                </div>
                {statusRaw === "pending" && (
                  <button
                    onClick={() => handleProcessPayout(s.id)}
                    disabled={isUpdating}
                    className="px-5 py-2.5 bg-[#d4145a] text-white text-[9px] tracking-[0.15em] uppercase font-semibold hover:bg-[#b8114d] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isUpdating ? <RefreshCw size={12} className="animate-spin" /> : null} Pay Seller {fmt(net)}
                  </button>
                )}
              </div>
            );
          })}
          {settlements.length === 0 && (
            <div className="bg-white border border-[#ececec] py-16 text-center">
              <p className="text-xs text-[#9e9e9e]">No settlement records found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
