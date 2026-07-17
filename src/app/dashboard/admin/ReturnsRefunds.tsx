import { useState } from "react";
import { ADMIN_RETURNS, fmt } from "./adminData";

const statusStyle = (s: string) => {
  if (s === "Requested") return "bg-amber-50 text-amber-700";
  if (s === "Approved")  return "bg-blue-50 text-blue-700";
  if (s === "Completed") return "bg-green-50 text-green-700";
  if (s === "Rejected")  return "bg-red-50 text-red-600";
  return "";
};

export default function ReturnsRefunds() {
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(ADMIN_RETURNS.map(r => [r.id, r.status]))
  );
  const update = (id: string, val: string) => setStatuses(prev => ({ ...prev, [id]: val }));

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Returns & Refunds</h2>
      </div>

      <div className="space-y-4">
        {ADMIN_RETURNS.map(r => {
          const status = statuses[r.id];
          return (
            <div key={r.id} className="bg-white border border-[#ececec] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-[#ececec]">
                <div className="flex items-center gap-4">
                  <img src={r.img} alt={r.product} className="w-10 h-12 object-cover bg-[#faf7f4] flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-[#d4145a]">{r.id}</p>
                      <span className="text-[9px] text-[#9e9e9e]">·</span>
                      <p className="text-[10px] text-[#9e9e9e]">{r.orderId}</p>
                    </div>
                    <p className="text-xs font-medium text-[#1a1a1a] mt-0.5">{r.product}</p>
                    <p className="text-[10px] text-[#6e6e6e] mt-0.5">Customer: {r.customer} · Seller: {r.seller}</p>
                    <p className="text-[10px] text-[#6e6e6e]">Reason: {r.reason} · {r.date}</p>
                  </div>
                </div>
                <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${statusStyle(status)}`}>{status}</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[9px] uppercase text-[#9e9e9e] tracking-wide">Refund Amount</p>
                  <p className="text-sm font-bold text-[#1a1a1a]">{fmt(r.amount)}</p>
                </div>
                {status === "Requested" && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => update(r.id, "Approved")} className="px-4 py-2 bg-green-600 text-white text-[9px] tracking-[0.12em] uppercase hover:bg-green-700 transition-colors font-semibold">Approve</button>
                    <button onClick={() => update(r.id, "Rejected")} className="px-4 py-2 border border-red-200 text-red-600 text-[9px] tracking-[0.12em] uppercase hover:bg-red-50 transition-colors">Reject</button>
                  </div>
                )}
                {status === "Approved" && (
                  <button onClick={() => update(r.id, "Completed")} className="px-4 py-2 bg-[#d4145a] text-white text-[9px] tracking-[0.12em] uppercase hover:bg-[#b8114d] transition-colors font-semibold">Process Refund</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
