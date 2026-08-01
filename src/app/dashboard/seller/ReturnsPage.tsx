import { useState, useEffect } from "react";
import { apiClient } from "../../services/apiClient";
import { fmt } from "./sellerData";
import { RefreshCw, RotateCcw, Search } from "lucide-react";

const statusStyle = (s?: string) => {
  const status = (s || "").toLowerCase();
  if (status === "requested" || status === "pending") return "bg-amber-50 text-amber-700";
  if (status === "approved" || status === "processing") return "bg-blue-50 text-blue-700";
  if (status === "completed" || status === "refunded") return "bg-green-50 text-green-700";
  if (status === "rejected") return "bg-red-50 text-red-700";
  return "bg-gray-50 text-gray-500";
};

export default function ReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [search, setSearch] = useState("");

  const fetchReturns = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/returns", { params: { search: search.trim() } });
      const resData = res.data?.data || res.data;
      if (Array.isArray(resData)) {
        setReturns(resData);
      } else if (resData && Array.isArray(resData.returns)) {
        setReturns(resData.returns);
      } else if (resData && Array.isArray(resData.items)) {
        setReturns(resData.items);
      } else {
        setReturns([]);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch return requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleUpdateReturn = async (returnId: string | number, status: string) => {
    setUpdatingId(returnId);
    try {
      await apiClient.patch(`/returns/${returnId}/status`, { status });
      fetchReturns();
    } catch (err: any) {
      alert(err?.message || "Failed to update return request.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="font-['Jost',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Customer Requests</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Return Requests ({returns.length})</h2>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e9e9e]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") fetchReturns(); }}
            placeholder="Search return # or order #…"
            className="w-full border border-[#ececec] pl-9 pr-4 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs mb-5 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchReturns} className="flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase font-semibold underline">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#ececec] p-5 h-36 animate-pulse" />
          ))
        ) : returns.length > 0 ? (
          returns.map(ret => {
            const currentStatus = (ret.status || ret.return_status || "requested").toLowerCase();
            const refundAmount = Number(ret.refund_amount || ret.amount || 0);

            return (
              <div key={ret.id} className="bg-white border border-[#ececec] p-5 hover:border-[#c0c0c0] transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-[#ececec]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <RotateCcw size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-[#d4145a]">{ret.return_number || `#RET-${ret.id}`}</p>
                        <span className="text-[9px] text-[#9e9e9e]">·</span>
                        <p className="text-[10px] text-[#9e9e9e] font-mono">{ret.order_number || `#ORD-${ret.order_id}`}</p>
                      </div>
                      <p className="text-xs font-medium text-[#1a1a1a] mt-0.5">{ret.product_name || ret.product || "Returned Item"}</p>
                      <p className="text-[10px] text-[#6e6e6e] mt-0.5">
                        {ret.customer_name || ret.customer || "Customer"} · {ret.created_at ? new Date(ret.created_at).toLocaleDateString() : (ret.date || "Recent")}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${statusStyle(currentStatus)}`}>
                    {currentStatus}
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] mb-1">Return Reason</p>
                    <p className="text-xs text-[#1a1a1a] font-medium">{ret.reason || "Defective or Size issue"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] mb-1">Refund Amount</p>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{fmt(refundAmount)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] mb-1">Refund Status</p>
                    <p className="text-xs text-[#6e6e6e] capitalize">
                      {currentStatus === "completed" || currentStatus === "refunded" ? "Refunded" :
                       currentStatus === "rejected" ? "Not Refunded" :
                       currentStatus === "approved" ? "Processing Refund" : "Pending Approval"}
                    </p>
                  </div>
                </div>

                {currentStatus === "requested" || currentStatus === "pending" ? (
                  <div className="flex items-center gap-2 pt-3 border-t border-[#ececec]">
                    <button
                      disabled={updatingId === ret.id}
                      onClick={() => handleUpdateReturn(ret.id, "approved")}
                      className="px-5 py-2 bg-[#1a1a1a] text-white text-[9px] tracking-[0.12em] uppercase hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                    >
                      Approve Return
                    </button>
                    <button
                      disabled={updatingId === ret.id}
                      onClick={() => handleUpdateReturn(ret.id, "rejected")}
                      className="px-5 py-2 border border-[#ececec] text-[#6e6e6e] text-[9px] tracking-[0.12em] uppercase hover:border-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      Reject Request
                    </button>
                  </div>
                ) : currentStatus === "approved" ? (
                  <div className="pt-3 border-t border-[#ececec]">
                    <button
                      disabled={updatingId === ret.id}
                      onClick={() => handleUpdateReturn(ret.id, "completed")}
                      className="px-5 py-2 bg-green-600 text-white text-[9px] tracking-[0.12em] uppercase hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                    >
                      Mark Refund Completed
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-[#ececec] py-16 text-center">
            <p className="text-xs text-[#9e9e9e] tracking-wide">No customer return requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
