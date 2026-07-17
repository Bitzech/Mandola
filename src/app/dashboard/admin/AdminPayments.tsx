import { ADMIN_PAYMENTS, payStatusColor, fmt } from "./adminData";

export default function AdminPayments() {
  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Finance</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Payments</h2>
      </div>

      <div className="bg-white border border-[#ececec] overflow-x-auto">
        <table className="w-full min-w-[650px]">
          <thead>
            <tr className="border-b border-[#ececec]">
              {["Transaction ID", "Order", "Customer", "Amount", "Gateway", "Status", "Date"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ADMIN_PAYMENTS.map(p => (
              <tr key={p.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                <td className="px-5 py-4 text-xs font-semibold text-[#d4145a]">{p.id}</td>
                <td className="px-5 py-4 text-xs text-[#6e6e6e]">{p.orderId}</td>
                <td className="px-5 py-4 text-xs font-medium text-[#1a1a1a]">{p.customer}</td>
                <td className="px-5 py-4 text-xs font-semibold text-[#1a1a1a]">{fmt(p.amount)}</td>
                <td className="px-5 py-4">
                  <span className="text-[9px] tracking-[0.1em] uppercase px-2 py-1 bg-[#faf7f4] text-[#6e6e6e] font-semibold">{p.gateway}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${payStatusColor(p.status)}`}>{p.status}</span>
                </td>
                <td className="px-5 py-4 text-xs text-[#6e6e6e]">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
