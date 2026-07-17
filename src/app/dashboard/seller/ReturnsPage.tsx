import { useState } from "react";
import { SELLER_RETURNS, fmt } from "./sellerData";

const statusStyle = (s: string) => {
  if (s === "Requested") return "bg-amber-50 text-amber-700";
  if (s === "Approved")  return "bg-blue-50 text-blue-700";
  if (s === "Completed") return "bg-green-50 text-green-700";
  if (s === "Rejected")  return "bg-red-50 text-red-700";
  return "bg-gray-50 text-gray-500";
};

export default function ReturnsPage() {
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(SELLER_RETURNS.map(r => [r.id, r.status]))
  );

  const update = (id: string, val: string) =>
    setStatuses(prev => ({ ...prev, [id]: val }));

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Returns</h2>
      </div>

      <div className="space-y-4">
        {SELLER_RETURNS.map(ret => {
          const currentStatus = statuses[ret.id];
          return (
            <div key={ret.id} className="bg-white border border-[#ececec] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-[#ececec]">
                <div className="flex items-center gap-4">
                  <img src={ret.img} alt={ret.product} className="w-10 h-12 object-cover bg-[#faf7f4] flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-[#d4145a]">{ret.id}</p>
                      <span className="text-[9px] text-[#9e9e9e]">·</span>
                      <p className="text-[10px] text-[#9e9e9e]">{ret.orderId}</p>
                    </div>
                    <p className="text-xs font-medium text-[#1a1a1a] mt-0.5">{ret.product}</p>
                    <p className="text-[10px] text-[#6e6e6e] mt-0.5">{ret.customer} · {ret.date}</p>
                  </div>
                </div>
                <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${statusStyle(currentStatus)}`}>
                  {currentStatus}
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] mb-1">Reason</p>
                  <p className="text-xs text-[#1a1a1a] font-medium">{ret.reason}</p>
                </div>
                <div>
                  <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] mb-1">Refund Amount</p>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{fmt(ret.amount)}</p>
                </div>
                <div>
                  <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] mb-1">Refund Status</p>
                  <p className="text-xs text-[#6e6e6e]">
                    {currentStatus === "Completed" ? "Refunded" :
                     currentStatus === "Rejected"  ? "Not Refunded" :
                     currentStatus === "Approved"  ? "Processing" : "Pending"}
                  </p>
                </div>
              </div>

              {currentStatus === "Requested" && (
                <div className="flex items-center gap-2 pt-3 border-t border-[#ececec]">
                  <button
                    onClick={() => update(ret.id, "Approved")}
                    className="px-5 py-2 bg-[#1a1a1a] text-white text-[9px] tracking-[0.12em] uppercase hover:bg-green-700 transition-colors font-semibold"
                  >
                    Approve Return
                  </button>
                  <button
                    onClick={() => update(ret.id, "Rejected")}
                    className="px-5 py-2 border border-[#ececec] text-[#6e6e6e] text-[9px] tracking-[0.12em] uppercase hover:border-red-400 hover:text-red-600 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
              {currentStatus === "Approved" && (
                <div className="pt-3 border-t border-[#ececec]">
                  <button
                    onClick={() => update(ret.id, "Completed")}
                    className="px-5 py-2 bg-green-600 text-white text-[9px] tracking-[0.12em] uppercase hover:bg-green-700 transition-colors font-semibold"
                  >
                    Mark Refunded
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
