import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Package, Truck, Home, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { deliveryStatusColor } from "./dashboardData";
import type { NavigateFn } from "./dashboardData";
import { shipmentService } from "../services/shipment.service";
import { orderService } from "../services/order.service";
import { extractErrorMessage } from "../utils/errorExtractor";
import { toast } from "sonner";

const stepIcon = (status: string, done: boolean) => {
  const cls = `w-6 h-6 ${done ? "text-[#d4145a]" : "text-[#9e9e9e]"}`;
  const s = status.toLowerCase();
  if (s.includes("placed")) return <Package size={20} strokeWidth={1.5} className={cls} />;
  if (s.includes("payment") || s.includes("confirmed")) return <CheckCircle size={20} strokeWidth={1.5} className={cls} />;
  if (s.includes("process")) return <Clock size={20} strokeWidth={1.5} className={cls} />;
  if (s.includes("ship")) return <Truck size={20} strokeWidth={1.5} className={cls} />;
  if (s.includes("out")) return <MapPin size={20} strokeWidth={1.5} className={cls} />;
  return <Home size={20} strokeWidth={1.5} className={cls} />;
};

export default function OrderTracking({ orderId, onNavigate }: { orderId: string | null; onNavigate: NavigateFn }) {
  const [trackingInfo, setTrackingInfo] = useState<any | null>(null);
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noOrdersFound, setNoOrdersFound] = useState(false);

  const fetchTracking = async () => {
    setLoading(true);
    setError(null);
    setNoOrdersFound(false);

    let targetOrderId = orderId;

    try {
      // If no order ID was passed, fetch customer's latest order automatically
      if (!targetOrderId) {
        const recentOrdersRes: any = await orderService.getOrders({ limit: 1 });
        const resData = recentOrdersRes?.data || recentOrdersRes;
        const itemsList = Array.isArray(resData)
          ? resData
          : Array.isArray(resData?.items)
          ? resData.items
          : Array.isArray(resData?.data)
          ? resData.data
          : [];

        if (itemsList.length > 0) {
          const latestOrder = itemsList[0];
          targetOrderId = String(latestOrder.id || latestOrder.order_id || latestOrder.order_number);
        } else {
          setNoOrdersFound(true);
          setLoading(false);
          return;
        }
      }

      const [orderRes, trackRes] = await Promise.allSettled([
        orderService.getOrderById(targetOrderId),
        shipmentService.trackShipment(targetOrderId),
      ]);

      if (orderRes.status === "fulfilled") {
        setOrder(orderRes.value.data || orderRes.value);
      }

      if (trackRes.status === "fulfilled") {
        setTrackingInfo(trackRes.value.data || trackRes.value);
      }
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to fetch shipment tracking details.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
  }, [orderId]);

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-6 w-32 bg-slate-200" />
        <div className="h-10 w-64 bg-slate-200" />
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 h-96 bg-white border border-[#ececec]" />
          <div className="h-96 bg-white border border-[#ececec]" />
        </div>
      </div>
    );
  }

  if (noOrdersFound) {
    return (
      <div>
        <div className="mb-8">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Tracking</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Order Tracking</h2>
        </div>
        <div className="bg-white border border-[#ececec] p-16 text-center">
          <Truck size={48} className="text-[#ececec] mx-auto mb-4" strokeWidth={1} />
          <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a] mb-2">No Recent Orders to Track</p>
          <p className="text-sm text-[#6e6e6e] font-light mb-6">You haven't placed any orders yet. Place an order to track shipment status in real-time.</p>
          <button onClick={() => onNavigate("home")} className="px-6 py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div>
        <button onClick={() => onNavigate("orders")} className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] hover:text-[#d4145a] transition-colors mb-6">
          <ArrowLeft size={13} /> Back to Orders
        </button>
        <div className="bg-white border border-[#ececec] p-16 text-center">
          <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a] mb-2">Tracking Info Unavailable</p>
          <p className="text-sm text-[#6e6e6e] font-light mb-4">{error || "Unable to locate shipment data."}</p>
          <button onClick={fetchTracking} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      </div>
    );
  }

  const orderNumStr = order?.order_number || order?.id || `MND-${orderId}`;
  const shipmentObj = trackingInfo?.shipment || trackingInfo?.data?.shipment || trackingInfo;
  const delStatus = shipmentObj?.shipment_status || shipmentObj?.status || order?.delivery_status || order?.deliveryStatus || order?.order_status || "Processing";
  const orderDateStr = order?.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recently";

  if (String(delStatus).toLowerCase() === "cancelled") {
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
          <p className="text-sm text-[#6e6e6e] font-light">This order ({orderNumStr}) was cancelled.</p>
        </div>
      </div>
    );
  }

  // Parse tracking events timeline
  const trackingEvents = trackingInfo?.tracking_logs || trackingInfo?.logs || trackingInfo?.events || order?.status_history || [];
  
  let timeline: any[] = [];
  if (Array.isArray(trackingEvents) && trackingEvents.length > 0) {
    timeline = trackingEvents.map((evt: any) => ({
      status: evt.status || evt.title || evt.event || "Update",
      location: evt.location || evt.location_name || "",
      remarks: evt.remarks || evt.notes || "",
      date: evt.created_at ? new Date(evt.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : evt.date || "—",
      time: evt.created_at ? new Date(evt.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : evt.time || "—",
      done: true,
    }));
  } else {
    const isDelivered = String(delStatus).toLowerCase() === "delivered";
    const isShipped = String(delStatus).toLowerCase() === "shipped" || String(delStatus).toLowerCase() === "in_transit" || isDelivered;
    const isProcessing = String(delStatus).toLowerCase() === "processing" || isShipped;

    timeline = [
      { status: "Order Placed", location: "System", remarks: "Order placed successfully", date: orderDateStr, time: "System", done: true },
      { status: "Payment Confirmed", location: "System", remarks: "Payment verified", date: orderDateStr, time: "System", done: true },
      { status: "Processing", location: "Fulfillment Center", remarks: "Items packed", date: isProcessing ? orderDateStr : "—", time: "—", done: isProcessing },
      { status: "Shipped", location: "Logistics Hub", remarks: "Dispatched with courier", date: isShipped ? orderDateStr : "—", time: "—", done: isShipped },
      { status: "Out for Delivery", location: "Local Facility", remarks: "With delivery executive", date: isDelivered ? orderDateStr : "—", time: "—", done: isDelivered },
      { status: "Delivered", location: "Destination", remarks: "Package handed over", date: isDelivered ? orderDateStr : "—", time: "—", done: isDelivered },
    ];
  }

  const currentStep = Math.max(0, timeline.filter((s: any) => s.done).length - 1);
  const courierName = shipmentObj?.courier_name || shipmentObj?.courier || order?.courier_name || order?.courier || "BlueDart Express";
  const trackingNumber = shipmentObj?.tracking_number || shipmentObj?.trackingNumber || order?.tracking_number || order?.trackingNumber || "TRK" + (order?.id || orderId || "12345");
  const estimatedDelivery = shipmentObj?.estimated_delivery || order?.estimated_delivery || order?.estimatedDelivery || "Within 3-5 days";

  // Address
  const shippingAddr = order?.shipping_address || order?.address;
  const addressFormatted = typeof shippingAddr === "object"
    ? `${shippingAddr.full_name || shippingAddr.name || ""}, ${shippingAddr.address_line_1 || shippingAddr.line1 || ""}, ${shippingAddr.city || ""}, ${shippingAddr.state || ""} - ${shippingAddr.pincode || ""}`
    : String(shippingAddr || "Customer Saved Address");

  const itemsList = order?.items || order?.order_items || [];

  return (
    <div>
      <button onClick={() => onNavigate("orders")} className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] hover:text-[#d4145a] transition-colors mb-6">
        <ArrowLeft size={13} /> Back to Orders
      </button>

      <div className="mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Tracking</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">{orderNumStr}</h2>
        <p className="text-sm text-[#6e6e6e] font-light mt-0.5">Placed on {orderDateStr}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main tracking */}
        <div className="lg:col-span-2 bg-white border border-[#ececec] p-6">
          <div className="flex items-center justify-between mb-6">
            <span className={`text-[9px] font-semibold tracking-[0.1em] uppercase px-3 py-1.5 ${deliveryStatusColor(delStatus)}`}>
              {delStatus}
            </span>
            <span className="text-[10px] text-[#6e6e6e] tracking-wide">Est. Delivery: <strong className="text-[#1a1a1a]">{estimatedDelivery}</strong></span>
          </div>

          {/* Visual timeline */}
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-[22px] top-5 bottom-5 w-0.5 bg-[#ececec]" />
            <div
              className="absolute left-[22px] top-5 w-0.5 bg-[#d4145a] transition-all duration-700"
              style={{ height: currentStep <= 0 ? 0 : `${(currentStep / (timeline.length - 1)) * 100}%` }}
            />

            <div className="space-y-0">
              {timeline.map((step: any, i: number) => (
                <div key={i} className="flex gap-5 relative">
                  {/* Icon */}
                  <div className={`w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center border-2 z-10 transition-all ${step.done ? "bg-[#fce8ef] border-[#d4145a]" : "bg-white border-[#ececec]"}`}>
                    {stepIcon(step.status, step.done)}
                  </div>
                  {/* Content */}
                  <div className={`pb-8 ${i === timeline.length - 1 ? "pb-0" : ""}`}>
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
                ["Courier Partner", courierName],
                ["Tracking Number",  trackingNumber],
                ["Est. Delivery",    estimatedDelivery],
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
              <p className="text-xs text-[#6e6e6e] font-light leading-relaxed">{addressFormatted}</p>
            </div>
          </div>

          {/* Products */}
          {itemsList.length > 0 && (
            <div className="bg-white border border-[#ececec] p-5">
              <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-4 pb-3 border-b border-[#ececec]">Items in Shipment</h3>
              <div className="space-y-3">
                {itemsList.map((item: any, i: number) => {
                  const itemImg = item.thumbnail || item.product_image || item.img || "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=120&h=150&fit=crop";
                  const itemName = item.product_name || item.name || "Item";
                  const itemSize = item.size_name || item.size || "M";
                  const itemQty = item.quantity || item.qty || 1;

                  return (
                    <div key={i} className="flex items-center gap-3">
                      <img src={itemImg} alt={itemName} className="w-10 h-12 object-cover bg-[#faf7f4] flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-[#1a1a1a]">{itemName}</p>
                        <p className="text-[10px] text-[#6e6e6e] tracking-wide">Size {itemSize} · Qty {itemQty}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
