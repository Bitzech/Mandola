import { useState, useEffect } from "react";
import { ShoppingBag, Heart, ArrowRight, Bell, MapPin, Eye, Truck, Download, Package, Clock, RefreshCw } from "lucide-react";
import { deliveryStatusColor, paymentStatusColor } from "./dashboardData";
import type { NavigateFn } from "./dashboardData";
import { useAuth } from "../context/AuthContext";
import { orderService } from "../services/order.service";
import { wishlistService } from "../services/wishlist.service";
import { cartService } from "../services/cart.service";
import { notificationService } from "../services/notification.service";
import { addressService } from "../services/address.service";
import { extractErrorMessage } from "../utils/errorExtractor";
import { toast } from "sonner";

export default function DashboardHome({ onNavigate }: { onNavigate: NavigateFn }) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<any | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, wishlistRes, notificationsRes, addressRes, cartRes] = await Promise.allSettled([
        orderService.getOrders({ limit: 10 }),
        wishlistService.getWishlist(),
        notificationService.getNotifications({ limit: 10 }),
        addressService.getAddresses(),
        cartService.getCartSummary(),
      ]);

      if (ordersRes.status === "fulfilled") {
        const orderData = ordersRes.value.data || ordersRes.value.items || ordersRes.value;
        setOrders(Array.isArray(orderData) ? orderData : []);
      }

      if (wishlistRes.status === "fulfilled") {
        const wlData = wishlistRes.value;
        setWishlistItems(Array.isArray(wlData) ? wlData : []);
      }

      if (notificationsRes.status === "fulfilled") {
        const notifData = notificationsRes.value.data || notificationsRes.value.items || notificationsRes.value;
        setNotifications(Array.isArray(notifData) ? notifData : []);
      }

      if (addressRes.status === "fulfilled") {
        const addrs = addressRes.value.data || addressRes.value;
        if (Array.isArray(addrs)) {
          const def = addrs.find((a: any) => a.is_default || a.isDefault) || addrs[0] || null;
          setDefaultAddress(def);
        }
      }

      if (cartRes.status === "fulfilled") {
        const cSummary = cartRes.value.data || cartRes.value;
        setCartCount(cSummary?.total_items || cSummary?.count || 0);
      }
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load dashboard statistics.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Compute metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "processing" || o.status === "shipped" || o.deliveryStatus === "Processing" || o.deliveryStatus === "Shipped"
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered" || o.deliveryStatus === "Delivered").length;
  const wishlistCount = wishlistItems.length;

  const statCards = [
    { label: "Total Orders",   value: totalOrders, icon: <ShoppingBag size={20} strokeWidth={1.5} />, color: "bg-blue-50 text-blue-600" },
    { label: "Pending Orders", value: pendingOrders, icon: <Clock size={20} strokeWidth={1.5} />, color: "bg-amber-50 text-amber-600" },
    { label: "Delivered",      value: deliveredOrders, icon: <Package size={20} strokeWidth={1.5} />, color: "bg-emerald-50 text-emerald-600" },
    { label: "Wishlist Items", value: wishlistCount, icon: <Heart size={20} strokeWidth={1.5} />, color: "bg-[#fce8ef] text-[#d4145a]" },
  ];

  const userName = user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Customer";
  const userEmail = user?.email || "";
  const userAvatar = user?.avatar || user?.profile_image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop";

  // Calculate live profile completion & missing fields
  const missingFields: string[] = [];
  if (!user?.first_name || !user?.last_name) missingFields.push("Full Name");
  if (!user?.phone) missingFields.push("Phone Number");
  if (!user?.dob) missingFields.push("Date of Birth");
  if (!user?.avatar && !user?.profile_image) missingFields.push("Profile Picture");

  const totalFields = 4;
  const completedFields = totalFields - missingFields.length;
  const profileCompletion = Math.round((completedFields / totalFields) * 100);

  const unreadNotifs = notifications.filter((n) => !n.is_read && !n.read).length;
  const recentOrders = orders.slice(0, 3);
  const recentWishlist = wishlistItems.slice(0, 4);

  const formatCurrency = (val: number | string) => {
    const num = Number(val) || 0;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "January 2024";

  return (
    <div className="space-y-6">

      {/* ── Welcome banner ── */}
      <div className="bg-white border border-[#ececec] p-6 md:p-8" style={{ background: "linear-gradient(135deg, #ffffff 0%, #fdf4f7 60%, #fce8ef 100%)" }}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="relative">
            <img src={userAvatar} alt={userName} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white shadow-md" />
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Welcome back</p>
            <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-0.5">{userName}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
              <span className="text-xs text-[#6e6e6e] tracking-wide">{userEmail}</span>
              <span className="text-xs text-[#6e6e6e] tracking-wide">Member since {memberSince}</span>
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

      {/* Loading Skeleton / Error State */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-[#ececec] p-5 h-24 rounded-none bg-slate-100" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-6 text-center">
          <p className="text-sm text-red-600 font-light mb-3">{error}</p>
          <button onClick={loadDashboardData} className="px-4 py-2 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={12} /> Retry Loading
          </button>
        </div>
      ) : (
        <>
          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s) => (
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
          {profileCompletion < 100 && (
            <div className="bg-white border border-[#ececec] p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">Profile Completion</p>
                  <p className="text-xs text-[#6e6e6e] font-light mt-0.5">Complete your profile to unlock exclusive personalized offers</p>
                </div>
                <span className="font-['Playfair_Display'] text-xl font-bold text-[#d4145a]">{profileCompletion}%</span>
              </div>
              <div className="h-1.5 bg-[#ececec] rounded-full overflow-hidden">
                <div className="h-full bg-[#d4145a] transition-all duration-700 rounded-full" style={{ width: `${profileCompletion}%` }} />
              </div>
              {missingFields.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-[10px] text-[#6e6e6e] tracking-wide">Missing:</span>
                  {missingFields.map((f) => (
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
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-[#6e6e6e] font-light">No orders placed yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#ececec]">
                {recentOrders.map((order: any) => {
                  const orderId = order.order_number || order.id || `MND-${order.id}`;
                  const orderItems = order.items || order.order_items || [];
                  const firstItem = orderItems[0] || {};
                  const itemImg = firstItem.thumbnail || firstItem.product_image || firstItem.img || "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=120&h=150&fit=crop";
                  const delStatus = order.delivery_status || order.deliveryStatus || order.order_status || order.status || "Processing";
                  const payStatus = order.payment_status || order.paymentStatus || "Paid";
                  const totalAmt = order.grand_total || order.total_amount || order.amount || 0;
                  const orderDate = order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : order.date || "Today";

                  return (
                    <div key={order.id || orderId} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 py-4 hover:bg-[#faf7f4] transition-colors">
                      <img src={itemImg} alt={firstItem.product_name || "Order Item"} className="w-14 h-16 object-cover bg-[#faf7f4] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 items-center">
                          <p className="text-xs font-semibold text-[#1a1a1a]">{orderId}</p>
                          <span className={`text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 ${deliveryStatusColor(delStatus)}`}>{delStatus}</span>
                          <span className={`text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 ${paymentStatusColor(payStatus)}`}>{payStatus}</span>
                        </div>
                        <p className="text-xs text-[#6e6e6e] mt-0.5 truncate">
                          {orderItems.map((i: any) => i.product_name || i.name).join(", ") || "Fashion Item"} · {orderDate}
                        </p>
                        <p className="text-sm font-semibold text-[#1a1a1a] mt-0.5">{formatCurrency(totalAmt)}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => onNavigate("order-details", String(order.id || orderId))}
                          className="flex items-center gap-1 text-[10px] tracking-[0.12em] uppercase border border-[#ececec] px-3 py-1.5 text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
                          <Eye size={11} /> Details
                        </button>
                        {delStatus !== "Delivered" && delStatus !== "Cancelled" && (
                          <button onClick={() => onNavigate("tracking", String(order.id || orderId))}
                            className="flex items-center gap-1 text-[10px] tracking-[0.12em] uppercase border border-[#ececec] px-3 py-1.5 text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
                            <Truck size={11} /> Track
                          </button>
                        )}
                        {(payStatus === "Paid" || payStatus === "paid") && (
                          <button onClick={() => onNavigate("invoices")} className="flex items-center gap-1 text-[10px] tracking-[0.12em] uppercase border border-[#ececec] px-3 py-1.5 text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
                            <Download size={11} /> Invoice
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
              {recentWishlist.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-[#6e6e6e] font-light">Your wishlist is empty.</p>
                </div>
              ) : (
                <div className="p-5 grid grid-cols-2 gap-3">
                  {recentWishlist.map((item: any) => {
                    const price = item.sale_price || item.base_price || item.price || 0;
                    const mrp = item.base_price || item.mrp || price;
                    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
                    const img = item.thumbnail || item.product_image || item.img || "https://images.unsplash.com/photo-1739429942851-9083ee185d3d?w=300&h=400&fit=crop";

                    return (
                      <div key={item.id || item.product_id} className="group">
                        <div className="relative overflow-hidden aspect-[3/4] bg-[#faf7f4]">
                          <img src={img} alt={item.product_name || item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          {discount > 0 && (
                            <span className="absolute top-2 right-2 text-[9px] font-semibold bg-[#d4145a] text-white px-1.5 py-0.5">-{discount}%</span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-[#1a1a1a] mt-1.5 leading-snug truncate">{item.product_name || item.name}</p>
                        <p className="text-xs font-semibold text-[#1a1a1a]">{formatCurrency(price)}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="bg-white border border-[#ececec]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#ececec]">
                <div className="flex items-center gap-2">
                  <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Notifications</h3>
                  {unreadNotifs > 0 && (
                    <span className="w-5 h-5 bg-[#d4145a] text-white text-[9px] rounded-full flex items-center justify-center font-bold">{unreadNotifs}</span>
                  )}
                </div>
                <button onClick={() => onNavigate("notifications")} className="flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline">
                  View All <ArrowRight size={11} />
                </button>
              </div>
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-[#6e6e6e] font-light">No notifications.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#ececec]">
                  {notifications.slice(0, 4).map((n: any) => {
                    const isRead = n.is_read || n.read;
                    const notifTime = n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : n.time || "Recently";

                    return (
                      <div key={n.id} className={`flex gap-3 px-5 py-3.5 ${!isRead ? "bg-[#fdf9f5]" : ""}`}>
                        <Bell size={14} strokeWidth={1.5} className={`flex-shrink-0 mt-0.5 ${!isRead ? "text-[#d4145a]" : "text-[#9e9e9e]"}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-snug ${!isRead ? "font-semibold text-[#1a1a1a]" : "font-medium text-[#6e6e6e]"}`}>{n.title || n.subject || "Notification"}</p>
                          <p className="text-[10px] text-[#9e9e9e] tracking-wide mt-0.5">{notifTime}</p>
                        </div>
                        {!isRead && <span className="w-2 h-2 rounded-full bg-[#d4145a] flex-shrink-0 mt-1.5" />}
                      </div>
                    );
                  })}
                </div>
              )}
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
                  ["Full Name", userName],
                  ["Email", userEmail],
                  ["Phone", user?.phone || "Not set"],
                  ["Account Status", "Active"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-[10px] tracking-[0.1em] uppercase text-[#6e6e6e]">{k}</span>
                    <span className={`text-xs font-medium ${k === "Account Status" ? "text-emerald-600 font-semibold" : "text-[#1a1a1a]"}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Default Address */}
            <div className="bg-white border border-[#ececec] p-5">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#ececec]">
                <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">Default Address</h3>
                <button onClick={() => onNavigate("addresses")} className="text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline">Manage</button>
              </div>
              {defaultAddress ? (
                <div className="flex items-start gap-3">
                  <MapPin size={16} strokeWidth={1.5} className="text-[#d4145a] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[#1a1a1a]">{defaultAddress.full_name || defaultAddress.name || userName}</p>
                    <p className="text-xs text-[#6e6e6e] font-light leading-relaxed mt-0.5">
                      {defaultAddress.address_line_1 || defaultAddress.line1}
                      {defaultAddress.address_line_2 || defaultAddress.line2 ? `, ${defaultAddress.address_line_2 || defaultAddress.line2}` : ""}<br />
                      {defaultAddress.city}, {defaultAddress.state} — {defaultAddress.pincode}
                    </p>
                    <p className="text-xs text-[#6e6e6e] mt-1">{defaultAddress.phone}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-[#6e6e6e] font-light mb-2">No default shipping address set.</p>
                  <button onClick={() => onNavigate("addresses")} className="text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline">Add Address</button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
