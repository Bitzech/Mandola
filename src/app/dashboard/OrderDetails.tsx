import { ArrowLeft, Download, Truck, MapPin, CreditCard, RotateCcw } from "lucide-react";
import { MOCK_ORDERS, deliveryStatusColor, paymentStatusColor } from "./dashboardData";
import type { NavigateFn } from "./dashboardData";

export default function OrderDetails({ orderId, onNavigate }: { orderId: string | null; onNavigate: NavigateFn }) {
  const order = MOCK_ORDERS.find(o => o.id === orderId) ?? MOCK_ORDERS[0];

  return (
    <div>
      {/* Back */}
      <button onClick={() => onNavigate("orders")} className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] hover:text-[#d4145a] transition-colors mb-6">
        <ArrowLeft size={13} /> Back to Orders
      </button>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Order</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">{order.id}</h2>
          <p className="text-sm text-[#6e6e6e] font-light mt-0.5">Placed on {order.date}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <span className={`text-[9px] font-semibold tracking-[0.1em] uppercase px-3 py-1 ${deliveryStatusColor(order.deliveryStatus)}`}>{order.deliveryStatus}</span>
          <span className={`text-[9px] font-semibold tracking-[0.1em] uppercase px-3 py-1 ${paymentStatusColor(order.paymentStatus)}`}>{order.paymentStatus}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: products + actions */}
        <div className="lg:col-span-2 space-y-5">
          {/* Products */}
          <div className="bg-white border border-[#ececec] p-5">
            <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Ordered Items</h3>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <img src={item.img} alt={item.name} className="w-20 h-24 object-cover bg-[#faf7f4] flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1a1a1a]">{item.name}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                      <span className="text-[10px] text-[#6e6e6e] tracking-wide">Size: {item.size}</span>
                      <span className="text-[10px] text-[#6e6e6e] tracking-wide">Qty: {item.qty}</span>
                      <span className="text-[10px] text-[#6e6e6e] tracking-wide">Seller: {order.seller}</span>
                    </div>
                    <p className="text-sm font-semibold text-[#1a1a1a] mt-2">₹{item.price.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white border border-[#ececec] p-5">
            <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Order Timeline</h3>
            <div className="space-y-0">
              {order.timeline.map((step, i) => (
                <div key={i} className="flex gap-4">
                  {/* Dot + line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 mt-0.5 ${step.done ? "bg-[#d4145a] border-[#d4145a]" : "bg-white border-[#ececec]"}`} />
                    {i < order.timeline.length - 1 && (
                      <div className={`w-0.5 flex-1 my-1 ${step.done ? "bg-[#d4145a]" : "bg-[#ececec]"}`} style={{ minHeight: "2rem" }} />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-4">
                    <p className={`text-sm font-medium ${step.done ? "text-[#1a1a1a]" : "text-[#9e9e9e]"}`}>{step.status}</p>
                    {step.date !== "—" && (
                      <p className="text-[10px] text-[#6e6e6e] tracking-wide mt-0.5">{step.date} · {step.time}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {order.deliveryStatus !== "Cancelled" && order.deliveryStatus !== "Delivered" && (
              <button onClick={() => onNavigate("tracking", order.id)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors">
                <Truck size={13} /> Track Order
              </button>
            )}
            {order.paymentStatus === "Paid" && (
              <button className="flex items-center gap-2 px-5 py-2.5 border border-[#ececec] text-[#1a1a1a] text-[10px] tracking-[0.15em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
                <Download size={13} /> Download Invoice
              </button>
            )}
            {order.deliveryStatus === "Delivered" && (
              <button className="flex items-center gap-2 px-5 py-2.5 border border-[#ececec] text-[#1a1a1a] text-[10px] tracking-[0.15em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
                <RotateCcw size={13} /> Request Return
              </button>
            )}
          </div>
        </div>

        {/* Right: summary */}
        <div className="space-y-5">
          {/* Payment */}
          <div className="bg-white border border-[#ececec] p-5">
            <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-4 pb-3 border-b border-[#ececec] flex items-center gap-2">
              <CreditCard size={14} strokeWidth={1.5} /> Payment Details
            </h3>
            <div className="space-y-2.5">
              {[
                ["Subtotal", `₹${order.amount.toLocaleString("en-IN")}`],
                ["Shipping", "FREE"],
                ["Discount", "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-xs text-[#6e6e6e]">{k}</span>
                  <span className={`text-xs font-medium ${v === "FREE" ? "text-emerald-600" : "text-[#1a1a1a]"}`}>{v}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2.5 border-t border-[#ececec]">
                <span className="text-sm font-semibold text-[#1a1a1a]">Total</span>
                <span className="text-sm font-semibold text-[#1a1a1a]">₹{order.amount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white border border-[#ececec] p-5">
            <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-4 pb-3 border-b border-[#ececec] flex items-center gap-2">
              <MapPin size={14} strokeWidth={1.5} /> Delivery Address
            </h3>
            <p className="text-xs text-[#6e6e6e] font-light leading-relaxed">{order.address}</p>
          </div>

          {/* Courier */}
          {order.trackingNumber !== "—" && (
            <div className="bg-white border border-[#ececec] p-5">
              <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-4 pb-3 border-b border-[#ececec] flex items-center gap-2">
                <Truck size={14} strokeWidth={1.5} /> Courier Info
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[10px] text-[#6e6e6e] uppercase tracking-wide">Courier</span>
                  <span className="text-xs font-medium text-[#1a1a1a]">{order.courier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-[#6e6e6e] uppercase tracking-wide">Tracking #</span>
                  <span className="text-xs font-medium text-[#d4145a]">{order.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-[#6e6e6e] uppercase tracking-wide">Est. Delivery</span>
                  <span className="text-xs font-medium text-[#1a1a1a]">{order.estimatedDelivery}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
