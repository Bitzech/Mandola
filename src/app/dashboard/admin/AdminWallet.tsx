import { ADMIN_STATS, WALLET_TRANSACTIONS, fmt } from "./adminData";

export default function AdminWallet() {
  const balance = 2847320;

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Finance</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Admin Wallet</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Wallet Balance",    value: fmt(balance),                              accent: true  },
          { label: "Today's Earnings",  value: fmt(ADMIN_STATS.todayRevenue * 0.1),       accent: false },
          { label: "Monthly Earnings",  value: fmt(ADMIN_STATS.platformCommission),       accent: false },
          { label: "Commission Rate",   value: "10%",                                     accent: false },
        ].map(c => (
          <div key={c.label} className={`bg-white border border-[#ececec] p-5 ${c.accent ? "border-l-2 border-l-[#d4145a]" : ""}`}>
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-2">{c.label}</p>
            <p className={`text-xl font-bold font-['Playfair_Display'] ${c.accent ? "text-[#d4145a]" : "text-[#1a1a1a]"}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#ececec]">
        <div className="px-5 py-4 border-b border-[#ececec]">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Recent</p>
          <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Transactions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[550px]">
            <thead>
              <tr className="border-b border-[#ececec]">
                {["ID", "Type", "Description", "Amount", "Balance", "Date"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WALLET_TRANSACTIONS.map(t => (
                <tr key={t.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                  <td className="px-5 py-3 text-xs font-semibold text-[#d4145a]">{t.id}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${t.type === "Commission" ? "bg-green-50 text-green-700" : t.type === "Settlement" ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-600"}`}>{t.type}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-[#6e6e6e]">{t.description}</td>
                  <td className="px-5 py-3 text-xs font-bold">
                    <span className={t.amount > 0 ? "text-green-600" : "text-red-600"}>
                      {t.amount > 0 ? "+" : "-"}{fmt(t.amount)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs font-semibold text-[#1a1a1a]">{fmt(t.balance)}</td>
                  <td className="px-5 py-3 text-xs text-[#6e6e6e]">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
