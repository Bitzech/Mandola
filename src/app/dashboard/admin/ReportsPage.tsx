import { Download, FileText } from "lucide-react";
import { ADMIN_STATS, ADMIN_MONTHLY, fmt } from "./adminData";

const REPORT_TYPES = [
  { label: "Sales Report",   desc: "Total sales by date, category, and seller",    color: "bg-blue-50 text-blue-700" },
  { label: "Revenue Report", desc: "Platform revenue and commission breakdown",     color: "bg-green-50 text-green-700" },
  { label: "Order Report",   desc: "Order status, fulfilment, and return rates",   color: "bg-purple-50 text-purple-700" },
  { label: "Seller Report",  desc: "Seller performance and settlement history",     color: "bg-amber-50 text-amber-700" },
  { label: "Product Report", desc: "Top products, inventory, and approval status", color: "bg-[#fce8ef] text-[#d4145a]" },
  { label: "Return Report",  desc: "Return requests, refunds, and resolution rate",color: "bg-red-50 text-red-600" },
];

export default function ReportsPage() {
  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Analytics</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Reports</h2>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue",  value: fmt(ADMIN_MONTHLY.reduce((s, m) => s + m.revenue, 0)) },
          { label: "Total Orders",   value: ADMIN_MONTHLY.reduce((s, m) => s + m.orders, 0).toLocaleString() },
          { label: "Total Commission", value: fmt(ADMIN_MONTHLY.reduce((s, m) => s + m.commission, 0)) },
          { label: "Avg Order Value", value: fmt(Math.round(ADMIN_MONTHLY.reduce((s, m) => s + m.revenue, 0) / ADMIN_MONTHLY.reduce((s, m) => s + m.orders, 0))) },
        ].map(c => (
          <div key={c.label} className="bg-white border border-[#ececec] p-5">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-2">{c.label}</p>
            <p className="text-xl font-bold font-['Playfair_Display'] text-[#1a1a1a]">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Report cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {REPORT_TYPES.map(r => (
          <div key={r.label} className="bg-white border border-[#ececec] p-5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-3 ${r.color}`}>
              <FileText size={16} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-semibold text-[#1a1a1a] mb-1">{r.label}</p>
            <p className="text-xs text-[#6e6e6e] font-light mb-4">{r.desc}</p>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 border border-[#ececec] text-[9px] tracking-[0.1em] uppercase text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
                <Download size={10} strokeWidth={2} /> PDF
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 border border-[#ececec] text-[9px] tracking-[0.1em] uppercase text-[#6e6e6e] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors">
                <Download size={10} strokeWidth={2} /> Excel
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly summary table */}
      <div className="bg-white border border-[#ececec]">
        <div className="px-5 py-4 border-b border-[#ececec]">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Monthly</p>
          <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Summary</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-[#ececec]">
                {["Month", "Revenue", "Orders", "Commission"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ADMIN_MONTHLY.map(m => (
                <tr key={m.month} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                  <td className="px-5 py-3 text-xs font-medium text-[#1a1a1a]">{m.month}</td>
                  <td className="px-5 py-3 text-xs font-semibold text-[#1a1a1a]">{fmt(m.revenue)}</td>
                  <td className="px-5 py-3 text-xs text-[#6e6e6e]">{m.orders.toLocaleString()}</td>
                  <td className="px-5 py-3 text-xs font-semibold text-[#d4145a]">{fmt(m.commission)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
