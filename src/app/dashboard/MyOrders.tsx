import { useState } from "react";
import { Search, Eye, Truck, Download } from "lucide-react";
import { MOCK_ORDERS, deliveryStatusColor, paymentStatusColor } from "./dashboardData";
import type { NavigateFn } from "./dashboardData";

type StatusFilter = "All" | "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled";

export default function MyOrders({ onNavigate }: { onNavigate: NavigateFn }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("All");

  const filtered = MOCK_ORDERS.filter(o => {
    const matchStatus = filter === "All" || o.deliveryStatus === filter;
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">History</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">My Orders</h2>
        <p className="text-sm text-[#6e6e6e] font-light mt-1">{MOCK_ORDERS.length} orders placed</p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9e9e9e]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or product…"
            className="w-full border border-[#ececec] pl-10 pr-4 py-2.5 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["All", "Processing", "Shipped", "Delivered", "Cancelled"] as StatusFilter[]).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 text-[10px] tracking-[0.1em] uppercase border transition-colors ${filter === s ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "border-[#ececec] text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a]"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-[#ececec] p-16 text-center">
          <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a]">No orders found</p>
          <p className="text-sm text-[#6e6e6e] font-light mt-1">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white border border-[#ececec] p-5">
              {/* Header row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#ececec] mb-4">
                <div className="flex flex-wrap gap-3 items-center">
                  <span className="text-xs font-semibold text-[#1a1a1a] tracking-wide">{order.id}</span>
                  <span className="text-[10px] text-[#6e6e6e] tracking-wide">{order.date}</span>
                  <span className={`text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 ${deliveryStatusColor(order.deliveryStatus)}`}>
                    {order.deliveryStatus}
                  </span>
                  <span className={`text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 ${paymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <span className="text-sm font-semibold text-[#1a1a1a]">₹{order.amount.toLocaleString("en-IN")}</span>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={item.img} alt={item.name} className="w-14 h-16 object-cover bg-[#faf7f4] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#1a1a1a]">{item.name}</p>
                      <p className="text-[10px] text-[#6e6e6e] tracking-wide mt-0.5">
                        Size: {item.size} &nbsp;·&nbsp; Qty: {item.qty} &nbsp;·&nbsp; ₹{item.price.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[10px] text-[#9e9e9e] tracking-wide">Seller: {order.seller}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-[#ececec]">
                <button onClick={() => onNavigate("order-details", order.id)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-[#ececec] text-[#1a1a1a] text-[10px] tracking-[0.15em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
                  <Eye size={12} /> View Details
                </button>
                {order.deliveryStatus !== "Cancelled" && order.deliveryStatus !== "Delivered" && (
                  <button onClick={() => onNavigate("tracking", order.id)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-[#ececec] text-[#1a1a1a] text-[10px] tracking-[0.15em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
                    <Truck size={12} /> Track Order
                  </button>
                )}
                {order.paymentStatus === "Paid" && (
                  <button className="flex items-center gap-1.5 px-4 py-2 border border-[#ececec] text-[#1a1a1a] text-[10px] tracking-[0.15em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
                    <Download size={12} /> Invoice
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
