import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { ADMIN_INVOICES, fmt } from "./adminData";

export default function AdminInvoices() {
  const [tab, setTab] = useState<"Customer" | "Seller" | "All">("All");

  const displayed = ADMIN_INVOICES.filter(i => tab === "All" || i.type === tab);

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Documents</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Invoices</h2>
      </div>

      <div className="flex gap-1 mb-5 bg-white border border-[#ececec] p-1 w-fit">
        {(["All", "Customer", "Seller"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 text-[10px] tracking-[0.12em] uppercase font-semibold transition-colors ${tab === t ? "bg-[#d4145a] text-white" : "text-[#6e6e6e] hover:text-[#1a1a1a]"}`}>{t}</button>
        ))}
      </div>

      <div className="bg-white border border-[#ececec] overflow-x-auto">
        <table className="w-full min-w-[650px]">
          <thead>
            <tr className="border-b border-[#ececec]">
              {["Invoice #", "Order #", "Customer", "Seller", "Amount", "Commission", "Type", "Date", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.map(inv => (
              <tr key={inv.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <FileText size={13} strokeWidth={1.5} className="text-[#d4145a] flex-shrink-0" />
                    <span className="text-xs font-semibold text-[#d4145a]">{inv.id}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-xs text-[#6e6e6e]">{inv.orderId}</td>
                <td className="px-4 py-4 text-xs font-medium text-[#1a1a1a]">{inv.customer}</td>
                <td className="px-4 py-4 text-xs text-[#6e6e6e]">{inv.seller}</td>
                <td className="px-4 py-4 text-xs font-semibold text-[#1a1a1a]">{fmt(inv.amount)}</td>
                <td className="px-4 py-4 text-xs font-semibold text-[#d4145a]">{fmt(inv.commission)}</td>
                <td className="px-4 py-4">
                  <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${inv.type === "Customer" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>{inv.type}</span>
                </td>
                <td className="px-4 py-4 text-xs text-[#6e6e6e]">{inv.date}</td>
                <td className="px-4 py-4">
                  <button className="flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase text-[#d4145a] hover:underline font-semibold">
                    <Download size={11} strokeWidth={2} /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
