import { useState } from "react";
import { ADMIN_SETTLEMENTS, fmt } from "./adminData";

export default function SellerSettlements() {
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(ADMIN_SETTLEMENTS.map(s => [s.id, s.status]))
  );

  const pay = (id: string) => setStatuses(prev => ({ ...prev, [id]: "Completed" }));

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Finance</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Seller Settlements</h2>
      </div>

      <div className="space-y-4">
        {ADMIN_SETTLEMENTS.map(s => {
          const status = statuses[s.id];
          return (
            <div key={s.id} className="bg-white border border-[#ececec] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-[#ececec]">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-[#d4145a]">{s.id}</p>
                    <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${status === "Completed" ? "bg-green-50 text-green-700" : status === "Processing" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>{status}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a1a] mt-1">{s.seller}</p>
                  <p className="text-[10px] text-[#6e6e6e] mt-0.5">{s.period} · {s.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase text-[#9e9e9e] tracking-wide">Due Date</p>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{s.due}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[["Gross Amount", fmt(s.gross)], ["Platform Fee", `-${fmt(s.fees)}`], ["Net Payout", fmt(s.net)]].map(([l, v]) => (
                  <div key={String(l)}>
                    <p className="text-[9px] uppercase text-[#9e9e9e] tracking-wide mb-1">{l}</p>
                    <p className={`text-sm font-bold ${String(l) === "Net Payout" ? "text-[#d4145a]" : String(l) === "Platform Fee" ? "text-red-500" : "text-[#1a1a1a]"}`}>{v}</p>
                  </div>
                ))}
              </div>
              {status === "Pending" && (
                <button onClick={() => pay(s.id)} className="px-5 py-2.5 bg-[#d4145a] text-white text-[9px] tracking-[0.15em] uppercase font-semibold hover:bg-[#b8114d] transition-colors">
                  Pay Seller {fmt(s.net)}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
