import { useId } from "react";
import { ShoppingBag, Package, TrendingUp, AlertTriangle, Star, Bell } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, ResponsiveContainer
} from "recharts";
import {
  MOCK_SELLER, SELLER_STATS, MONTHLY_SALES, SELLER_ORDERS,
  LOW_STOCK_PRODUCTS, BEST_SELLING, SELLER_REVIEWS, SELLER_NOTIFICATIONS,
  orderStatusColor, payStatusColor, fmt,
  type SellerNavigateFn
} from "./sellerData";

const StatCard = ({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) => (
  <div className={`bg-white border border-[#ececec] p-5 hover:shadow-md transition-shadow ${accent ? "border-l-2 border-l-[#d4145a]" : ""}`}>
    <p className="text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-2">{label}</p>
    <p className={`text-2xl font-bold font-['Playfair_Display'] ${accent ? "text-[#d4145a]" : "text-[#1a1a1a]"}`}>{value}</p>
    {sub && <p className="text-[10px] text-[#9e9e9e] mt-1 tracking-wide">{sub}</p>}
  </div>
);

export default function SellerHome({ onNavigate }: { onNavigate: SellerNavigateFn }) {
  const uid = useId().replace(/:/g, "");
  const gradId = `sellerRevGrad-${uid}`;

  return (
    <div className="space-y-8">

      {/* Welcome */}
      <div className="relative bg-white border border-[#ececec] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${MOCK_SELLER.banner})` }} />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 xl:p-8">
          <div className="relative flex-shrink-0">
            <img src={MOCK_SELLER.avatar} alt={MOCK_SELLER.storeName} className="w-16 h-16 rounded-full object-cover border-2 border-[#d4145a]" />
            {MOCK_SELLER.verified && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#d4145a] rounded-full flex items-center justify-center">
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold mb-1">Welcome Back</p>
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a1a]">{MOCK_SELLER.storeName}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map(s => <Star key={s} size={11} className={s <= Math.round(MOCK_SELLER.rating) ? "fill-amber-400 text-amber-400" : "text-[#ececec]"} />)}
                <span className="text-[11px] text-[#6e6e6e] tracking-wide">{MOCK_SELLER.rating} ({MOCK_SELLER.totalRatings} reviews)</span>
              </div>
              <span className="text-[10px] tracking-[0.1em] uppercase text-[#6e6e6e]">Member since {MOCK_SELLER.memberSince}</span>
              {MOCK_SELLER.verified && (
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

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Products"   value={String(SELLER_STATS.totalProducts)}  sub={`${SELLER_STATS.activeProducts} active`} />
        <StatCard label="Total Orders"     value={String(SELLER_STATS.totalOrders)}    sub={`${SELLER_STATS.pendingOrders} pending`} />
        <StatCard label="Delivered Orders" value={String(SELLER_STATS.deliveredOrders)} />
        <StatCard label="Total Revenue"    value={fmt(SELLER_STATS.totalRevenue)}       accent />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Pending Orders"      value={String(SELLER_STATS.pendingOrders)} />
        <StatCard label="Pending Settlement"  value={fmt(SELLER_STATS.pendingSettlement)} sub="In processing" />
        <StatCard label="Total Earnings"      value={fmt(SELLER_STATS.totalEarnings)} accent />
        <StatCard label="Avg Order Value"     value={fmt(Math.round(SELLER_STATS.totalRevenue / SELLER_STATS.totalOrders))} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white border border-[#ececec] p-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-1">Monthly Revenue</p>
          <p className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a] mb-5">{fmt(SELLER_STATS.totalRevenue)} Total</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY_SALES} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#d4145a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#d4145a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9e9e9e" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9e9e9e" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ border: "1px solid #ececec", borderRadius: 0, fontSize: 11 }} />
              <Area type="monotone" dataKey="revenue" stroke="#d4145a" strokeWidth={2} fill={`url(#${gradId})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders chart */}
        <div className="bg-white border border-[#ececec] p-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-1">Monthly Orders</p>
          <p className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a] mb-5">{SELLER_STATS.totalOrders} Total</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_SALES} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#9e9e9e" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9e9e9e" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: "1px solid #ececec", borderRadius: 0, fontSize: 11 }} />
              <Bar dataKey="orders" fill="#d4145a" radius={[2, 2, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-[#ececec]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#ececec]">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Recent</p>
            <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Orders</p>
          </div>
          <button onClick={() => onNavigate("orders")} className="text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#ececec]">
                {["Order", "Customer", "Product", "Qty", "Amount", "Payment", "Status", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SELLER_ORDERS.slice(0, 5).map(o => (
                <tr key={o.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                  <td className="px-4 py-3 text-xs font-semibold text-[#d4145a]">{o.id}</td>
                  <td className="px-4 py-3 text-xs text-[#1a1a1a]">{o.customer}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={o.productImg} alt={o.product} className="w-8 h-10 object-cover bg-[#faf7f4] flex-shrink-0" />
                      <span className="text-xs text-[#1a1a1a] font-medium">{o.product}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6e6e6e]">×{o.qty}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-[#1a1a1a]">{fmt(o.amount)}</td>
                  <td className="px-4 py-3"><span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${payStatusColor(o.paymentStatus)}`}>{o.paymentStatus}</span></td>
                  <td className="px-4 py-3"><span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${orderStatusColor(o.orderStatus)}`}>{o.orderStatus}</span></td>
                  <td className="px-4 py-3">
                    <button onClick={() => onNavigate("orders")} className="text-[10px] tracking-[0.1em] uppercase text-[#d4145a] hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low stock + Best sellers */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Low Stock */}
        <div className="bg-white border border-[#ececec]">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-[#ececec]">
            <AlertTriangle size={15} className="text-amber-500" strokeWidth={2} />
            <div className="flex-1">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Low Stock</p>
              <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Alert</p>
            </div>
            <button onClick={() => onNavigate("inventory")} className="text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline">Manage</button>
          </div>
          <div className="divide-y divide-[#ececec]">
            {LOW_STOCK_PRODUCTS.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[#faf7f4] transition-colors">
                <img src={p.img} alt={p.name} className="w-9 h-11 object-cover bg-[#faf7f4] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#1a1a1a] truncate">{p.name}</p>
                  <p className="text-[10px] text-[#6e6e6e] tracking-wide mt-0.5">{p.sku}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-amber-600">{p.stock} left</p>
                  <button onClick={() => onNavigate("inventory")} className="text-[9px] tracking-[0.08em] uppercase text-[#d4145a] hover:underline mt-0.5">Update</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Sellers */}
        <div className="bg-white border border-[#ececec]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#ececec]">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Top Selling</p>
              <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Products</p>
            </div>
            <button onClick={() => onNavigate("products")} className="text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline">View All</button>
          </div>
          <div className="divide-y divide-[#ececec]">
            {BEST_SELLING.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[#faf7f4] transition-colors">
                <span className="text-[11px] font-bold text-[#9e9e9e] w-4 flex-shrink-0">#{i + 1}</span>
                <img src={p.img} alt={p.name} className="w-9 h-11 object-cover bg-[#faf7f4] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#1a1a1a] truncate">{p.name}</p>
                  <p className="text-[10px] text-[#6e6e6e] tracking-wide mt-0.5">{p.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-[#1a1a1a]">{p.sold} sold</p>
                  <p className="text-[10px] text-[#d4145a] font-medium">{fmt(p.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews + Notifications */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Reviews */}
        <div className="bg-white border border-[#ececec]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#ececec]">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">Latest</p>
              <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Reviews</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-[#1a1a1a]">{MOCK_SELLER.rating}</span>
            </div>
          </div>
          <div className="divide-y divide-[#ececec]">
            {SELLER_REVIEWS.slice(0, 3).map(r => (
              <div key={r.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-xs font-semibold text-[#1a1a1a]">{r.customer}</p>
                    <p className="text-[10px] text-[#6e6e6e] tracking-wide">{r.product}</p>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    {[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= r.rating ? "fill-amber-400 text-amber-400" : "text-[#ececec]"} />)}
                  </div>
                </div>
                <p className="text-xs text-[#6e6e6e] font-light leading-relaxed line-clamp-2">{r.text}</p>
                {!r.replied && (
                  <button className="mt-2 text-[9px] tracking-[0.1em] uppercase text-[#d4145a] hover:underline font-semibold">Reply</button>
                )}
              </div>
            ))}
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
            {SELLER_NOTIFICATIONS.slice(0, 5).map(n => (
              <div key={n.id} className={`flex items-start gap-3 px-5 py-3 ${!n.read ? "bg-[#fdf5f8]" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  n.type === "order" ? "bg-blue-50" :
                  n.type === "payment" ? "bg-green-50" :
                  n.type === "return" ? "bg-red-50" :
                  n.type === "review" ? "bg-amber-50" : "bg-[#fce8ef]"
                }`}>
                  {n.type === "order"   && <ShoppingBag size={13} strokeWidth={1.5} className="text-blue-600" />}
                  {n.type === "payment" && <TrendingUp  size={13} strokeWidth={1.5} className="text-green-600" />}
                  {n.type === "return"  && <Package     size={13} strokeWidth={1.5} className="text-red-500" />}
                  {n.type === "review"  && <Star        size={13} strokeWidth={1.5} className="text-amber-500" />}
                  {n.type === "system"  && <Bell        size={13} strokeWidth={1.5} className="text-[#d4145a]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${!n.read ? "text-[#1a1a1a]" : "text-[#6e6e6e]"}`}>{n.title}</p>
                  <p className="text-[10px] text-[#9e9e9e] font-light mt-0.5 line-clamp-1">{n.body}</p>
                </div>
                <span className="text-[9px] text-[#9e9e9e] tracking-wide flex-shrink-0 mt-0.5">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
