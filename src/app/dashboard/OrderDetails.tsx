import { useState, useEffect } from "react";
import { ArrowLeft, Download, Truck, MapPin, CreditCard, RotateCcw, RefreshCw, XCircle, Star } from "lucide-react";
import { deliveryStatusColor, paymentStatusColor } from "./dashboardData";
import type { NavigateFn } from "./dashboardData";
import { orderService } from "../services/order.service";
import { invoiceService } from "../services/invoice.service";
import { reviewService } from "../services/review.service";
import { extractErrorMessage } from "../utils/errorExtractor";
import { formatImageUrl } from "../utils/imageUrl";
import { toast } from "sonner";
import { apiClient } from "../services/apiClient";

export default function OrderDetails({ orderId, onNavigate }: { orderId: string | null; onNavigate: NavigateFn }) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewItem, setReviewItem] = useState<any | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnItem, setReturnItem] = useState<any>(null);
  const [returnReason, setReturnReason] = useState("quality_issue");
  const [returnDescription, setReturnDescription] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [requestedReturnItemIds, setRequestedReturnItemIds] = useState<Set<number>>(new Set());

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const fetchOrderDetails = async () => {
    if (!orderId) {
      setError("No order ID provided.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response: any = await orderService.getOrderById(orderId);
      const rawData = response?.data || response;
      const data = rawData?.order || rawData;
      if (data && (data.id || data.order_number)) {
        setOrder(data);
      } else {
        setError("Order details not found.");
      }
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load order details.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!orderId) return;
    setCancelling(true);
    try {
      await orderService.cancelOrder(orderId, cancelReason || "Cancelled by customer");
      toast.success("Order cancelled successfully!");
      setShowCancelModal(false);
      fetchOrderDetails();
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to cancel order.");
      toast.error(msg);
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewItem || reviewRating < 1) return;
    setSubmittingReview(true);
    try {
      await reviewService.createReview({
        product_id: reviewItem.product_id,
        order_item_id: reviewItem.id,
        rating: reviewRating,
        title: reviewTitle || "My Review",
        review: reviewBody,
      });
      toast.success("Review submitted successfully!");
      setShowReviewModal(false);
      setReviewTitle("");
      setReviewBody("");
      setReviewRating(5);
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to submit review."));
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!order) return;
    try {
      const invId = order.invoice_id || order.id || orderId;
      const res = await invoiceService.downloadInvoice(invId);
      const rawUrl = res.data?.pdf_url || res.data?.url || res.url;
      const downloadUrl = rawUrl ? formatImageUrl(rawUrl) : "";
      if (downloadUrl) {
        window.open(downloadUrl, "_blank");
      } else {
        toast.success("Invoice requested! Check Invoices section.");
        onNavigate("invoices");
      }
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Invoice download pending. Redirecting to invoices page."));
      onNavigate("invoices");
    }
  };

  const formatCurrency = (val: number | string) => {
    const num = Number(val) || 0;
    return `₹${num.toLocaleString("en-IN")}`;
  };

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

  if (error || !order) {
    return (
      <div>
        <button onClick={() => onNavigate("orders")} className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] hover:text-[#d4145a] transition-colors mb-6">
          <ArrowLeft size={13} /> Back to Orders
        </button>
        <div className="bg-white border border-[#ececec] p-16 text-center">
          <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a] mb-2">Order Not Found</p>
          <p className="text-sm text-[#6e6e6e] font-light mb-4">{error || "Unable to locate order details."}</p>
          <button onClick={fetchOrderDetails} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a]">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const orderNumStr = order.order_number || order.id || `MND-${order.id}`;
  const orderDateStr = order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : order.date || "Today";
  const delStatus = order.delivery_status || order.deliveryStatus || order.order_status || order.status || "Processing";
  const payStatus = order.payment_status || order.paymentStatus || "Paid";
  const orderItems = order.items || order.order_items || [];
  const grandTotal = order.grand_total || order.total_amount || order.amount || 0;
  const subTotal = order.subtotal || order.sub_total || grandTotal;

  // Build timeline steps from backend status_history or status logs
  const statusHistory = order.status_history || order.timeline || [];
  const defaultSteps = ["Order Placed", "Payment Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered"];
  
  let timelineSteps: any[] = [];
  if (statusHistory.length > 0) {
    timelineSteps = statusHistory.map((s: any) => ({
      status: s.status || s.state || "Update",
      date: s.created_at ? new Date(s.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : s.date || "—",
      time: s.created_at ? new Date(s.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : s.time || "—",
      done: true,
    }));
  } else {
    const isDelivered = delStatus.toLowerCase() === "delivered";
    const isShipped = delStatus.toLowerCase() === "shipped" || isDelivered;
    const isProcessing = delStatus.toLowerCase() === "processing" || isShipped;

    timelineSteps = [
      { status: "Order Placed", date: orderDateStr, time: "System", done: true },
      { status: "Payment Confirmed", date: orderDateStr, time: "System", done: true },
      { status: "Processing", date: isProcessing ? orderDateStr : "—", time: "—", done: isProcessing },
      { status: "Shipped", date: isShipped ? orderDateStr : "—", time: "—", done: isShipped },
      { status: "Out for Delivery", date: isDelivered ? orderDateStr : "—", time: "—", done: isDelivered },
      { status: "Delivered", date: isDelivered ? orderDateStr : "—", time: "—", done: isDelivered },
    ];
  }

  // Address formatting
  const shippingAddr = order.shipping_address || order.address;
  const addressFormatted = typeof shippingAddr === "object"
    ? `${shippingAddr.full_name || shippingAddr.name || ""}, ${shippingAddr.address_line_1 || shippingAddr.line1 || ""}, ${shippingAddr.city || ""}, ${shippingAddr.state || ""} - ${shippingAddr.pincode || ""}`
    : String(shippingAddr || "Saved Customer Address");

  const handleCreateReturn = async () => {
    if (!returnItem) return;
    setSubmittingReturn(true);
    try {
      await apiClient.post("/returns", {
        order_id: Number(order.id),
        order_item_id: Number(returnItem.id),
        reason: returnReason,
        description: returnDescription || "Customer requested return",
        requested_quantity: returnItem.quantity || 1
      });
      toast.success("Return request submitted successfully!");
      setRequestedReturnItemIds(prev => new Set(prev).add(Number(returnItem.id)));
      setShowReturnModal(false);
      setReturnItem(null);
      setReturnDescription("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to submit return request.");
    } finally {
      setSubmittingReturn(false);
    }
  };

  return (
    <div>
      {/* Back */}
      <button onClick={() => onNavigate("orders")} className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] hover:text-[#d4145a] transition-colors mb-6">
        <ArrowLeft size={13} /> Back to Orders
      </button>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Order</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">{orderNumStr}</h2>
          <p className="text-sm text-[#6e6e6e] font-light mt-0.5">Placed on {orderDateStr}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <span className={`text-[9px] font-semibold tracking-[0.1em] uppercase px-3 py-1 ${deliveryStatusColor(delStatus)}`}>{delStatus}</span>
          <span className={`text-[9px] font-semibold tracking-[0.1em] uppercase px-3 py-1 ${paymentStatusColor(payStatus)}`}>{payStatus}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: products + actions */}
        <div className="lg:col-span-2 space-y-5">
          {/* Products */}
          <div className="bg-white border border-[#ececec] p-5">
            <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Ordered Items</h3>
            <div className="space-y-4">
              {orderItems.map((item: any, i: number) => {
                const rawImg = item.thumbnail || item.product_image || item.image || item.img || null;
                const itemImg = rawImg ? formatImageUrl(rawImg) : "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=120&h=150&fit=crop";
                const itemName = item.product_name || item.name || "Product Item";
                const itemPrice = Number(item.price || item.unit_price || 0);
                const itemQty = item.quantity || item.qty || 1;
                const itemSize = item.size_name || item.size || "";
                const sellerName = item.seller_name || order.seller_name || "Mandola Official";
                const isDeliveredOrder = (delStatus || "").toLowerCase() === "delivered";

                return (
                  <div key={i} className="flex gap-4">
                    <img src={itemImg} alt={itemName} className="w-20 h-24 object-cover bg-[#faf7f4] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1a1a1a]">{itemName}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                        {itemSize && <span className="text-[10px] text-[#6e6e6e] tracking-wide">Size: {itemSize}</span>}
                        <span className="text-[10px] text-[#6e6e6e] tracking-wide">Qty: {itemQty}</span>
                        <span className="text-[10px] text-[#6e6e6e] tracking-wide">Seller: {sellerName}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-sm font-semibold text-[#1a1a1a]">{formatCurrency(itemPrice)}</p>
                        {isDeliveredOrder && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setReviewItem(item); setShowReviewModal(true); }}
                              className="flex items-center gap-1 text-[9px] tracking-[0.12em] uppercase px-2 py-1 border border-[#d4145a] text-[#d4145a] hover:bg-[#d4145a] hover:text-white transition-colors"
                            >
                              <Star size={10} /> Write Review
                            </button>
                            {requestedReturnItemIds.has(Number(item.id)) ? (
                              <span className="text-[9px] tracking-[0.1em] uppercase px-2 py-1 bg-yellow-50 text-yellow-700 font-semibold">
                                Return Requested
                              </span>
                            ) : (
                              <button
                                onClick={() => { setReturnItem(item); setShowReturnModal(true); }}
                                className="flex items-center gap-1 text-[9px] tracking-[0.12em] uppercase px-2 py-1 border border-[#6e6e6e] text-[#6e6e6e] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
                              >
                                <RotateCcw size={10} /> Request Return
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white border border-[#ececec] p-5">
            <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Order Timeline</h3>
            <div className="space-y-0">
              {timelineSteps.map((step: any, i: number) => (
                <div key={i} className="flex gap-4">
                  {/* Dot + line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 mt-0.5 ${step.done ? "bg-[#d4145a] border-[#d4145a]" : "bg-white border-[#ececec]"}`} />
                    {i < timelineSteps.length - 1 && (
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
            {!(["cancelled", "delivered"].includes((delStatus || "").toLowerCase())) && (
              <button onClick={() => onNavigate("tracking", String(order.id || orderId))}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors">
                <Truck size={13} /> Track Order
              </button>
            )}
            {(payStatus === "Paid" || payStatus === "paid") && (
              <button onClick={handleDownloadInvoice}
                className="flex items-center gap-2 px-5 py-2.5 border border-[#ececec] text-[#1a1a1a] text-[10px] tracking-[0.15em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
                <Download size={13} /> Download Invoice
              </button>
            )}
            {!([ "cancelled", "delivered", "shipped"].includes((delStatus || "").toLowerCase())) && (
              <button onClick={() => setShowCancelModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 border border-red-200 text-red-600 text-[10px] tracking-[0.15em] uppercase hover:bg-red-50 transition-colors">
                <XCircle size={13} /> Cancel Order
              </button>
            )}
            {(delStatus || "").toLowerCase() === "delivered" && (
              <button onClick={() => toast.info("Return request submitted for this order.")}
                className="flex items-center gap-2 px-5 py-2.5 border border-[#ececec] text-[#1a1a1a] text-[10px] tracking-[0.15em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
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
                ["Subtotal", formatCurrency(subTotal)],
                ["Shipping", order.shipping_charge ? formatCurrency(order.shipping_charge) : "FREE"],
                ["Discount", order.discount ? formatCurrency(order.discount) : "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-xs text-[#6e6e6e]">{k}</span>
                  <span className={`text-xs font-medium ${v === "FREE" ? "text-emerald-600" : "text-[#1a1a1a]"}`}>{v}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2.5 border-t border-[#ececec]">
                <span className="text-sm font-semibold text-[#1a1a1a]">Total</span>
                <span className="text-sm font-semibold text-[#1a1a1a]">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white border border-[#ececec] p-5">
            <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-4 pb-3 border-b border-[#ececec] flex items-center gap-2">
              <MapPin size={14} strokeWidth={1.5} /> Delivery Address
            </h3>
            <p className="text-xs text-[#6e6e6e] font-light leading-relaxed">{addressFormatted}</p>
          </div>

          {/* Courier */}
          {(order.tracking_number || order.courier_name) && (
            <div className="bg-white border border-[#ececec] p-5">
              <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-4 pb-3 border-b border-[#ececec] flex items-center gap-2">
                <Truck size={14} strokeWidth={1.5} /> Courier Info
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[10px] text-[#6e6e6e] uppercase tracking-wide">Courier</span>
                  <span className="text-xs font-medium text-[#1a1a1a]">{order.courier_name || order.courier || "Express Shipping"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-[#6e6e6e] uppercase tracking-wide">Tracking #</span>
                  <span className="text-xs font-medium text-[#d4145a]">{order.tracking_number || order.trackingNumber || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-[#6e6e6e] uppercase tracking-wide">Est. Delivery</span>
                  <span className="text-xs font-medium text-[#1a1a1a]">{order.estimated_delivery || "Within 3-5 days"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white w-full max-w-sm p-8 relative shadow-2xl space-y-4">
            <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a]">Cancel Order #{orderNumStr}?</h3>
            <p className="text-xs text-[#6e6e6e]">Are you sure you want to cancel this order? Items will be restored to stock.</p>
            <input
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (optional)"
              className="w-full border border-[#ececec] p-3 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a]"
            />
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 border border-[#ececec] py-2.5 text-[10px] uppercase tracking-[0.15em]">
                Back
              </button>
              <button
                disabled={cancelling}
                onClick={handleCancelOrder}
                className="flex-1 bg-red-600 text-white py-2.5 text-[10px] uppercase tracking-[0.15em] hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelling ? <RefreshCw size={12} className="animate-spin" /> : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {showReviewModal && reviewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white w-full max-w-md p-8 relative shadow-2xl">
            <button onClick={() => setShowReviewModal(false)} className="absolute top-4 right-4 text-[#9e9e9e] hover:text-[#1a1a1a]">
              <XCircle size={18} />
            </button>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Product Review</span>
            <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a] mt-1 mb-4">
              {reviewItem.product_name || reviewItem.name || "Rate this product"}
            </h3>

            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#6e6e6e] mb-2">Your Rating</p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setReviewRating(s)}>
                    <Star size={24} className={s <= reviewRating ? "fill-[#d4145a] text-[#d4145a]" : "fill-[#ececec] text-[#ececec]"} />
                  </button>
                ))}
              </div>
            </div>

            <input
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="Review title (e.g. Great quality!)"
              className="w-full border border-[#ececec] p-3 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] mb-3"
            />
            <textarea
              rows={4}
              value={reviewBody}
              onChange={(e) => setReviewBody(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full border border-[#ececec] p-3 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] mb-4 resize-none"
            />

            <div className="flex gap-3">
              <button onClick={() => setShowReviewModal(false)} className="flex-1 border border-[#ececec] py-2.5 text-[10px] uppercase tracking-[0.15em] hover:border-[#1a1a1a]">
                Cancel
              </button>
              <button
                disabled={submittingReview}
                onClick={handleSubmitReview}
                className="flex-1 bg-[#d4145a] text-white py-2.5 text-[10px] uppercase tracking-[0.15em] hover:bg-[#b8114d] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submittingReview ? <RefreshCw size={12} className="animate-spin" /> : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {showReturnModal && returnItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white w-full max-w-md p-8 relative shadow-2xl">
            <button onClick={() => setShowReturnModal(false)} className="absolute top-4 right-4 text-[#9e9e9e] hover:text-[#1a1a1a]">
              <XCircle size={18} />
            </button>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Request Return</span>
            <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a] mt-1 mb-4 truncate">
              {returnItem.product_name || returnItem.name || "Return Item"}
            </h3>

            <div className="mb-4">
              <label className="block text-[10px] uppercase tracking-[0.15em] text-[#6e6e6e] mb-2 font-semibold">Select Reason</label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full border border-[#ececec] p-3 text-xs text-[#1a1a1a] bg-white focus:outline-none focus:border-[#d4145a]"
              >
                <option value="quality_issue">Quality / Fabric Issue</option>
                <option value="damaged">Item Received Damaged</option>
                <option value="wrong_item">Wrong Item Delivered</option>
                <option value="missing_item">Item / Accessory Missing</option>
                <option value="not_as_described">Product Not As Described</option>
                <option value="size_issue">Size / Fit Issue</option>
                <option value="duplicate_order">Duplicate Order</option>
                <option value="other">Other Reason</option>
              </select>
            </div>

            <textarea
              rows={4}
              value={returnDescription}
              onChange={(e) => setReturnDescription(e.target.value)}
              placeholder="Describe the issue with the item..."
              className="w-full border border-[#ececec] p-3 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] mb-4 resize-none"
            />

            <div className="flex gap-3">
              <button onClick={() => setShowReturnModal(false)} className="flex-1 border border-[#ececec] py-2.5 text-[10px] uppercase tracking-[0.15em] hover:border-[#1a1a1a]">
                Cancel
              </button>
              <button
                disabled={submittingReturn}
                onClick={handleCreateReturn}
                className="flex-1 bg-[#1a1a1a] text-white py-2.5 text-[10px] uppercase tracking-[0.15em] hover:bg-[#d4145a] disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
              >
                {submittingReturn ? <RefreshCw size={12} className="animate-spin" /> : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
