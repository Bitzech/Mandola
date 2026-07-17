import { useId } from "react";
import { Users, Store, Package, ShoppingBag, TrendingUp, RotateCcw, Wallet, AlertTriangle, Star, Bell } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Legend
} from "recharts";
import {
  MOCK_ADMIN, ADMIN_STATS, ADMIN_MONTHLY, TOP_CATEGORIES,
  ADMIN_ORDERS, ADMIN_SELLERS, ADMIN_NOTIFICATIONS, ADMIN_REVIEWS,
  orderStatusColor, payStatusColor, fmt,
  type AdminNavigateFn
} from "./adminData";

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
  const uid = useId().replace(/:/g, "");
  const gradId = `adminRevGrad-${uid}`;

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-6">

      {/* Welcome */}
      <div className="bg-white border border-[#ececec] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src={MOCK_ADMIN.avatar} alt={MOCK_ADMIN.name} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#d4145a] font-semibold">Welcome back</p>
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a1a]">{MOCK_ADMIN.name}</h2>
            <p className="text-xs text-[#6e6e6e] font-light mt-0.5">{today}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => onNavigate("sellers")} className="px-4 py-2 bg-[#d4145a] text-white text-[9px] tracking-[0.15em] uppercase font-semibold hover:bg-[#b8114d] transition-colors">
            Approve Sellers (2)
          </button>
          <button onClick={() => onNavigate("products")} className="px-4 py-2 border border-[#ececec] text-[#1a1a1a] text-[9px] tracking-[0.15em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
            Approve Products
          </button>
          <button onClick={() => onNavigate("reports")} className="px-4 py-2 border border-[#ececec] text-[#1a1a1a] text-[9px] tracking-[0.15em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
            Reports
          </button>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Customers"   value={ADMIN_STATS.totalCustomers.toLocaleString()} Icon={Users}       />
        <StatCard label="Total Sellers"     value={ADMIN_STATS.totalSellers}                     Icon={Store}       sub="2 pending" />
        <StatCard label="Active Products"   value={ADMIN_STATS.activeProducts.toLocaleString()}  Icon={Package}     sub={`${ADMIN_STATS.pendingProducts} pending`} />
        <StatCard label="Today's Revenue"   value={fmt(ADMIN_STATS.todayRevenue)}                Icon={TrendingUp}  accent />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Today's Orders"    value={ADMIN_STATS.todayOrders}                      Icon={ShoppingBag} sub={`${ADMIN_STATS.pendingOrders} pending`} />
        <StatCard label="Monthly Revenue"   value={fmt(ADMIN_STATS.monthlyRevenue)}              Icon={TrendingUp}  accent />
        <StatCard label="Commission"        value={fmt(ADMIN_STATS.platformCommission)}          Icon={Wallet}      sub="This month" />
        <StatCard label="Return Requests"   value={ADMIN_STATS.returnRequests}                   Icon={RotateCcw}   sub={`${ADMIN_STATS.pendingRefunds} refunds pending`} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Revenue */}
        <div className="lg:col-span-2 bg-white border border-[#ececec] p-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-1">Monthly</p>
          <p className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a] mb-4">{fmt(ADMIN_STATS.monthlyRevenue)} Revenue</p>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={ADMIN_MONTHLY} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#d4145a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#d4145a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#9e9e9e" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9e9e9e" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000000).toFixed(1)}M`} />
              <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ border: "1px solid #ececec", borderRadius: 0, fontSize: 11 }} />
              <Area type="monotone" dataKey="revenue" stroke="#d4145a" strokeWidth={2} fill={`url(#${gradId})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top categories pie */}
        <div className="bg-white border border-[#ececec] p-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-1">By Category</p>
          <p className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a] mb-4">Top Sales</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={TOP_CATEGORIES} dataKey="orders" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3}>
                {TOP_CATEGORIES.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ border: "1px solid #ececec", borderRadius: 0, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {TOP_CATEGORIES.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] text-[#6e6e6e]">{c.name}</span>
                </div>
                <span className="text-[10px] font-semibold text-[#1a1a1a]">{c.orders.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders chart + Monthly orders */}
      <div className="bg-white border border-[#ececec] p-5">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-1">Order Statistics</p>
        <p className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a] mb-4">Monthly Orders & Commission</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={ADMIN_MONTHLY} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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

      {/* Recent Orders + Pending Sellers */}
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
                  {["Order", "Customer", "Amount", "Payment", "Status"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ADMIN_ORDERS.map(o => (
                  <tr key={o.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                    <td className="px-4 py-3 text-xs font-semibold text-[#d4145a]">{o.id}</td>
                    <td className="px-4 py-3 text-xs text-[#1a1a1a]">{o.customer}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#1a1a1a]">{fmt(o.amount)}</td>
                    <td className="px-4 py-3"><span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${payStatusColor(o.payStatus)}`}>{o.payStatus}</span></td>
                    <td className="px-4 py-3"><span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${orderStatusColor(o.orderStatus)}`}>{o.orderStatus}</span></td>
                  </tr>
                ))}
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
            {ADMIN_SELLERS.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[#faf7f4] transition-colors">
                <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#1a1a1a] truncate">{s.store}</p>
                  <p className="text-[10px] text-[#6e6e6e] truncate">{s.joined}</p>
                </div>
                <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold flex-shrink-0 ${
                  s.status === "Approved" ? "bg-green-50 text-green-700" :
                  s.status === "Pending"  ? "bg-amber-50 text-amber-700" :
                  s.status === "Suspended" ? "bg-gray-100 text-gray-500" :
                  "bg-red-50 text-red-600"
                }`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews + Notifications */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-[#ececec]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#ececec]">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Latest</p>
              <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Reviews</p>
            </div>
            <button onClick={() => onNavigate("reviews")} className="text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline">View All</button>
          </div>
          <div className="divide-y divide-[#ececec]">
            {ADMIN_REVIEWS.map(r => (
              <div key={r.id} className="px-5 py-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-semibold text-[#1a1a1a]">{r.customer}</p>
                    {r.reported && <span className="text-[8px] tracking-wide uppercase bg-red-50 text-red-600 px-1.5 py-0.5 font-semibold">Reported</span>}
                  </div>
                  <p className="text-[10px] text-[#6e6e6e]">{r.product}</p>
                  <p className="text-xs text-[#6e6e6e] font-light mt-1 line-clamp-1">{r.text}</p>
                </div>
                <div className="flex-shrink-0">
                  {[1,2,3,4,5].map(s => <Star key={s} size={9} className={s <= r.rating ? "fill-amber-400 text-amber-400" : "text-[#ececec]"} />)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#ececec]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#ececec]">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Latest</p>
              <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Notifications</p>
            </div>
            <button onClick={() => onNavigate("notifications")} className="text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline">View All</button>
          </div>
          <div className="divide-y divide-[#ececec]">
            {ADMIN_NOTIFICATIONS.map(n => (
              <div key={n.id} className={`flex items-start gap-3 px-5 py-3 ${!n.read ? "bg-[#fdf5f8]" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${!n.read ? "bg-[#fce8ef]" : "bg-[#faf7f4]"}`}>
                  <Bell size={12} strokeWidth={1.5} className={!n.read ? "text-[#d4145a]" : "text-[#9e9e9e]"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium leading-tight ${!n.read ? "text-[#1a1a1a]" : "text-[#6e6e6e]"}`}>{n.title}</p>
                  <p className="text-[10px] text-[#9e9e9e] font-light mt-0.5 line-clamp-1">{n.body}</p>
                </div>
                <span className="text-[9px] text-[#9e9e9e] flex-shrink-0 mt-0.5">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
