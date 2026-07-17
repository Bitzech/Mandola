import { useState } from "react";
import { SELLER_ORDERS, orderStatusColor, fmt } from "./sellerData";

const MOCK_SHIPMENTS = SELLER_ORDERS.filter(o => o.tracking).map(o => ({
  id: o.id,
  customer: o.customer,
  product: o.product,
  productImg: o.productImg,
  tracking: o.tracking!,
  courier: o.courier!,
  status: o.orderStatus,
  expected: "18 Jul 2025",
  amount: o.amount,
}));

// Add a couple extras
const EXTRA = [
  { id: "#ORD-8835", customer: "Tanvi Shah",    product: "Chanderi Suit Set",   productImg: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=80&q=70", tracking: "EK3341820", courier: "Ekart",      status: "Delivered" as const, expected: "9 Jul 2025",  amount: 3400 },
  { id: "#ORD-8832", customer: "Nisha Kapoor",  product: "Cotton Kurta Set",    productImg: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=80&q=70", tracking: "ST7892334", courier: "DTDC",       status: "Shipped"   as const, expected: "19 Jul 2025", amount: 1800 },
];

const ALL_SHIPMENTS = [...MOCK_SHIPMENTS, ...EXTRA];

export default function ShipmentsPage() {
  const [editing, setEditing] = useState<string | null>(null);
  const [trackingVals, setTrackingVals] = useState<Record<string, string>>(
    Object.fromEntries(ALL_SHIPMENTS.map(s => [s.id, s.tracking]))
  );

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Shipments</h2>
      </div>

      <div className="space-y-4">
        {ALL_SHIPMENTS.map(s => (
          <div key={s.id} className="bg-white border border-[#ececec] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-[#ececec]">
              <div className="flex items-center gap-4">
                <img src={s.productImg} alt={s.product} className="w-10 h-12 object-cover bg-[#faf7f4] flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#d4145a]">{s.id}</p>
                  <p className="text-xs font-medium text-[#1a1a1a] mt-0.5">{s.product}</p>
                  <p className="text-[10px] text-[#6e6e6e] mt-0.5">{s.customer} · {fmt(s.amount)}</p>
                </div>
              </div>
              <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${orderStatusColor(s.status)}`}>{s.status}</span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] mb-1">Courier</p>
                <p className="text-sm font-semibold text-[#1a1a1a]">{s.courier}</p>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] mb-1">Tracking Number</p>
                {editing === s.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={trackingVals[s.id]}
                      onChange={e => setTrackingVals(prev => ({ ...prev, [s.id]: e.target.value }))}
                      className="flex-1 border border-[#d4145a] px-2 py-1 text-xs font-mono focus:outline-none"
                      autoFocus
                    />
                    <button onClick={() => setEditing(null)} className="text-[9px] tracking-[0.1em] uppercase text-green-600 hover:underline font-semibold">Save</button>
                  </div>
                ) : (
                  <p className="text-sm font-mono font-semibold text-[#d4145a]">{trackingVals[s.id]}</p>
                )}
              </div>
              <div>
                <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] mb-1">Expected Delivery</p>
                <p className="text-sm font-semibold text-[#1a1a1a]">{s.expected}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#ececec] flex items-center gap-2">
              <button
                onClick={() => setEditing(s.id)}
                className="text-[10px] tracking-[0.1em] uppercase text-[#d4145a] hover:underline font-semibold"
              >
                Update Shipment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
