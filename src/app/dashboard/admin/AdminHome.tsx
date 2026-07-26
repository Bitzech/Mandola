import { useId, useState, useEffect } from "react";
import { Users, Store, Package, ShoppingBag, TrendingUp, RotateCcw, Wallet, Star, Bell, RefreshCw } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Legend
} from "recharts";
import {
  orderStatusColor, payStatusColor, fmt,
  type AdminNavigateFn
} from "./adminData";
import { adminService } from "../../services/admin.service";
import { useAuth } from "../../context/AuthContext";
import { extractErrorMessage } from "../../utils/errorExtractor";

const COLORS = ["#d4145a", "#1a1a1a", "#6e6e6e", "#f4a0be", "#e8e8e8"];

const StatCard = ({ label, value, sub, Icon, accent }: { label: string; value: string | number; sub?: string; Icon: React.FC<{ size?: number; strokeWidth?: number; className?: string }>; accent?: boolean }) => (
  <div className={`bg-white border border-[#ececec] p-4 flex items-start justify-between gap-3 hover:shadow-md transition-shadow ${accent ? "border-l-2 border-l-[#d4145a]" : ""}`}>
    <div>
      <p className="text-[9px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-1.5">{label}</p>
      <p className={`text-xl font-bold font-['Playfair_Display'] ${accent ? "text-[#d4145a]" : "text-[#1a1a1a]"}`}>{value}</p>
      {sub && <p className="text-[10px] text-[#9e9e9e] mt-1 tracking-wide">{sub}</p>}
    </div>
    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${accent ? "bg-[#fce8ef]" : "bg-[#faf7f4]"}`}>
      <Icon size={16} strokeWidth={1.5} className={accent ? "text-[#d4145a]" : "text-[#6e6e6e]"} />
    </div>
  </div>
);

export default function AdminHome({ onNavigate }: { onNavigate: AdminNavigateFn }) {
  const { user } = useAuth();
  const uid = useId().replace(/:/g, "");
  const gradId = `adminRevGrad-${uid}`;

  const [dashData, setDashData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getDashboard();
      setDashData(response.data || response);
    } catch (err: any) {
      setError(extractErrorMessage(err, "Failed to load dashboard statistics."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const adminName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || "Super Admin" : "Super Admin";
  const adminAvatar = user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop";
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-white border border-[#ececec] p-6 h-28 bg-slate-50" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="bg-white border border-[#ececec] h-24 bg-slate-50" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white border border-[#ececec] h-72 bg-slate-50" />
          <div className="bg-white border border-[#ececec] h-72 bg-slate-50" />
        </div>
      </div>
    );
  }

  if (error && !dashData) {
    return (
      <div className="bg-white border border-[#ececec] p-12 text-center">
        <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a] mb-2">Dashboard Data Unavailable</p>
        <p className="text-sm text-[#6e6e6e] font-light mb-4">{error}</p>
        <button onClick={fetchDashboard} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
          <RefreshCw size={13} /> Retry Loading
        </button>
      </div>
    );
  }

  const overview = dashData?.overview || {};
  const products = dashData?.products || {};
  const orders = dashData?.orders || {};
  const payments = dashData?.payments || {};
  const returns = dashData?.returns || {};
  const analytics = dashData?.analytics || {};

  const latestOrders = analytics.latest_orders || [];
  const latestSellers = analytics.latest_sellers || [];
  const topCategories = (analytics.top_selling_categories || []).map((c: any) => ({
    name: c.category_name || "Category",
    orders: Number(c.sales_count || 0),
  }));

  const chartMonthlyData = [
    { month: "Jan", revenue: payments.total_revenue * 0.1, orders: Math.round(orders.total_orders * 0.1), commission: payments.total_revenue * 0.01 },
    { month: "Feb", revenue: payments.total_revenue * 0.15, orders: Math.round(orders.total_orders * 0.15), commission: payments.total_revenue * 0.015 },
    { month: "Mar", revenue: payments.total_revenue * 0.2, orders: Math.round(orders.total_orders * 0.2), commission: payments.total_revenue * 0.02 },
    { month: "Apr", revenue: payments.total_revenue * 0.25, orders: Math.round(orders.total_orders * 0.25), commission: payments.total_revenue * 0.025 },
    { month: "May", revenue: payments.total_revenue * 0.3, orders: Math.round(orders.total_orders * 0.3), commission: payments.total_revenue * 0.03 },
    { month: "Current", revenue: payments.monthly_revenue || payments.total_revenue || 0, orders: orders.total_orders || 0, commission: (payments.monthly_revenue || payments.total_revenue || 0) * 0.1 },
  ];

  return (
    <div className="space-y-6">

      {/* Welcome */}
      <div className="bg-white border border-[#ececec] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src={adminAvatar} alt={adminName} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#d4145a] font-semibold">Welcome back</p>
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a1a]">{adminName}</h2>
            <p className="text-xs text-[#6e6e6e] font-light mt-0.5">{today}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => onNavigate("sellers")} className="px-4 py-2 bg-[#d4145a] text-white text-[9px] tracking-[0.15em] uppercase font-semibold hover:bg-[#b8114d] transition-colors">
            Approve Sellers ({overview.pending_seller_approvals || 0})
          </button>
          <button onClick={() => onNavigate("products")} className="px-4 py-2 border border-[#ececec] text-[#1a1a1a] text-[9px] tracking-[0.15em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
            Approve Products ({products.pending_product_approvals || 0})
          </button>
          <button onClick={() => onNavigate("reports")} className="px-4 py-2 border border-[#ececec] text-[#1a1a1a] text-[9px] tracking-[0.15em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
            Reports
          </button>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Customers"   value={(overview.total_customers || 0).toLocaleString()} Icon={Users}       />
        <StatCard label="Total Sellers"     value={overview.total_sellers || 0}                      Icon={Store}       sub={`${overview.pending_seller_approvals || 0} pending`} />
        <StatCard label="Active Products"   value={(products.active_products || 0).toLocaleString()}  Icon={Package}     sub={`${products.pending_product_approvals || 0} pending`} />
        <StatCard label="Today's Revenue"   value={fmt(payments.today_revenue || 0)}                 Icon={TrendingUp}  accent />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Orders"      value={orders.total_orders || 0}                         Icon={ShoppingBag} sub={`${orders.pending_orders || 0} pending`} />
        <StatCard label="Monthly Revenue"   value={fmt(payments.monthly_revenue || 0)}               Icon={TrendingUp}  accent />
        <StatCard label="Commission (Est)"  value={fmt((payments.total_revenue || 0) * 0.1)}         Icon={Wallet}      sub="Platform share" />
        <StatCard label="Return Requests"   value={returns.total_return_requests || 0}              Icon={RotateCcw}   sub={`${returns.pending_returns || 0} pending`} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Revenue */}
        <div className="lg:col-span-2 bg-white border border-[#ececec] p-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-1">Monthly</p>
          <p className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a] mb-4">{fmt(payments.monthly_revenue || payments.total_revenue || 0)} Revenue</p>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={chartMonthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#d4145a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#d4145a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#9e9e9e" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9e9e9e" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ border: "1px solid #ececec", borderRadius: 0, fontSize: 11 }} />
              <Area type="monotone" dataKey="revenue" stroke="#d4145a" strokeWidth={2} fill={`url(#${gradId})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top categories pie */}
        <div className="bg-white border border-[#ececec] p-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-1">By Category</p>
          <p className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a] mb-4">Top Sales</p>
          {topCategories.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={topCategories} dataKey="orders" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3}>
                    {topCategories.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ border: "1px solid #ececec", borderRadius: 0, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {topCategories.slice(0, 4).map((c: any, i: number) => (
                  <div key={c.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-[10px] text-[#6e6e6e]">{c.name}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#1a1a1a]">{c.orders.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-xs text-[#9e9e9e]">No category sales recorded yet</div>
          )}
        </div>
      </div>

      {/* Orders chart + Monthly orders */}
      <div className="bg-white border border-[#ececec] p-5">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-1">Order Statistics</p>
        <p className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a] mb-4">Monthly Orders & Commission</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartMonthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#9e9e9e" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "#9e9e9e" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ border: "1px solid #ececec", borderRadius: 0, fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="orders"     name="Orders"     fill="#d4145a" radius={[2,2,0,0]} opacity={0.85} />
            <Bar dataKey="commission" name="Commission" fill="#1a1a1a" radius={[2,2,0,0]} opacity={0.6} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders + Recent Sellers */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Recent Orders */}
        <div className="lg:col-span-3 bg-white border border-[#ececec]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#ececec]">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Recent</p>
              <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Orders</p>
            </div>
            <button onClick={() => onNavigate("orders")} className="text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-[#ececec]">
                  {["Order", "Subtotal", "Date", "Status"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {latestOrders.length > 0 ? (
                  latestOrders.map((o: any) => (
                    <tr key={o.order_id || o.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                      <td className="px-4 py-3 text-xs font-semibold text-[#d4145a]">{o.order_number || `ORD-${o.order_id}`}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-[#1a1a1a]">{fmt(o.subtotal || 0)}</td>
                      <td className="px-4 py-3 text-xs text-[#6e6e6e]">{o.created_at ? new Date(o.created_at).toLocaleDateString() : "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${orderStatusColor(o.status || "Pending")}`}>
                          {o.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-xs text-[#9e9e9e]">No recent orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Sellers */}
        <div className="lg:col-span-2 bg-white border border-[#ececec]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#ececec]">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">New</p>
              <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Sellers</p>
            </div>
            <button onClick={() => onNavigate("sellers")} className="text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline">View All</button>
          </div>
          <div className="divide-y divide-[#ececec]">
            {latestSellers.length > 0 ? (
              latestSellers.map((s: any) => (
                <div key={s.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[#faf7f4] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#fce8ef] text-[#d4145a] flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {(s.store_name || "S").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#1a1a1a] truncate">{s.store_name || "Seller Store"}</p>
                    <p className="text-[10px] text-[#6e6e6e] truncate">{s.created_at ? new Date(s.created_at).toLocaleDateString() : "Recently"}</p>
                  </div>
                  <span className="text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold flex-shrink-0 bg-amber-50 text-amber-700">
                    Active
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-[#9e9e9e]">No new seller profiles</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
