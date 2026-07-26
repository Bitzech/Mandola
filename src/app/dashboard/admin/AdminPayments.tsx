import { useState, useEffect } from "react";
import { payStatusColor, fmt } from "./adminData";
import { adminService } from "../../services/admin.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await adminService.getPayments({ limit: 50 });
      const rawData = response.data || response;
      const itemsList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];
      setPayments(itemsList);
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load payments history.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Finance</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Payments</h2>
      </div>

      {loading ? (
        <div className="bg-white border border-[#ececec] p-12 text-center animate-pulse">
          <p className="text-xs text-[#9e9e9e] uppercase tracking-widest">Loading payment records…</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-12 text-center">
          <p className="text-sm text-red-600 font-light mb-4">{error}</p>
          <button onClick={fetchPayments} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry Loading
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#ececec] overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="border-b border-[#ececec]">
                {["Transaction ID", "Order ID", "Customer", "Amount", "Gateway", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const txnId = p.transaction_id || p.id || `TXN-${p.id}`;
                const orderId = p.order_number || (p.order_id ? `ORD-${p.order_id}` : "—");
                const customer = `${p.first_name || ""} ${p.last_name || ""}`.trim() || p.customer_name || p.email || "Customer";
                const amount = p.transaction_amount || p.amount || 0;
                const gateway = p.payment_method || p.gateway || "Razorpay / UPI";
                const status = (p.status || "success").charAt(0).toUpperCase() + (p.status || "success").slice(1);
                const date = p.paid_at || p.created_at ? new Date(p.paid_at || p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

                return (
                  <tr key={p.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                    <td className="px-5 py-4 text-xs font-semibold text-[#d4145a]">{txnId}</td>
                    <td className="px-5 py-4 text-xs text-[#6e6e6e]">{orderId}</td>
                    <td className="px-5 py-4 text-xs font-medium text-[#1a1a1a]">{customer}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-[#1a1a1a]">{fmt(amount)}</td>
                    <td className="px-5 py-4">
                      <span className="text-[9px] tracking-[0.1em] uppercase px-2 py-1 bg-[#faf7f4] text-[#6e6e6e] font-semibold">{gateway}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${payStatusColor(status)}`}>{status}</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#6e6e6e]">{date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {payments.length === 0 && <div className="py-12 text-center text-xs text-[#9e9e9e]">No payment records found.</div>}
        </div>
      )}
    </div>
  );
}
