import { Download, TrendingUp } from "lucide-react";
import { SETTLEMENTS, SELLER_STATS, fmt } from "./sellerData";

const settlementStyle = (s: string) => {
  if (s === "Paid")       return "bg-green-50 text-green-700";
  if (s === "Processing") return "bg-blue-50 text-blue-700";
  if (s === "Pending")    return "bg-amber-50 text-amber-700";
  return "";
};

export default function PaymentsPage() {
  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Finance</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Payments & Settlements</h2>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Earnings",     value: fmt(SELLER_STATS.totalEarnings),     accent: true  },
          { label: "Pending Settlement", value: fmt(SELLER_STATS.pendingSettlement), accent: false },
          { label: "Paid Amount",        value: fmt(SELLER_STATS.totalEarnings - SELLER_STATS.pendingSettlement), accent: false },
          { label: "Total Revenue",      value: fmt(SELLER_STATS.totalRevenue),      accent: false },
        ].map(c => (
          <div key={c.label} className={`bg-white border border-[#ececec] p-5 ${c.accent ? "border-l-2 border-l-[#d4145a]" : ""}`}>
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-2">{c.label}</p>
            <p className={`text-xl font-bold font-['Playfair_Display'] ${c.accent ? "text-[#d4145a]" : "text-[#1a1a1a]"}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Settlement History */}
      <div className="bg-white border border-[#ececec]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#ececec]">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Settlement</p>
            <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">History</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 border border-[#ececec] text-[9px] tracking-[0.12em] uppercase text-[#6e6e6e] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors">
            <Download size={12} strokeWidth={1.5} />
            Statement
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="border-b border-[#ececec]">
                {["Settlement ID", "Period", "Orders", "Gross", "Platform Fee", "Net Payout", "Status", "Date"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SETTLEMENTS.map(s => (
                <tr key={s.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                  <td className="px-4 py-3 text-xs font-semibold text-[#d4145a]">{s.id}</td>
                  <td className="px-4 py-3 text-xs text-[#1a1a1a]">{s.period}</td>
                  <td className="px-4 py-3 text-xs text-[#6e6e6e]">{s.orders}</td>
                  <td className="px-4 py-3 text-xs font-medium text-[#1a1a1a]">{fmt(s.gross)}</td>
                  <td className="px-4 py-3 text-xs text-red-500">-{fmt(s.fees)}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[#1a1a1a]">{fmt(s.net)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${settlementStyle(s.status)}`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6e6e6e]">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
