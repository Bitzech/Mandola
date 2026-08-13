import { useState, useEffect, useMemo } from "react";
import { payStatusColor, fmt } from "./adminData";
import { adminService } from "../../services/admin.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";
import { RefreshCw, Download, TrendingUp, CreditCard, Clock, XCircle } from "lucide-react";

const STATUS_TABS = ["All", "Success", "Pending", "Failed", "Refunded"] as const;

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<typeof STATUS_TABS[number]>("All");
  const [search, setSearch] = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await adminService.getPayments({ limit: 100 });
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

  const filtered = useMemo(() => {
    let list = payments;
    if (activeTab !== "All") {
      list = list.filter((p) => {
        const s = (p.status || "success").toLowerCase();
        return s === activeTab.toLowerCase();
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => {
        const txnId = String(p.transaction_id || p.id || "").toLowerCase();
        const orderId = String(p.order_number || p.order_id || "").toLowerCase();
        const customer = `${p.first_name || ""} ${p.last_name || ""} ${p.email || ""}`.toLowerCase();
        return txnId.includes(q) || orderId.includes(q) || customer.includes(q);
      });
    }
    return list;
  }, [payments, activeTab, search]);

  // Summary stats
  const totalAmount = payments.reduce((s, p) => s + Number(p.transaction_amount || p.amount || 0), 0);
  const successCount = payments.filter((p) => (p.status || "success").toLowerCase() === "success").length;
  const pendingCount = payments.filter((p) => (p.status || "").toLowerCase() === "pending").length;
  const today = new Date().toDateString();
  const todayTotal = payments
    .filter((p) => new Date(p.paid_at || p.created_at).toDateString() === today)
    .reduce((s, p) => s + Number(p.transaction_amount || p.amount || 0), 0);

  const handleExportCSV = () => {
    const headers = ["Transaction ID", "Order ID", "Customer", "Amount", "Gateway", "Status", "Date"];
    const rows = filtered.map((p) => [
      p.transaction_id || p.id,
      p.order_number || p.order_id || "",
      `${p.first_name || ""} ${p.last_name || ""}`.trim() || p.email,
      p.transaction_amount || p.amount || 0,
      p.payment_method || p.gateway || "Online",
      p.status || "success",
      p.paid_at || p.created_at || "",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments_export.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  const statCards = [
    { label: "Total Collected", value: fmt(totalAmount), Icon: TrendingUp, accent: true },
    { label: "Today's Revenue", value: fmt(todayTotal), Icon: CreditCard, accent: false },
    { label: "Successful", value: successCount, Icon: CreditCard, accent: false },
    { label: "Pending", value: pendingCount, Icon: Clock, accent: false },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Finance</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Payments</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-[#ececec] text-xs text-[#1a1a1a] hover:border-[#d4145a] hover:text-[#d4145a] transition-colors"
          >
            <Download size={13} /> Export CSV
          </button>
          <button
            onClick={fetchPayments}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#ececec] text-xs text-[#1a1a1a] hover:bg-[#faf7f4]"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((c) => (
          <div key={c.label} className={`bg-white border border-[#ececec] p-5 ${c.accent ? "border-l-2 border-l-[#d4145a]" : ""}`}>
            <p className="text-[9px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-2">{c.label}</p>
            <p className={`text-xl font-bold font-['Playfair_Display'] ${c.accent ? "text-[#d4145a]" : "text-[#1a1a1a]"}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-1 bg-white border border-[#ececec] p-1 w-fit">
          {STATUS_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 text-[10px] tracking-[0.1em] uppercase font-semibold transition-colors ${activeTab === t ? "bg-[#d4145a] text-white" : "text-[#6e6e6e] hover:text-[#1a1a1a]"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by TXN ID, order, customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-[#ececec] px-3 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] w-64"
        />
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
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#ececec]">
                {["Transaction ID", "Order ID", "Customer", "Amount", "Gateway", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => {
                const txnId = p.transaction_id || `TXN-${p.id}`;
                const orderId = p.order_number || (p.order_id ? `ORD-${p.order_id}` : "—");
                const customer = `${p.first_name || ""} ${p.last_name || ""}`.trim() || p.customer_name || p.email || "Customer";
                const amount = Number(p.transaction_amount || p.amount || 0);
                const gateway = p.payment_method || p.gateway || "Online";
                const status = (p.status || "success");
                const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
                const date = (p.paid_at || p.created_at)
                  ? new Date(p.paid_at || p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                  : "—";

                return (
                  <tr key={idx} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                    <td className="px-5 py-4 text-xs font-semibold text-[#d4145a]">{txnId}</td>
                    <td className="px-5 py-4 text-xs text-[#6e6e6e]">{orderId}</td>
                    <td className="px-5 py-4 text-xs font-medium text-[#1a1a1a]">{customer}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-[#1a1a1a]">{fmt(amount)}</td>
                    <td className="px-5 py-4">
                      <span className="text-[9px] tracking-[0.1em] uppercase px-2 py-1 bg-[#faf7f4] text-[#6e6e6e] font-semibold">{gateway}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${payStatusColor(statusLabel)}`}>{statusLabel}</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#6e6e6e]">{date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-xs text-[#9e9e9e]">
              {payments.length === 0 ? "No payment records found." : "No results match your filter."}
            </div>
          )}
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-[#ececec] text-[10px] text-[#9e9e9e]">
              Showing {filtered.length} of {payments.length} transactions · Total: <strong className="text-[#1a1a1a]">{fmt(filtered.reduce((s, p) => s + Number(p.transaction_amount || p.amount || 0), 0))}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
