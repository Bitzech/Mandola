import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { orderService } from "../services/order.service";
import { paymentService } from "../services/payment.service";
import { addressService } from "../services/address.service";
import { formatImageUrl } from "../utils/imageUrl";
import { extractErrorMessage } from "../utils/errorExtractor";
import { toast } from "sonner";
import {
  ShieldCheck, CreditCard, Truck, CheckCircle2, Lock,
  ArrowLeft, Loader2, Sparkles, MapPin, Plus, Check
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems, subtotal: cartSubtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const isLogged = isAuthenticated || Boolean(user?.id);

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | number | "new" | null>(null);

  useEffect(() => {
    if (!isLogged) {
      toast.info("Please log in or create an account to proceed to checkout.");
      navigate("/login?redirect=/checkout", { state: { from: location }, replace: true });
    } else {
      addressService.getAddresses().then((res: any) => {
        const raw = res?.data || res;
        const list = Array.isArray(raw) ? raw : (raw?.items || []);
        if (list.length > 0) {
          setSavedAddresses(list);
          const def = list.find((a: any) => a.is_default) || list[0];
          if (def) {
            setSelectedAddressId(def.id);
            setFormData({
              fullName: def.full_name || user?.name || "",
              email: user?.email || "",
              phone: def.phone || "",
              address: def.address_line_1 ? (def.address_line_1 + (def.address_line_2 ? `, ${def.address_line_2}` : "")) : (def.address || ""),
              city: def.city || "",
              state: def.state || "",
              pincode: def.pincode || "",
            });
          }
        }
      }).catch(() => {});
    }
  }, [isLogged, location, navigate, user]);

  const stateData = location.state as { buyNowItem?: any } | null;
  const buyNowItem = stateData?.buyNowItem;
  const isBuyNow = !!buyNowItem;

  const items = isBuyNow
    ? [
        {
          id: buyNowItem.id,
          variant_id: buyNowItem.variant_id || buyNowItem.id,
          product_variant_id: buyNowItem.product_variant_id || buyNowItem.variant_id || buyNowItem.id,
          name: buyNowItem.name,
          price: buyNowItem.price,
          quantity: buyNowItem.quantity || 1,
          size: buyNowItem.selectedSize || buyNowItem.size || "M",
          color: buyNowItem.selectedColor || buyNowItem.color || "Standard",
          image: buyNowItem.image || buyNowItem.thumbnail || "",
        },
      ]
    : cartItems;

  const subtotal = isBuyNow
    ? buyNowItem.price * (buyNowItem.quantity || 1)
    : cartSubtotal;

  const shipping = subtotal > 1999 ? 0 : 150;
  const tax = Math.round(subtotal * 0.12);
  const grandTotal = subtotal + shipping + tax;

  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("cod");
  const [processing, setProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleChange = handleInputChange;

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast.error("Please fill in all required shipping fields.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setProcessing(true);

    try {
      const orderPayload = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        notes: `Order placed via ${paymentMethod.toUpperCase()}`,
        items: items.map((i: any) => ({
          product_variant_id: i.product_variant_id || i.variant_id || i.id,
          quantity: i.quantity || 1
        }))
      };

      let orderRes: any;
      try {
        orderRes = await orderService.placeOrder(orderPayload);
      } catch (apiErr: any) {
        console.error("[Checkout] placeOrder API error:", apiErr);
        const msg = extractErrorMessage(apiErr, "Failed to place order.");
        toast.error(msg);
        setProcessing(false);
        return;
      }

      const createdOrder = orderRes?.data || orderRes;
      if (!createdOrder || !createdOrder.id) {
        toast.error("Order placement failed. Please try again.");
        setProcessing(false);
        return;
      }

      const orderId = Number(createdOrder.id);
      const realOrderNumber = createdOrder.order_number || createdOrder.orderNumber || ("ORD-" + Math.floor(100000 + Math.random() * 900000));

      // Initiate payment record in backend
      let paymentRes: any;
      try {
        const payInitRes = await paymentService.createPayment({
          order_id: orderId,
          gateway: paymentMethod,
          payment_method: paymentMethod === "razorpay" ? "card" : "cod",
        });
        paymentRes = payInitRes?.data || payInitRes;
      } catch (payErr: any) {
        console.error("[Checkout] createPayment API error:", payErr);
        toast.error(extractErrorMessage(payErr, "Failed to initialize payment record."));
        setProcessing(false);
        return;
      }

      const paymentReference = paymentRes?.payment_reference || paymentRes?.paymentReference;

      const finishOrderCheckout = (txnId: string) => {
        const completedData = {
          orderNumber: realOrderNumber,
          paymentId: txnId || paymentReference || "SUCCESS",
          amount: grandTotal,
          customerName: formData.fullName,
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
          items: [...items],
        };

        if (!isBuyNow) {
          clearCart();
        }
        setOrderCompleted(completedData);
        setProcessing(false);
        toast.success(`Order #${realOrderNumber} placed & verified successfully!`);
      };

      if (paymentMethod === "razorpay") {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
          setProcessing(false);
          return;
        }

        const razorpayKeyId = "rzp_test_Sff36clcimBlWR";

        const options = {
          key: razorpayKeyId,
          amount: Math.round(grandTotal * 100),
          currency: "INR",
          name: "Mandola Luxury",
          description: `Payment for ${items.length} fashion item(s)`,
          image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=100&h=100&fit=crop",
          handler: async function (response: any) {
            toast.info("Payment received! Verifying signature...");
            try {
              await paymentService.verifyPayment({
                payment_reference: paymentReference,
                gateway_order_id: response.razorpay_order_id || paymentRes?.gateway_order_id,
                gateway_payment_id: response.razorpay_payment_id,
                gateway_signature: response.razorpay_signature,
              });
              finishOrderCheckout(response.razorpay_payment_id);
            } catch (verErr: any) {
              console.error("[Checkout] verifyPayment error:", verErr);
              toast.error("Payment verification failed. Please contact support.");
              setProcessing(false);
            }
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#d4145a",
          },
          modal: {
            ondismiss: function () {
              setProcessing(false);
              toast.info("Payment popup closed.");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (resp: any) {
          toast.error(`Payment Failed: ${resp.error?.description || "Transaction declined"}`);
          setProcessing(false);
        });
        rzp.open();
      } else {
        // COD Payment verification
        try {
          await paymentService.verifyPayment({
            payment_reference: paymentReference,
          });
          const payId = "COD-" + Math.random().toString(36).substring(7).toUpperCase();
          finishOrderCheckout(payId);
        } catch (codErr: any) {
          console.error("[Checkout] COD verify error:", codErr);
          toast.error("Failed to process COD order.");
          setProcessing(false);
        }
      }
    } catch (err: any) {
      console.error("[Checkout] Error placing order:", err);
      toast.error("Failed to initiate order. Please try again.");
      setProcessing(false);
    }
  };

  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-[#faf7f4] py-16 px-4 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white p-8 md:p-12 shadow-xl border border-[#ececec] text-center rounded-sm">
          <div className="w-16 h-16 bg-[#fce8ef] text-[#d4145a] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} />
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Payment Confirmed</span>
          <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#1a1a1a] mt-2 mb-2">Thank You for Your Order!</h1>
          <p className="text-sm text-[#6e6e6e] font-light mb-6">
            Order <strong className="text-[#1a1a1a]">#{orderCompleted.orderNumber}</strong> has been successfully placed and is being prepared for dispatch.
          </p>

          <div className="bg-[#faf7f4] p-5 text-left text-xs space-y-2 mb-8 border border-[#ececec]">
            <div className="flex justify-between border-b border-[#ececec] pb-2">
              <span className="text-[#6e6e6e]">Payment Transaction ID</span>
              <span className="font-semibold text-[#1a1a1a]">{orderCompleted.paymentId}</span>
            </div>
            <div className="flex justify-between border-b border-[#ececec] py-2">
              <span className="text-[#6e6e6e]">Total Amount Paid</span>
              <span className="font-bold text-[#d4145a] text-sm">₹{orderCompleted.amount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-[#6e6e6e]">Deliver To</span>
              <span className="font-medium text-[#1a1a1a] text-right max-w-[240px]">{orderCompleted.customerName}<br/>{orderCompleted.shippingAddress}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/customer/orders")}
              className="flex-1 bg-[#1a1a1a] text-white py-3.5 text-xs tracking-[0.15em] uppercase font-semibold hover:bg-[#d4145a] transition-colors"
            >
              View Order Details
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 border border-[#1a1a1a] text-[#1a1a1a] py-3.5 text-xs tracking-[0.15em] uppercase font-semibold hover:bg-[#1a1a1a] hover:text-white transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 md:py-16">
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Header navigation */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#ececec]">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#6e6e6e] hover:text-[#d4145a] transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-[#d4145a]" />
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1a1a1a]">Secure 256-Bit SSL Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Delivery Form & Payment Selection */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Step 1 of 2</span>
              <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a1a] mt-1 mb-6">Shipping Address</h2>

              {savedAddresses.length > 0 && (
                <div className="mb-6 space-y-3">
                  <p className="text-xs font-semibold text-[#1a1a1a] flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#d4145a]" /> Select from Saved Addresses
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      const addrText = addr.address_line_1 ? `${addr.address_line_1}${addr.address_line_2 ? `, ${addr.address_line_2}` : ""}` : (addr.address || "");
                      return (
                        <div
                          key={addr.id}
                          onClick={() => {
                            setSelectedAddressId(addr.id);
                            setFormData({
                              fullName: addr.full_name || user?.name || "",
                              email: user?.email || "",
                              phone: addr.phone || "",
                              address: addrText,
                              city: addr.city || "",
                              state: addr.state || "",
                              pincode: addr.pincode || "",
                            });
                          }}
                          className={`p-3.5 border cursor-pointer transition-all rounded-sm relative ${isSelected ? "border-[#d4145a] bg-[#fce8ef]/20 shadow-sm" : "border-[#ececec] hover:border-[#6e6e6e] bg-white"}`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-[9px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 bg-[#1a1a1a] text-white rounded-xs">
                              {addr.address_type || "HOME"}
                            </span>
                            {isSelected && <Check size={14} className="text-[#d4145a]" />}
                          </div>
                          <p className="text-xs font-bold text-[#1a1a1a] mt-2">{addr.full_name}</p>
                          <p className="text-[11px] text-[#6e6e6e] mt-0.5 line-clamp-2">{addrText}, {addr.city}, {addr.state} - {addr.pincode}</p>
                          <p className="text-[10px] text-[#6e6e6e] mt-1">Ph: {addr.phone}</p>
                        </div>
                      );
                    })}

                    <div
                      onClick={() => {
                        setSelectedAddressId("new");
                        setFormData({
                          fullName: user?.name || "",
                          email: user?.email || "",
                          phone: "",
                          address: "",
                          city: "",
                          state: "",
                          pincode: "",
                        });
                      }}
                      className={`p-3.5 border border-dashed cursor-pointer transition-all rounded-sm flex flex-col items-center justify-center text-center ${selectedAddressId === "new" ? "border-[#d4145a] bg-[#fce8ef]/20" : "border-[#cccccc] hover:border-[#1a1a1a] bg-[#faf7f4]"}`}
                    >
                      <Plus size={18} className="text-[#6e6e6e] mb-1" />
                      <p className="text-xs font-semibold text-[#1a1a1a]">Enter New Address</p>
                      <p className="text-[10px] text-[#9e9e9e]">Fill custom shipping fields below</p>
                    </div>
                  </div>
                </div>
              )}

              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-[#6e6e6e] mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#d4145a]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-[#6e6e6e] mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#d4145a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-[#6e6e6e] mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#d4145a]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-[#6e6e6e] mb-1">Flat, House No., Building, Street *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#d4145a]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-[#6e6e6e] mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#d4145a]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-[#6e6e6e] mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#d4145a]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-[#6e6e6e] mb-1">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#d4145a]"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method Selection */}
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Step 2 of 2</span>
              <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a1a] mt-1 mb-6">Payment Method</h2>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${paymentMethod === "razorpay" ? "border-[#d4145a] bg-[#fce8ef]/30 shadow-sm" : "border-[#ececec] hover:border-[#6e6e6e]"}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="accent-[#d4145a]"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#1a1a1a] flex items-center gap-2">
                        Online Payment / Razorpay <Sparkles size={13} className="text-[#d4145a]" />
                      </p>
                      <p className="text-[10px] text-[#6e6e6e] mt-0.5">UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking</p>
                    </div>
                  </div>
                  <CreditCard size={20} className="text-[#d4145a]" />
                </label>

                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${paymentMethod === "cod" ? "border-[#d4145a] bg-[#fce8ef]/30 shadow-sm" : "border-[#ececec] hover:border-[#6e6e6e]"}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-[#d4145a]"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#1a1a1a]">Cash on Delivery (COD)</p>
                      <p className="text-[10px] text-[#6e6e6e] mt-0.5">Pay in cash upon physical doorstep delivery</p>
                    </div>
                  </div>
                  <Truck size={20} className="text-[#6e6e6e]" />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#faf7f4] border border-[#ececec] p-6 sticky top-24">
              <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a] pb-4 border-b border-[#ececec] mb-4">
                Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
              </h3>

              <div className="max-h-80 overflow-y-auto space-y-4 pr-1 mb-6">
                {items.length === 0 ? (
                  <p className="text-xs text-[#9e9e9e]">Your checkout payload is empty.</p>
                ) : (
                  items.map((item, idx) => {
                    const price = Number(item.sale_price !== null && item.sale_price !== undefined ? item.sale_price : item.price) || 0;
                    const qty = Number(item.quantity) || 1;
                    const rawImg = item.thumbnail || item.product_image || item.image || item.img1 || item.img;
                    const img = formatImageUrl(rawImg);

                    return (
                      <div key={item.cart_item_id || item.product_variant_id || idx} className="flex gap-3 text-xs">
                        <img src={img} alt={item.product_name} className="w-14 h-18 object-cover rounded-sm flex-shrink-0 bg-white" />
                        <div className="flex-1">
                          <p className="font-medium text-[#1a1a1a] line-clamp-1">{item.product_name || item.name}</p>
                          {(item.size || item.color) && (
                            <p className="text-[10px] text-[#6e6e6e] mt-0.5">{[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(" · ")}</p>
                          )}
                          <p className="text-[10px] text-[#6e6e6e] mt-0.5">Qty: {qty}</p>
                          <p className="font-semibold text-[#1a1a1a] mt-1">₹{(price * qty).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Realtime Financial Calculation (Bug 6) */}
              <div className="border-t border-[#ececec] pt-4 space-y-2 text-xs mb-6">
                <div className="flex justify-between text-[#6e6e6e]">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[#6e6e6e]">
                  <span>Shipping Fee</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">FREE</span>
                  ) : (
                    <span>₹{shipping}</span>
                  )}
                </div>
                <div className="flex justify-between text-[#6e6e6e]">
                  <span>GST & Taxes</span>
                  <span className="text-green-600 font-medium">Included</span>
                </div>
                <div className="flex justify-between border-t border-[#ececec] pt-3 text-base font-bold text-[#1a1a1a]">
                  <span>Grand Total</span>
                  <span className="text-[#d4145a]">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={processing || items.length === 0 || grandTotal <= 0}
                className="w-full bg-[#1a1a1a] text-white py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#d4145a] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-white" />
                    Opening Payment Gateway…
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    {paymentMethod === "razorpay" ? `Pay ₹${grandTotal.toLocaleString("en-IN")} with Razorpay` : `Place COD Order (₹${grandTotal.toLocaleString("en-IN")})`}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
