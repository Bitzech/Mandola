import { useState, useEffect } from "react";
import { fmt } from "./adminData";
import { adminService } from "../../services/admin.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

const statusStyle = (s: string) => {
  const lower = (s || "").toLowerCase();
  if (lower === "requested" || lower === "pending") return "bg-amber-50 text-amber-700";
  if (lower === "approved")  return "bg-blue-50 text-blue-700";
  if (lower === "completed" || lower === "refunded") return "bg-green-50 text-green-700";
  if (lower === "rejected")  return "bg-red-50 text-red-600";
  return "bg-gray-50 text-gray-600";
};

export default function ReturnsRefunds() {
  const [returnsList, setReturnsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  const fetchReturns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await adminService.getReturns({ limit: 50 });
      const rawData = response.data || response;
      const itemsList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];
      setReturnsList(itemsList);
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load return requests.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleUpdateStatus = async (id: string | number, nextStatus: string) => {
    setUpdatingId(id);
    try {
      await adminService.updateReturnStatus(id, nextStatus.toLowerCase());
      toast.success(`Return request status updated to ${nextStatus}.`);
      setReturnsList((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: nextStatus.toLowerCase() } : r))
      );
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to update return request status."));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Returns & Refunds</h2>
      </div>

      {loading ? (
        <div className="bg-white border border-[#ececec] p-12 text-center animate-pulse">
          <p className="text-xs text-[#9e9e9e] uppercase tracking-widest">Loading return requests…</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-12 text-center">
          <p className="text-sm text-red-600 font-light mb-4">{error}</p>
          <button onClick={fetchReturns} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry Loading
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {returnsList.map((r) => {
            const retId = `RET-${r.id}`;
            const orderNum = r.order_number || (r.order_id ? `ORD-${r.order_id}` : "—");
            const statusRaw = (r.status || "requested").toLowerCase();
            const statusFormatted = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);
            const customerName = `${r.first_name || ""} ${r.last_name || ""}`.trim() || r.customer_name || r.email || "Customer";
            const productName = r.product_name || r.product || "Returned Product";
            const sellerName = r.seller_name || r.store_name || "Mandola Seller";
            const amount = r.refund_amount || r.amount || 0;
            const isUpdating = updatingId === r.id;
            const retImg = r.thumbnail || r.product_image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=120&fit=crop";

            return (
              <div key={r.id} className="bg-white border border-[#ececec] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-[#ececec]">
                  <div className="flex items-center gap-4">
                    <img src={retImg} alt={productName} className="w-10 h-12 object-cover bg-[#faf7f4] flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-[#d4145a]">{retId}</p>
                        <span className="text-[9px] text-[#9e9e9e]">·</span>
                        <p className="text-[10px] text-[#9e9e9e]">{orderNum}</p>
                      </div>
                      <p className="text-xs font-medium text-[#1a1a1a] mt-0.5">{productName}</p>
                      <p className="text-[10px] text-[#6e6e6e] mt-0.5">Customer: {customerName} · Seller: {sellerName}</p>
                      <p className="text-[10px] text-[#6e6e6e]">Reason: {r.reason || r.return_reason || "Size Issue"} · {r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${statusStyle(statusFormatted)}`}>{statusFormatted}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[9px] uppercase text-[#9e9e9e] tracking-wide">Refund Amount</p>
                    <p className="text-sm font-bold text-[#1a1a1a]">{fmt(amount)}</p>
                  </div>
                  {(statusRaw === "requested" || statusRaw === "pending") && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(r.id, "approved")}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-green-600 text-white text-[9px] tracking-[0.12em] uppercase hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                      >
                        {isUpdating ? <RefreshCw size={11} className="animate-spin" /> : null} Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(r.id, "rejected")}
                        disabled={isUpdating}
                        className="px-4 py-2 border border-red-200 text-red-600 text-[9px] tracking-[0.12em] uppercase hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {statusRaw === "approved" && (
                    <button
                      onClick={() => handleUpdateStatus(r.id, "completed")}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-[#d4145a] text-white text-[9px] tracking-[0.12em] uppercase hover:bg-[#b8114d] transition-colors font-semibold disabled:opacity-50 flex items-center gap-2"
                    >
                      {isUpdating ? <RefreshCw size={11} className="animate-spin" /> : null} Process Refund
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {returnsList.length === 0 && (
            <div className="bg-white border border-[#ececec] py-16 text-center">
              <p className="text-xs text-[#9e9e9e]">No return requests found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
