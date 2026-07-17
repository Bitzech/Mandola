import { useState } from "react";
import { Download } from "lucide-react";
import { ADMIN_ORDERS, orderStatusColor, payStatusColor, fmt } from "./adminData";

const TABS = ["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"] as const;

export default function AdminOrders() {
  const [tab, setTab] = useState<typeof TABS[number]>("All");
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(ADMIN_ORDERS.map(o => [o.id, o.orderStatus]))
  );

  const NEXT: Record<string, string> = { Pending: "Confirmed", Confirmed: "Shipped", Shipped: "Delivered" };
  const getStatus = (id: string) => statuses[id];

  const displayed = ADMIN_ORDERS.filter(o => tab === "All" || getStatus(o.id) === tab);

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Orders</h2>
      </div>

      <div className="flex overflow-x-auto gap-1 mb-5 bg-white border border-[#ececec] p-1 w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-shrink-0 px-4 py-2 text-[10px] tracking-[0.12em] uppercase font-semibold transition-colors ${tab === t ? "bg-[#d4145a] text-white" : "text-[#6e6e6e] hover:text-[#1a1a1a]"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {displayed.map(o => {
          const status = getStatus(o.id);
          const next = NEXT[status];
          return (
            <div key={o.id} className="bg-white border border-[#ececec] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3 pb-3 border-b border-[#ececec]">
                <div className="flex items-center gap-4">
                  <img src={o.productImg} alt={o.product} className="w-10 h-12 object-cover bg-[#faf7f4] flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#d4145a]">{o.id}</p>
                    <p className="text-xs font-medium text-[#1a1a1a] mt-0.5">{o.product}</p>
                    <p className="text-[10px] text-[#6e6e6e] mt-0.5">Customer: {o.customer} · Seller: {o.seller}</p>
                    <p className="text-[10px] text-[#9e9e9e]">{o.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${payStatusColor(o.payStatus)}`}>{o.payStatus}</span>
                  <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${orderStatusColor(status)}`}>{status}</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div><p className="text-[9px] uppercase text-[#9e9e9e] tracking-wide">Amount</p><p className="text-sm font-bold text-[#1a1a1a]">{fmt(o.amount)}</p></div>
                  <div><p className="text-[9px] uppercase text-[#9e9e9e] tracking-wide">Commission</p><p className="text-sm font-bold text-[#d4145a]">{o.commission ? fmt(o.commission) : "—"}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 border border-[#ececec] text-[9px] tracking-[0.1em] uppercase text-[#6e6e6e] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors">
                    <Download size={11} strokeWidth={1.5} /> Invoice
                  </button>
                  {next && status !== "Cancelled" && (
                    <button onClick={() => setStatuses(prev => ({ ...prev, [o.id]: next }))} className="px-4 py-2 bg-[#1a1a1a] text-white text-[9px] tracking-[0.12em] uppercase hover:bg-[#d4145a] transition-colors font-semibold">
                      Mark {next}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {displayed.length === 0 && (
          <div className="bg-white border border-[#ececec] py-16 text-center">
            <p className="text-xs text-[#9e9e9e]">No {tab.toLowerCase()} orders.</p>
          </div>
        )}
      </div>
    </div>
  );
}
