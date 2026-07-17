import { Download, FileText } from "lucide-react";
import { SELLER_INVOICES, fmt } from "./sellerData";

export default function SellerInvoicesPage() {
  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Documents</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Invoices</h2>
      </div>

      <div className="bg-white border border-[#ececec] overflow-x-auto">
        <table className="w-full min-w-[550px]">
          <thead>
            <tr className="border-b border-[#ececec]">
              {["Invoice #", "Order #", "Customer", "Amount", "Date", "Status", ""].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SELLER_INVOICES.map(inv => (
              <tr key={inv.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <FileText size={14} strokeWidth={1.5} className="text-[#d4145a] flex-shrink-0" />
                    <span className="text-xs font-semibold text-[#d4145a]">{inv.id}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs text-[#6e6e6e]">{inv.orderId}</td>
                <td className="px-5 py-4 text-xs font-medium text-[#1a1a1a]">{inv.customer}</td>
                <td className="px-5 py-4 text-xs font-semibold text-[#1a1a1a]">{fmt(inv.amount)}</td>
                <td className="px-5 py-4 text-xs text-[#6e6e6e]">{inv.date}</td>
                <td className="px-5 py-4">
                  <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${inv.status === "Paid" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button className="flex items-center gap-1.5 text-[10px] tracking-[0.1em] uppercase text-[#d4145a] hover:underline font-semibold">
                    <Download size={11} strokeWidth={2} />
                    PDF
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
