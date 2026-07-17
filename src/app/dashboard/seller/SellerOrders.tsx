import { useState } from "react";
import { Printer } from "lucide-react";
import { SELLER_ORDERS, orderStatusColor, payStatusColor, fmt, type SellerNavigateFn } from "./sellerData";
import type { SellerOrder } from "./sellerData";

const STATUSES = ["All", "Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];

export default function SellerOrders({ onNavigate: _ }: { onNavigate: SellerNavigateFn }) {
  const [filter, setFilter] = useState("All");
  const [statusUpdate, setStatusUpdate] = useState<Record<string, SellerOrder["orderStatus"]>>({});

  const NEXT_STATUS: Record<string, SellerOrder["orderStatus"]> = {
    Pending: "Confirmed", Confirmed: "Packed", Packed: "Shipped", Shipped: "Delivered"
  };

  const getStatus = (o: SellerOrder) => statusUpdate[o.id] ?? o.orderStatus;

  const filtered = SELLER_ORDERS.filter(o =>
    filter === "All" || getStatus(o) === filter
  );

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Orders</h2>
      </div>

      {/* Status tabs */}
      <div className="flex overflow-x-auto gap-1 mb-5 bg-white border border-[#ececec] p-1">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`flex-shrink-0 px-4 py-2 text-[10px] tracking-[0.12em] uppercase font-semibold transition-colors ${
              filter === s
                ? "bg-[#d4145a] text-white"
                : "text-[#6e6e6e] hover:text-[#1a1a1a]"
            }`}
          >
            {s}
            <span className="ml-1.5 opacity-60">
              ({s === "All" ? SELLER_ORDERS.length : SELLER_ORDERS.filter(o => getStatus(o) === s).length})
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(o => {
          const currentStatus = getStatus(o);
          const nextStatus = NEXT_STATUS[currentStatus];
          return (
            <div key={o.id} className="bg-white border border-[#ececec] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-[#ececec]">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs font-bold text-[#d4145a]">{o.id}</p>
                    <p className="text-[10px] text-[#9e9e9e] tracking-wide mt-0.5">{o.date}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1a1a1a]">{o.customer}</p>
                    <p className="text-[10px] text-[#6e6e6e] mt-0.5 font-light truncate max-w-48">{o.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${payStatusColor(o.paymentStatus)}`}>{o.paymentStatus}</span>
                  <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${orderStatusColor(currentStatus)}`}>{currentStatus}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-48">
                  <img src={o.productImg} alt={o.product} className="w-10 h-12 object-cover bg-[#faf7f4] flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-[#1a1a1a]">{o.product}</p>
                    <p className="text-[10px] text-[#6e6e6e] mt-0.5">Qty: {o.qty} · {fmt(o.amount)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="flex items-center gap-1.5 px-3 py-2 border border-[#ececec] text-[9px] tracking-[0.1em] uppercase text-[#6e6e6e] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors">
                    <Printer size={11} strokeWidth={1.5} />
                    Invoice
                  </button>
                  {nextStatus && currentStatus !== "Cancelled" && (
                    <button
                      onClick={() => setStatusUpdate(prev => ({ ...prev, [o.id]: nextStatus }))}
                      className="px-4 py-2 bg-[#1a1a1a] text-white text-[9px] tracking-[0.12em] uppercase hover:bg-[#d4145a] transition-colors font-semibold"
                    >
                      Mark {nextStatus}
                    </button>
                  )}
                </div>
              </div>

              {o.tracking && (
                <div className="mt-3 pt-3 border-t border-[#ececec] flex items-center gap-2">
                  <span className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e]">Tracking:</span>
                  <span className="text-[10px] font-mono text-[#d4145a] font-semibold">{o.tracking}</span>
                  <span className="text-[9px] text-[#9e9e9e]">via {o.courier}</span>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-white border border-[#ececec] py-16 text-center">
            <p className="text-xs text-[#9e9e9e] tracking-wide">No {filter.toLowerCase()} orders.</p>
          </div>
        )}
      </div>
    </div>
  );
}
