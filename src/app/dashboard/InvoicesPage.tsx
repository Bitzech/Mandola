import { Download, FileText } from "lucide-react";
import { MOCK_ORDERS, deliveryStatusColor, paymentStatusColor } from "./dashboardData";
import type { NavigateFn } from "./dashboardData";

export default function InvoicesPage({ onNavigate }: { onNavigate: NavigateFn }) {
  const invoiceOrders = MOCK_ORDERS.filter(o => o.paymentStatus === "Paid");

  return (
    <div>
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Documents</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Download Invoices</h2>
        <p className="text-sm text-[#6e6e6e] font-light mt-1">{invoiceOrders.length} invoices available</p>
      </div>

      <div className="space-y-3">
        {invoiceOrders.map(order => (
          <div key={order.id} className="bg-white border border-[#ececec] p-5">
            <div className="flex items-center gap-4">
              {/* Invoice icon */}
              <div className="w-12 h-12 bg-[#faf7f4] flex items-center justify-center flex-shrink-0">
                <FileText size={22} strokeWidth={1.5} className="text-[#d4145a]" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-[#1a1a1a]">Invoice #{order.id}</p>
                  <span className={`text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 ${paymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                  <span className={`text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 ${deliveryStatusColor(order.deliveryStatus)}`}>
                    {order.deliveryStatus}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-0.5">
                  <span className="text-[10px] text-[#6e6e6e] tracking-wide">Date: {order.date}</span>
                  <span className="text-[10px] text-[#6e6e6e] tracking-wide">
                    Items: {order.items.map(i => i.name).join(", ")}
                  </span>
                  <span className="text-[10px] font-semibold text-[#1a1a1a] tracking-wide">
                    ₹{order.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => onNavigate("order-details", order.id)}
                  className="hidden sm:block text-[10px] tracking-[0.15em] uppercase border border-[#ececec] px-3 py-2 text-[#6e6e6e] hover:border-[#d4145a] hover:text-[#d4145a] transition-colors"
                >
                  View
                </button>
                <button className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase bg-[#1a1a1a] text-white px-4 py-2 hover:bg-[#d4145a] transition-colors">
                  <Download size={12} /> PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-[#9e9e9e] tracking-wide mt-6 text-center">
        Invoices are generated for all paid orders. Downloads are in PDF format.
      </p>
    </div>
  );
}
