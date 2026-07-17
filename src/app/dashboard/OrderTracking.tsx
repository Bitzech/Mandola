import { ArrowLeft, MapPin, Package, Truck, Home, CheckCircle, Clock } from "lucide-react";
import { MOCK_ORDERS, deliveryStatusColor } from "./dashboardData";
import type { NavigateFn } from "./dashboardData";

const stepIcon = (status: string, done: boolean) => {
  const cls = `w-6 h-6 ${done ? "text-[#d4145a]" : "text-[#9e9e9e]"}`;
  if (status === "Order Placed")      return <Package   size={20} strokeWidth={1.5} className={cls} />;
  if (status === "Payment Confirmed") return <CheckCircle size={20} strokeWidth={1.5} className={cls} />;
  if (status === "Processing")        return <Clock      size={20} strokeWidth={1.5} className={cls} />;
  if (status === "Shipped")           return <Truck      size={20} strokeWidth={1.5} className={cls} />;
  if (status === "Out for Delivery")  return <MapPin     size={20} strokeWidth={1.5} className={cls} />;
  return <Home size={20} strokeWidth={1.5} className={cls} />;
};

export default function OrderTracking({ orderId, onNavigate }: { orderId: string | null; onNavigate: NavigateFn }) {
  const order = MOCK_ORDERS.find(o => o.id === orderId) ?? MOCK_ORDERS[1];
  const currentStep = order.timeline.filter(s => s.done).length - 1;

  if (order.deliveryStatus === "Cancelled") {
    return (
      <div>
        <button onClick={() => onNavigate("orders")} className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] hover:text-[#d4145a] transition-colors mb-6">
          <ArrowLeft size={13} /> Back to Orders
        </button>
        <div className="bg-white border border-[#ececec] p-12 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={24} strokeWidth={1.5} className="text-red-500" />
          </div>
          <p className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a1a] mb-2">Order Cancelled</p>
          <p className="text-sm text-[#6e6e6e] font-light">This order ({order.id}) was cancelled on 3 Nov 2024.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => onNavigate("orders")} className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] hover:text-[#d4145a] transition-colors mb-6">
        <ArrowLeft size={13} /> Back to Orders
      </button>

      <div className="mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Tracking</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">{order.id}</h2>
        <p className="text-sm text-[#6e6e6e] font-light mt-0.5">Placed on {order.date}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main tracking */}
        <div className="lg:col-span-2 bg-white border border-[#ececec] p-6">
          <div className="flex items-center justify-between mb-6">
            <span className={`text-[9px] font-semibold tracking-[0.1em] uppercase px-3 py-1.5 ${deliveryStatusColor(order.deliveryStatus)}`}>
              {order.deliveryStatus}
            </span>
            <span className="text-[10px] text-[#6e6e6e] tracking-wide">Est. Delivery: <strong className="text-[#1a1a1a]">{order.estimatedDelivery}</strong></span>
          </div>

          {/* Visual timeline */}
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-[22px] top-5 bottom-5 w-0.5 bg-[#ececec]" />
            <div
              className="absolute left-[22px] top-5 w-0.5 bg-[#d4145a] transition-all duration-700"
              style={{ height: currentStep <= 0 ? 0 : `${(currentStep / (order.timeline.length - 1)) * 100}%` }}
            />

            <div className="space-y-0">
              {order.timeline.map((step, i) => (
                <div key={i} className="flex gap-5 relative">
                  {/* Icon */}
                  <div className={`w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center border-2 z-10 transition-all ${step.done ? "bg-[#fce8ef] border-[#d4145a]" : "bg-white border-[#ececec]"}`}>
                    {stepIcon(step.status, step.done)}
                  </div>
                  {/* Content */}
                  <div className={`pb-8 ${i === order.timeline.length - 1 ? "pb-0" : ""}`}>
                    <p className={`text-sm font-semibold mt-2 ${step.done ? "text-[#1a1a1a]" : "text-[#9e9e9e]"}`}>{step.status}</p>
                    {step.date !== "—" ? (
                      <p className="text-[10px] text-[#6e6e6e] tracking-wide mt-0.5">{step.date} · {step.time}</p>
                    ) : (
                      <p className="text-[10px] text-[#c0c0c0] tracking-wide mt-0.5">Pending</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Courier info */}
        <div className="space-y-5">
          <div className="bg-white border border-[#ececec] p-5">
            <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-4 pb-3 border-b border-[#ececec]">Courier Details</h3>
            <div className="space-y-3">
              {[
                ["Courier Partner", order.courier],
                ["Tracking Number",  order.trackingNumber],
                ["Est. Delivery",    order.estimatedDelivery],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[10px] tracking-[0.1em] uppercase text-[#6e6e6e] mb-0.5">{k}</p>
                  <p className={`text-sm font-medium ${k === "Tracking Number" ? "text-[#d4145a]" : "text-[#1a1a1a]"}`}>{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#ececec] p-5">
            <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-4 pb-3 border-b border-[#ececec]">Delivery Address</h3>
            <div className="flex items-start gap-2.5">
              <MapPin size={14} strokeWidth={1.5} className="text-[#d4145a] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#6e6e6e] font-light leading-relaxed">{order.address}</p>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white border border-[#ececec] p-5">
            <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-4 pb-3 border-b border-[#ececec]">Items in Shipment</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={item.img} alt={item.name} className="w-10 h-12 object-cover bg-[#faf7f4] flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-[#1a1a1a]">{item.name}</p>
                    <p className="text-[10px] text-[#6e6e6e] tracking-wide">Size {item.size} · Qty {item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
