import { useState, useEffect, useId } from "react";
import { ShoppingBag, Package, TrendingUp, AlertTriangle, Star, Bell, RefreshCw } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, ResponsiveContainer
} from "recharts";
import { orderStatusColor, payStatusColor, fmt, type SellerNavigateFn } from "./sellerData";
import { sellerService } from "../../services/seller.service";
import { useAuth } from "../../context/AuthContext";
import { SellerProfile } from "../../types/seller.types";

const StatCard = ({ label, value, sub, accent, loading }: { label: string; value: string | number; sub?: string; accent?: boolean; loading?: boolean }) => (
  <div className={`bg-white border border-[#ececec] p-5 hover:shadow-md transition-shadow ${accent ? "border-l-2 border-l-[#d4145a]" : ""}`}>
    <p className="text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-2">{label}</p>
    {loading ? (
      <div className="h-8 w-24 bg-gray-200 animate-pulse rounded my-1" />
    ) : (
      <p className={`text-2xl font-bold font-['Playfair_Display'] ${accent ? "text-[#d4145a]" : "text-[#1a1a1a]"}`}>{value}</p>
    )}
    {sub && <p className="text-[10px] text-[#9e9e9e] mt-1 tracking-wide">{sub}</p>}
  </div>
);

export default function SellerHome({ onNavigate }: { onNavigate: SellerNavigateFn }) {
  const { user } = useAuth();
  const uid = useId().replace(/:/g, "");
  const gradId = `sellerRevGrad-${uid}`;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [overview, setOverview] = useState<any>({});
  const [revenue, setRevenue] = useState<any>({});
  const [prodStats, setProdStats] = useState<any>({});
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [charts, setCharts] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        profRes,
        overRes,
        revRes,
        prodRes,
        ordRes,
        topRes,
        revsRes,
        notifRes,
        chartsRes
      ] = await Promise.allSettled([
        sellerService.getProfile(),
        sellerService.getOverview(),
        sellerService.getRevenue(),
        sellerService.getProductsStats(),
        sellerService.getRecentOrders({ limit: 5 }),
        sellerService.getTopProducts({ limit: 5 }),
        sellerService.getRecentReviews({ limit: 5 }),
        sellerService.getDashboardNotifications(),
        sellerService.getCharts({ interval: "monthly" })
      ]);

      if (profRes.status === "fulfilled" && profRes.value) {
        const val: any = profRes.value;
        const profData = val?.data || val;
        if (profData && typeof profData === "object") {
          setProfile(profData as SellerProfile);
        }
      }
      if (overRes.status === "fulfilled" && overRes.value) {
        setOverview(overRes.value.data || overRes.value);
      }
      if (revRes.status === "fulfilled" && revRes.value) {
        setRevenue(revRes.value.data || revRes.value);
      }
      if (prodRes.status === "fulfilled" && prodRes.value) {
        setProdStats(prodRes.value.data || prodRes.value);
      }
      if (ordRes.status === "fulfilled" && ordRes.value) {
        const data = ordRes.value.data || ordRes.value;
        setRecentOrders(Array.isArray(data) ? data : data.items || []);
      }
      if (topRes.status === "fulfilled" && topRes.value) {
        const data = topRes.value.data || topRes.value;
        setTopProducts(Array.isArray(data) ? data : data.items || []);
      }
      if (revsRes.status === "fulfilled" && revsRes.value) {
        const data = revsRes.value.data || revsRes.value;
        setRecentReviews(Array.isArray(data) ? data : data.items || []);
      }
      if (notifRes.status === "fulfilled" && notifRes.value) {
        const data = notifRes.value.data || notifRes.value;
        setNotifications(Array.isArray(data) ? data : data.items || []);
      }
      if (chartsRes.status === "fulfilled" && chartsRes.value) {
        const data = chartsRes.value.data || chartsRes.value;
        setCharts(Array.isArray(data) ? data : []);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load seller dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const storeName = profile?.store_name || profile?.business_name || user?.name || "Seller Store";
  const avatar = profile?.logo || user?.avatar || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80";
  const banner = profile?.banner || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80";
  const isVerified = profile?.status === "approved";

  return (
    <div className="space-y-8 font-['Jost',sans-serif]">
      {/* Error state alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchDashboardData} className="flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase font-semibold underline">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative bg-white border border-[#ececec] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${banner})` }} />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 xl:p-8">
          <div className="relative flex-shrink-0">
            <img src={avatar} alt={storeName} className="w-16 h-16 rounded-full object-cover border-2 border-[#d4145a] bg-white" />
            {isVerified && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#d4145a] rounded-full flex items-center justify-center">
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold mb-1">Welcome Back</p>
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a1a]">{storeName}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={11} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="text-[11px] text-[#6e6e6e] tracking-wide">4.8 (Seller Rating)</span>
              </div>
              <span className="text-[10px] tracking-[0.1em] uppercase text-[#6e6e6e]">Status: {profile?.status || "Active"}</span>
              {isVerified && (
                <span className="text-[9px] tracking-[0.1em] uppercase bg-green-50 text-green-700 px-2.5 py-1 font-semibold">Verified Seller</span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 hidden lg:flex items-center gap-3">
            <button onClick={() => onNavigate("add-product")} className="px-5 py-2.5 bg-[#d4145a] text-white text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#b8114d] transition-colors">
              + Add Product
            </button>
            <button onClick={() => onNavigate("orders")} className="px-5 py-2.5 border border-[#ececec] text-[#1a1a1a] text-[10px] tracking-[0.2em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
              View Orders
            </button>
          </div>
        </div>
      </div>

      {/* Primary Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Products"   value={prodStats.total_products ?? 0}  sub={`${prodStats.active_products ?? 0} active`} loading={loading} />
        <StatCard label="Total Orders"     value={overview.total_orders ?? 0}    sub={`${overview.pending_orders ?? 0} pending`} loading={loading} />
        <StatCard label="Delivered Orders" value={overview.delivered_orders ?? 0} loading={loading} />
        <StatCard label="Total Revenue"    value={fmt(revenue.total_revenue ?? 0)} accent loading={loading} />
      </div>

      {/* Secondary Financial & Stock Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Pending Orders"     value={overview.pending_orders ?? 0} loading={loading} />
        <StatCard label="Pending Settlement" value={fmt(revenue.pending_settlement ?? 0)} sub="In processing" loading={loading} />
        <StatCard label="Net Earnings"       value={fmt(revenue.net_earnings ?? 0)} accent loading={loading} />
        <StatCard label="Low / Out of Stock" value={`${prodStats.low_stock ?? 0} / ${prodStats.out_of_stock ?? 0}`} sub="Low / Out" loading={loading} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white border border-[#ececec] p-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-1">Monthly Revenue Trend</p>
          <p className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a] mb-5">{fmt(revenue.total_revenue ?? 0)} Total Revenue</p>
          {loading ? (
            <div className="h-[200px] w-full bg-gray-100 animate-pulse" />
          ) : charts.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={charts} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#d4145a" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#d4145a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="period" tick={{ fontSize: 10, fill: "#9e9e9e" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9e9e9e" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ border: "1px solid #ececec", borderRadius: 0, fontSize: 11 }} />
                <Area type="monotone" dataKey="value" stroke="#d4145a" strokeWidth={2} fill={`url(#${gradId})`} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-xs text-[#9e9e9e]">No chart revenue data available yet.</div>
          )}
        </div>

        {/* Orders chart */}
        <div className="bg-white border border-[#ececec] p-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-1">Order Volume</p>
          <p className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a] mb-5">{overview.total_orders ?? 0} Orders</p>
          {loading ? (
            <div className="h-[200px] w-full bg-gray-100 animate-pulse" />
          ) : charts.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={charts} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="period" tick={{ fontSize: 9, fill: "#9e9e9e" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9e9e9e" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border: "1px solid #ececec", borderRadius: 0, fontSize: 11 }} />
                <Bar dataKey="value" fill="#d4145a" radius={[2, 2, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-xs text-[#9e9e9e]">No order chart data available yet.</div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-[#ececec]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#ececec]">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Recent</p>
            <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Seller Orders</p>
          </div>
          <button onClick={() => onNavigate("orders")} className="text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#ececec]">
                {["Order #", "Customer", "Subtotal", "Commission", "Net Seller Amount", "Status", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#9e9e9e]">Loading recent orders…</td>
                </tr>
              ) : recentOrders.length > 0 ? (
                recentOrders.map((o: any) => (
                  <tr key={o.id || o.order_number} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                    <td className="px-4 py-3 text-xs font-semibold text-[#d4145a]">{o.order_number || `#${o.id}`}</td>
                    <td className="px-4 py-3 text-xs text-[#1a1a1a]">{o.first_name ? `${o.first_name} ${o.last_name || ""}` : o.customer || "Customer"}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#1a1a1a]">{fmt(o.subtotal || o.amount || 0)}</td>
                    <td className="px-4 py-3 text-xs text-[#9e9e9e]">{fmt(o.commission_amount || 0)}</td>
                    <td className="px-4 py-3 text-xs font-bold text-green-700">{fmt(o.seller_amount || o.net_seller_amount || o.subtotal || 0)}</td>
                    <td className="px-4 py-3"><span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${orderStatusColor(o.order_status || o.status || "pending")}`}>{o.order_status || o.status || "pending"}</span></td>
                    <td className="px-4 py-3">
                      <button onClick={() => onNavigate("orders", o.id)} className="text-[10px] tracking-[0.1em] uppercase text-[#d4145a] hover:underline">View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#9e9e9e]">No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock + Top Selling Products */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Top Selling Products */}
        <div className="bg-white border border-[#ececec]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#ececec]">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Top Selling</p>
              <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Products</p>
            </div>
            <button onClick={() => onNavigate("products")} className="text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline">View All</button>
          </div>
          <div className="divide-y divide-[#ececec]">
            {loading ? (
              <div className="p-5 text-center text-xs text-[#9e9e9e]">Loading top products…</div>
            ) : topProducts.length > 0 ? (
              topProducts.map((p: any, i: number) => (
                <div key={p.product_id || p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[#faf7f4] transition-colors">
                  <span className="text-[11px] font-bold text-[#9e9e9e] w-4 flex-shrink-0">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#1a1a1a] truncate">{p.product_name || p.name}</p>
                    <p className="text-[10px] text-[#6e6e6e] tracking-wide mt-0.5">{p.total_orders || 0} orders</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-[#1a1a1a]">{p.units_sold || p.sold || 0} sold</p>
                    <p className="text-[10px] text-[#d4145a] font-medium">{fmt(p.gross_revenue || p.price || 0)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-center text-xs text-[#9e9e9e]">No top products recorded.</div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-[#ececec]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#ececec]">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Latest</p>
              <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Notifications</p>
            </div>
            <button onClick={() => onNavigate("notifications")} className="text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline">View All</button>
          </div>
          <div className="divide-y divide-[#ececec]">
            {loading ? (
              <div className="p-5 text-center text-xs text-[#9e9e9e]">Loading notifications…</div>
            ) : notifications.length > 0 ? (
              notifications.slice(0, 5).map((n: any) => (
                <div key={n.id} className={`flex items-start gap-3 px-5 py-3 ${!n.is_read && !n.read ? "bg-[#fdf5f8]" : ""}`}>
                  <div className="w-7 h-7 rounded-full bg-[#fce8ef] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bell size={13} strokeWidth={1.5} className="text-[#d4145a]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${!n.is_read && !n.read ? "text-[#1a1a1a]" : "text-[#6e6e6e]"}`}>{n.title || n.subject || "Notification"}</p>
                    <p className="text-[10px] text-[#9e9e9e] font-light mt-0.5 line-clamp-1">{n.message || n.body}</p>
                  </div>
                  <span className="text-[9px] text-[#9e9e9e] tracking-wide flex-shrink-0 mt-0.5">
                    {n.created_at ? new Date(n.created_at).toLocaleDateString() : n.time || "Recent"}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-5 text-center text-xs text-[#9e9e9e]">No unread notifications.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
