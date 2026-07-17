import { useState } from "react";
import { Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { ADMIN_SELLERS, sellerStatusColor, fmt, type AdminNavigateFn } from "./adminData";

const TABS = ["All", "Approved", "Pending", "Rejected", "Suspended"] as const;

export default function SellersPage({ onNavigate: _ }: { onNavigate: AdminNavigateFn }) {
  const [tab, setTab] = useState<typeof TABS[number]>("All");
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(ADMIN_SELLERS.map(s => [s.id, s.status]))
  );

  const update = (id: string, val: string) => setStatuses(prev => ({ ...prev, [id]: val }));

  const displayed = ADMIN_SELLERS.filter(s =>
    tab === "All" || statuses[s.id] === tab
  );

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Sellers</h2>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 mb-5 bg-white border border-[#ececec] p-1 w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-shrink-0 px-4 py-2 text-[10px] tracking-[0.12em] uppercase font-semibold transition-colors ${tab === t ? "bg-[#d4145a] text-white" : "text-[#6e6e6e] hover:text-[#1a1a1a]"}`}>
            {t} ({t === "All" ? ADMIN_SELLERS.length : ADMIN_SELLERS.filter(s => s.status === t).length})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {displayed.map(s => {
          const status = statuses[s.id];
          return (
            <div key={s.id} className="bg-white border border-[#ececec] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[#1a1a1a]">{s.store}</p>
                      <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${sellerStatusColor(status)}`}>{status}</span>
                    </div>
                    <p className="text-xs text-[#6e6e6e] mt-0.5">{s.name} · {s.email}</p>
                    <p className="text-[10px] text-[#9e9e9e] mt-0.5">{s.phone} · Joined {s.joined}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-center">
                  {[["Products", s.products], ["Orders", s.orders], ["Revenue", s.revenue ? fmt(s.revenue) : "—"]].map(([l, v]) => (
                    <div key={String(l)}>
                      <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e]">{l}</p>
                      <p className="text-sm font-bold text-[#1a1a1a]">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#ececec] flex items-center gap-2 flex-wrap">
                <button className="flex items-center gap-1.5 px-3 py-2 border border-[#ececec] text-[9px] tracking-[0.1em] uppercase text-[#6e6e6e] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors">
                  <Eye size={11} strokeWidth={1.5} /> View Details
                </button>
                {status === "Pending" && <>
                  <button onClick={() => update(s.id, "Approved")} className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-[9px] tracking-[0.1em] uppercase hover:bg-green-700 transition-colors font-semibold">
                    <CheckCircle size={11} strokeWidth={2} /> Approve
                  </button>
                  <button onClick={() => update(s.id, "Rejected")} className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 text-[9px] tracking-[0.1em] uppercase hover:bg-red-50 transition-colors">
                    <XCircle size={11} strokeWidth={2} /> Reject
                  </button>
                </>}
                {status === "Approved" && (
                  <button onClick={() => update(s.id, "Suspended")} className="flex items-center gap-1.5 px-3 py-2 border border-amber-200 text-amber-700 text-[9px] tracking-[0.1em] uppercase hover:bg-amber-50 transition-colors">
                    <AlertTriangle size={11} strokeWidth={2} /> Suspend
                  </button>
                )}
                {status === "Suspended" && (
                  <button onClick={() => update(s.id, "Approved")} className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1a1a] text-white text-[9px] tracking-[0.1em] uppercase hover:bg-[#d4145a] transition-colors font-semibold">
                    <CheckCircle size={11} strokeWidth={2} /> Reactivate
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {displayed.length === 0 && (
          <div className="bg-white border border-[#ececec] py-16 text-center">
            <p className="text-xs text-[#9e9e9e]">No {tab.toLowerCase()} sellers.</p>
          </div>
        )}
      </div>
    </div>
  );
}
