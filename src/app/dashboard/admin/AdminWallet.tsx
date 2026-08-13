import { useState, useEffect } from "react";
import { fmt } from "./adminData";
import { adminService } from "../../services/admin.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { RefreshCw, TrendingUp, Wallet, CreditCard, BarChart3 } from "lucide-react";

export default function AdminWallet() {
  const [walletStats, setWalletStats] = useState<any | null>(null);
  const [settlements, setSettlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, settRes] = await Promise.allSettled([
        adminService.getDashboard(),
        adminService.getSettlements({ limit: 10 }),
      ]);

      if (dashRes.status === "fulfilled") {
        setWalletStats((dashRes.value as any).data || dashRes.value);
      }

      if (settRes.status === "fulfilled") {
        const raw = (settRes.value as any).data || settRes.value;
        const items = Array.isArray(raw) ? raw : raw?.items || raw?.data || [];
        setSettlements(items);
      }
    } catch (err: any) {
      setError(extractErrorMessage(err, "Failed to load wallet metrics."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-slate-200" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="bg-white border border-[#ececec] h-24 bg-slate-50" />)}
        </div>
        <div className="bg-white border border-[#ececec] h-48 bg-slate-50" />
      </div>
    );
  }

  if (error && !walletStats) {
    return (
      <div className="bg-white border border-[#ececec] p-12 text-center">
        <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a] mb-2">Wallet Data Unavailable</p>
        <p className="text-sm text-[#6e6e6e] font-light mb-4">{error}</p>
        <button onClick={fetchWallet} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
          <RefreshCw size={13} /> Retry Loading
        </button>
      </div>
    );
  }

  const payments = walletStats?.payments || {};
  const totalRev = Number(payments.total_revenue || 0);
  const todayRev = Number(payments.today_revenue || 0);
  const monthlyRev = Number(payments.monthly_revenue || 0);
  const commRate = 0.10;
  const totalComm = totalRev * commRate;
  const todayComm = todayRev * commRate;
  const monthlyComm = monthlyRev * commRate;

  const statCards = [
    { label: "Total Revenue",      value: fmt(totalRev),    Icon: TrendingUp, accent: true  },
    { label: "Platform Commission", value: fmt(totalComm),   Icon: Wallet,     accent: false },
    { label: "Today's Commission",  value: fmt(todayComm),   Icon: CreditCard, accent: false },
    { label: "Monthly Commission",  value: fmt(monthlyComm), Icon: BarChart3,  accent: false },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Finance</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Admin Wallet</h2>
        </div>
        <button onClick={fetchWallet} className="flex items-center gap-2 px-4 py-2 bg-white border border-[#ececec] text-xs text-[#1a1a1a] hover:bg-[#faf7f4]">
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((c) => (
          <div key={c.label} className={`bg-white border border-[#ececec] p-5 ${c.accent ? "border-l-2 border-l-[#d4145a]" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[9px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-2">{c.label}</p>
                <p className={`text-xl font-bold font-['Playfair_Display'] ${c.accent ? "text-[#d4145a]" : "text-[#1a1a1a]"}`}>{c.value}</p>
              </div>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${c.accent ? "bg-[#fce8ef]" : "bg-[#faf7f4]"}`}>
                <c.Icon size={16} strokeWidth={1.5} className={c.accent ? "text-[#d4145a]" : "text-[#6e6e6e]"} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Commission Overview */}
      <div className="bg-white border border-[#ececec] mb-5">
        <div className="px-5 py-4 border-b border-[#ececec]">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Platform</p>
          <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Commission & Settlement Overview</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-[#6e6e6e] font-light">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#9e9e9e]">Commission Rate</p>
            <p className="text-2xl font-bold text-[#1a1a1a] font-['Playfair_Display']">10%</p>
            <p className="text-xs">Standard platform rate applied to all orders</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#9e9e9e]">Successful Payments</p>
            <p className="text-2xl font-bold text-[#1a1a1a] font-['Playfair_Display']">{payments.successful_payments || 0}</p>
            <p className="text-xs">Completed payment transactions</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#9e9e9e]">Pending Payments</p>
            <p className="text-2xl font-bold text-amber-600 font-['Playfair_Display']">{payments.pending_payments || 0}</p>
            <p className="text-xs">Awaiting confirmation or COD</p>
          </div>
        </div>
      </div>

      {/* Recent Settlements */}
      <div className="bg-white border border-[#ececec]">
        <div className="px-5 py-4 border-b border-[#ececec]">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Transactions</p>
          <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Recent Seller Settlements</p>
        </div>
        {settlements.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#ececec]">
                  {["Settlement #", "Seller", "Gross", "Commission", "Net Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {settlements.map((s: any, idx: number) => {
                  const gross = Number(s.gross_amount || 0);
                  const comm = Number(s.commission_amount || gross * commRate);
                  const net = Number(s.net_settlement_amount || gross - comm);
                  const statusColor = (s.status || "").toLowerCase() === "paid"
                    ? "bg-green-50 text-green-700"
                    : (s.status || "").toLowerCase() === "pending"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-gray-50 text-gray-600";
                  const date = s.settlement_date || s.created_at
                    ? new Date(s.settlement_date || s.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                    : "—";

                  return (
                    <tr key={idx} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                      <td className="px-5 py-4 text-xs font-semibold text-[#d4145a]">{s.settlement_number || `SET-${s.id}`}</td>
                      <td className="px-5 py-4 text-xs text-[#1a1a1a]">{s.seller_name || s.business_name || `Seller #${s.seller_id}`}</td>
                      <td className="px-5 py-4 text-xs font-medium text-[#1a1a1a]">{fmt(gross)}</td>
                      <td className="px-5 py-4 text-xs text-red-600">-{fmt(comm)}</td>
                      <td className="px-5 py-4 text-xs font-bold text-[#1a1a1a]">{fmt(net)}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[9px] uppercase tracking-[0.08em] px-2 py-1 font-semibold ${statusColor}`}>
                          {(s.status || "pending").charAt(0).toUpperCase() + (s.status || "pending").slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#6e6e6e]">{date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#9e9e9e]">
            No settlement records yet. Settlements are auto-created when orders are delivered.
          </div>
        )}
      </div>
    </div>
  );
}
