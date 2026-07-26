import { useState, useEffect } from "react";
import { fmt } from "./adminData";
import { adminService } from "../../services/admin.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { RefreshCw } from "lucide-react";

export default function AdminWallet() {
  const [walletStats, setWalletStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getDashboard();
      setWalletStats(response.data || response);
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
  const totalRev = payments.total_revenue || 0;
  const todayRev = payments.today_revenue || 0;
  const monthlyRev = payments.monthly_revenue || 0;
  const commEst = totalRev * 0.1;

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Finance</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Admin Wallet</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue",     value: fmt(totalRev),              accent: true  },
          { label: "Today's Earnings",  value: fmt(todayRev * 0.1),        accent: false },
          { label: "Monthly Earnings",  value: fmt(monthlyRev * 0.1),      accent: false },
          { label: "Commission Rate",   value: "10%",                      accent: false },
        ].map((c) => (
          <div key={c.label} className={`bg-white border border-[#ececec] p-5 ${c.accent ? "border-l-2 border-l-[#d4145a]" : ""}`}>
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-2">{c.label}</p>
            <p className={`text-xl font-bold font-['Playfair_Display'] ${c.accent ? "text-[#d4145a]" : "text-[#1a1a1a]"}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#ececec]">
        <div className="px-5 py-4 border-b border-[#ececec]">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Platform</p>
          <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Commission & Settlement Overview</p>
        </div>
        <div className="p-6 space-y-4 text-sm text-[#6e6e6e] font-light">
          <p>Total Estimated Platform Commission (10% standard rate): <strong className="text-[#d4145a]">{fmt(commEst)}</strong></p>
          <p>Total Successful Payments Processed: <strong className="text-[#1a1a1a]">{payments.successful_payments || 0}</strong></p>
          <p>Pending Payments Count: <strong className="text-amber-600">{payments.pending_payments || 0}</strong></p>
        </div>
      </div>
    </div>
  );
}
