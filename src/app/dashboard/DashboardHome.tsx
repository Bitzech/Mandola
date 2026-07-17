import { ShoppingBag, Heart, ArrowRight, Bell, MapPin, Eye, Truck, Download, Package, Clock } from "lucide-react";
import {
  MOCK_USER, MOCK_ORDERS, MOCK_WISHLIST, MOCK_NOTIFICATIONS,
  MOCK_ADDRESSES, RECENTLY_VIEWED, deliveryStatusColor, paymentStatusColor
} from "./dashboardData";
import type { NavigateFn } from "./dashboardData";

const statCards = [
  { label: "Total Orders",   value: MOCK_ORDERS.length, icon: <ShoppingBag size={20} strokeWidth={1.5} />, color: "bg-blue-50 text-blue-600" },
  { label: "Pending Orders", value: MOCK_ORDERS.filter(o => o.deliveryStatus === "Processing" || o.deliveryStatus === "Shipped").length, icon: <Clock size={20} strokeWidth={1.5} />, color: "bg-amber-50 text-amber-600" },
  { label: "Delivered",      value: MOCK_ORDERS.filter(o => o.deliveryStatus === "Delivered").length, icon: <Package size={20} strokeWidth={1.5} />, color: "bg-emerald-50 text-emerald-600" },
  { label: "Wishlist Items", value: MOCK_WISHLIST.length, icon: <Heart size={20} strokeWidth={1.5} />, color: "bg-[#fce8ef] text-[#d4145a]" },
];

export default function DashboardHome({ onNavigate }: { onNavigate: NavigateFn }) {
  const unread = MOCK_NOTIFICATIONS.filter(n => !n.read).length;
  const defaultAddress = MOCK_ADDRESSES.find(a => a.isDefault);
  const recentOrders = MOCK_ORDERS.slice(0, 3);

  return (
    <div className="space-y-6">

      {/* ── Welcome banner ── */}
      <div className="bg-white border border-[#ececec] p-6 md:p-8" style={{ background: "linear-gradient(135deg, #ffffff 0%, #fdf4f7 60%, #fce8ef 100%)" }}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="relative">
            <img src={MOCK_USER.avatar} alt={MOCK_USER.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white shadow-md" />
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Welcome back</p>
            <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-0.5">{MOCK_USER.name}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
              <span className="text-xs text-[#6e6e6e] tracking-wide">{MOCK_USER.email}</span>
              <span className="text-xs text-[#6e6e6e] tracking-wide">Member since {MOCK_USER.memberSince}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => onNavigate("orders")} className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors">
              View Orders <ArrowRight size={13} />
            </button>
            <button onClick={() => onNavigate("profile")} className="px-5 py-2.5 border border-[#1a1a1a] text-[#1a1a1a] text-[10px] tracking-[0.2em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="bg-white border border-[#ececec] p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a1a]">{s.value}</p>
              <p className="text-[10px] tracking-[0.1em] uppercase text-[#6e6e6e] mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Profile completion ── */}
      {MOCK_USER.profileCompletion < 100 && (
        <div className="bg-white border border-[#ececec] p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-[#1a1a1a]">Profile Completion</p>
              <p className="text-xs text-[#6e6e6e] font-light mt-0.5">Complete your profile to unlock ₹100 cashback</p>
            </div>
            <span className="font-['Playfair_Display'] text-xl font-bold text-[#d4145a]">{MOCK_USER.profileCompletion}%</span>
          </div>
          <div className="h-1.5 bg-[#ececec] rounded-full overflow-hidden">
            <div className="h-full bg-[#d4145a] transition-all duration-700 rounded-full" style={{ width: `${MOCK_USER.profileCompletion}%` }} />
          </div>
          {MOCK_USER.missingFields.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-[10px] text-[#6e6e6e] tracking-wide">Missing:</span>
              {MOCK_USER.missingFields.map(f => (
                <span key={f} className="text-[10px] bg-[#fce8ef] text-[#d4145a] px-2 py-0.5 font-medium">{f}</span>
              ))}
              <button onClick={() => onNavigate("profile")} className="text-[10px] text-[#d4145a] hover:underline ml-1 tracking-wide">Complete Now →</button>
            </div>
          )}
        </div>
      )}

      {/* ── Recent Orders ── */}
      <div className="bg-white border border-[#ececec]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ececec]">
          <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Recent Orders</h3>
          <button onClick={() => onNavigate("orders")} className="flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline transition-colors">
            View All <ArrowRight size={11} />
          </button>
        </div>
        <div className="divide-y divide-[#ececec]">
          {recentOrders.map(order => (
            <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 py-4 hover:bg-[#faf7f4] transition-colors">
              <img src={order.items[0].img} alt={order.items[0].name} className="w-14 h-16 object-cover bg-[#faf7f4] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 items-center">
                  <p className="text-xs font-semibold text-[#1a1a1a]">{order.id}</p>
                  <span className={`text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 ${deliveryStatusColor(order.deliveryStatus)}`}>{order.deliveryStatus}</span>
                  <span className={`text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 ${paymentStatusColor(order.paymentStatus)}`}>{order.paymentStatus}</span>
                </div>
                <p className="text-xs text-[#6e6e6e] mt-0.5 truncate">
                  {order.items.map(i => i.name).join(", ")} · {order.date}
                </p>
                <p className="text-sm font-semibold text-[#1a1a1a] mt-0.5">₹{order.amount.toLocaleString("en-IN")}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => onNavigate("order-details", order.id)}
                  className="flex items-center gap-1 text-[10px] tracking-[0.12em] uppercase border border-[#ececec] px-3 py-1.5 text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
                  <Eye size={11} /> Details
                </button>
                {order.deliveryStatus !== "Delivered" && order.deliveryStatus !== "Cancelled" && (
                  <button onClick={() => onNavigate("tracking", order.id)}
                    className="flex items-center gap-1 text-[10px] tracking-[0.12em] uppercase border border-[#ececec] px-3 py-1.5 text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
                    <Truck size={11} /> Track
                  </button>
                )}
                {order.paymentStatus === "Paid" && (
                  <button className="flex items-center gap-1 text-[10px] tracking-[0.12em] uppercase border border-[#ececec] px-3 py-1.5 text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
                    <Download size={11} /> Invoice
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Wishlist preview + Notifications ── */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Wishlist */}
        <div className="bg-white border border-[#ececec]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#ececec]">
            <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Wishlist</h3>
            <button onClick={() => onNavigate("wishlist")} className="flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline">
              View All <ArrowRight size={11} />
            </button>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            {MOCK_WISHLIST.slice(0, 4).map(item => {
              const discount = Math.round(((item.mrp - item.price) / item.mrp) * 100);
              return (
                <div key={item.id} className="group">
                  <div className="relative overflow-hidden aspect-[3/4] bg-[#faf7f4]">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute top-2 right-2 text-[9px] font-semibold bg-[#d4145a] text-white px-1.5 py-0.5">-{discount}%</span>
                  </div>
                  <p className="text-xs font-medium text-[#1a1a1a] mt-1.5 leading-snug">{item.name}</p>
                  <p className="text-xs font-semibold text-[#1a1a1a]">₹{item.price.toLocaleString("en-IN")}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-[#ececec]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#ececec]">
            <div className="flex items-center gap-2">
              <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Notifications</h3>
              {unread > 0 && (
                <span className="w-5 h-5 bg-[#d4145a] text-white text-[9px] rounded-full flex items-center justify-center font-bold">{unread}</span>
              )}
            </div>
            <button onClick={() => onNavigate("notifications")} className="flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline">
              View All <ArrowRight size={11} />
            </button>
          </div>
          <div className="divide-y divide-[#ececec]">
            {MOCK_NOTIFICATIONS.slice(0, 4).map(n => (
              <div key={n.id} className={`flex gap-3 px-5 py-3.5 ${!n.read ? "bg-[#fdf9f5]" : ""}`}>
                <Bell size={14} strokeWidth={1.5} className={`flex-shrink-0 mt-0.5 ${!n.read ? "text-[#d4145a]" : "text-[#9e9e9e]"}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-snug ${!n.read ? "font-semibold text-[#1a1a1a]" : "font-medium text-[#6e6e6e]"}`}>{n.title}</p>
                  <p className="text-[10px] text-[#9e9e9e] tracking-wide mt-0.5">{n.time}</p>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full bg-[#d4145a] flex-shrink-0 mt-1.5" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Account info + Address ── */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Account info */}
        <div className="bg-white border border-[#ececec] p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#ececec]">
            <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Account Information</h3>
            <button onClick={() => onNavigate("profile")} className="text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline">Edit</button>
          </div>
          <div className="space-y-3">
            {[
              ["Full Name",  MOCK_USER.name],
              ["Email",      MOCK_USER.email],
              ["Phone",      MOCK_USER.phone],
              ["Gender",     MOCK_USER.gender],
              ["Birthday",   MOCK_USER.dob],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-4">
                <span className="text-[10px] tracking-[0.1em] uppercase text-[#9e9e9e] w-20 flex-shrink-0 mt-0.5">{k}</span>
                <span className="text-xs font-medium text-[#1a1a1a]">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="bg-white border border-[#ececec] p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#ececec]">
            <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Default Address</h3>
            <button onClick={() => onNavigate("addresses")} className="text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline">Manage</button>
          </div>
          {defaultAddress ? (
            <div className="flex items-start gap-3">
              <MapPin size={16} strokeWidth={1.5} className="text-[#d4145a] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-[#1a1a1a]">{defaultAddress.name}</p>
                <p className="text-xs text-[#6e6e6e] font-light leading-relaxed mt-1">
                  {defaultAddress.line1}{defaultAddress.line2 ? `, ${defaultAddress.line2}` : ""}<br />
                  {defaultAddress.city}, {defaultAddress.state} — {defaultAddress.pincode}
                </p>
                <p className="text-xs text-[#6e6e6e] mt-1">{defaultAddress.phone}</p>
              </div>
            </div>
          ) : (
            <button onClick={() => onNavigate("addresses")} className="text-sm text-[#d4145a] hover:underline">+ Add an address</button>
          )}
          <button onClick={() => onNavigate("addresses")} className="mt-5 w-full border border-[#ececec] text-[#1a1a1a] py-2.5 text-[10px] tracking-[0.15em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
            + Add New Address
          </button>
        </div>
      </div>

      {/* ── Recently Viewed ── */}
      <div className="bg-white border border-[#ececec]">
        <div className="px-6 py-4 border-b border-[#ececec]">
          <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Recently Viewed</h3>
        </div>
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {RECENTLY_VIEWED.map(p => {
            const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
            return (
              <div key={p.id} className="group cursor-pointer">
                <div className="relative overflow-hidden aspect-[3/4] bg-[#faf7f4]">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute top-2 right-2 text-[9px] font-semibold bg-[#d4145a] text-white px-1.5 py-0.5">-{discount}%</span>
                  <div className="absolute bottom-0 inset-x-0 bg-[#1a1a1a] text-white text-center py-2 text-[10px] tracking-[0.15em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-1.5">
                    <Eye size={11} /> Quick View
                  </div>
                </div>
                <p className="text-xs font-medium text-[#1a1a1a] mt-2 leading-snug">{p.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-semibold">₹{p.price.toLocaleString("en-IN")}</span>
                  <span className="text-[10px] text-[#6e6e6e] line-through">₹{p.mrp.toLocaleString("en-IN")}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="bg-white border border-[#ececec] p-6">
        <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Continue Shopping", action: "home", primary: true },
            { label: "View All Orders",   action: "orders" },
            { label: "Edit Profile",      action: "profile" },
            { label: "Contact Support",   action: "notifications" },
          ].map(btn => (
            <button
              key={btn.label}
              onClick={() => onNavigate(btn.action as Parameters<NavigateFn>[0])}
              className={`py-3 text-[10px] tracking-[0.15em] uppercase font-semibold transition-colors ${btn.primary ? "bg-[#1a1a1a] text-white hover:bg-[#d4145a]" : "border border-[#ececec] text-[#1a1a1a] hover:border-[#d4145a] hover:text-[#d4145a]"}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
