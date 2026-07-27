import { useState, useEffect } from "react";
import { SELLER_ORDERS, orderStatusColor, fmt } from "./sellerData";
import { shipmentService } from "../../services/shipment.service";
import { toast } from "sonner";
import { Loader2, Truck, RefreshCw } from "lucide-react";

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [updating, setUpdating] = useState(false);
  const [statusVal, setStatusVal] = useState("shipped");
  const [locationVal, setLocationVal] = useState("");
  const [remarksVal, setRemarksVal] = useState("");

  const fetchSellerShipments = async () => {
    setLoading(true);
    try {
      const res = await shipmentService.getSellerShipments({ limit: 50 });
      const resData: any = res?.data || res;
      const itemsList = resData?.items || (Array.isArray(resData) ? resData : []);
      if (Array.isArray(itemsList) && itemsList.length > 0) {
        setShipments(itemsList);
      } else {
        // Fallback to mock if API returns empty
        const mockList = SELLER_ORDERS.filter(o => o.tracking).map(o => ({
          id: o.id,
          shipment_number: `SHP-${o.id}`,
          order_number: o.id,
          customer_name: o.customer,
          courier_name: o.courier!,
          tracking_number: o.tracking!,
          shipment_status: o.orderStatus,
          estimated_delivery: "18 Jul 2025",
          shipping_cost: 0,
        }));
        setShipments(mockList);
      }
    } catch (err) {
      console.error("[ShipmentsPage] Error fetching seller shipments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerShipments();
  }, []);

  const handleUpdateStatus = async (shipmentId: string | number) => {
    setUpdating(true);
    try {
      await shipmentService.updateShipmentStatus(shipmentId, {
        status: statusVal,
        location: locationVal || "Seller Logistics Hub",
        remarks: remarksVal || `Shipment status updated to ${statusVal}`,
      });
      toast.success("Shipment status updated successfully!");
      setEditingId(null);
      fetchSellerShipments();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update shipment status.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Shipments</h2>
        </div>
        <button
          onClick={fetchSellerShipments}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#ececec] text-xs text-[#6e6e6e] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#9e9e9e] bg-white border border-[#ececec]">
          <Loader2 size={32} className="animate-spin text-[#d4145a] mb-3" />
          <p className="text-xs tracking-[0.2em] uppercase">Loading Seller Shipments…</p>
        </div>
      ) : shipments.length === 0 ? (
        <div className="bg-white border border-[#ececec] p-12 text-center">
          <Truck size={40} className="text-[#ececec] mx-auto mb-3" />
          <p className="font-['Playfair_Display'] text-lg font-bold text-[#1a1a1a]">No Active Shipments</p>
          <p className="text-xs text-[#6e6e6e] mt-1">No dispatched or pending shipments assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shipments.map((s) => {
            const shpId = s.id;
            const shpNum = s.shipment_number || `SHP-${s.id}`;
            const orderNum = s.order_number || s.order_id || `#ORD-${s.id}`;
            const customer = s.customer_name || s.customer || "Customer";
            const courier = s.courier_name || s.courier || "BlueDart Express";
            const tracking = s.tracking_number || s.tracking || "BD12345678";
            const status = s.shipment_status || s.status || "shipped";
            const estDelivery = s.estimated_delivery ? new Date(s.estimated_delivery).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "3-5 Business Days";

            const isEditing = editingId === shpId;

            return (
              <div key={shpId} className="bg-white border border-[#ececec] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-[#ececec]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#d4145a]">{shpNum}</span>
                      <span className="text-xs text-[#6e6e6e]">({orderNum})</span>
                    </div>
                    <p className="text-xs font-medium text-[#1a1a1a] mt-0.5">{customer}</p>
                  </div>
                  <span className={`text-[9px] tracking-[0.08em] uppercase px-2.5 py-1 font-semibold ${orderStatusColor(status)}`}>
                    {status}
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] mb-1">Courier Partner</p>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{courier}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] mb-1">Tracking AWB</p>
                    <p className="text-sm font-mono font-semibold text-[#d4145a]">{tracking}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] mb-1">Est. Delivery</p>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{estDelivery}</p>
                  </div>
                </div>

                {/* Edit Status Form */}
                {isEditing ? (
                  <div className="mt-4 pt-4 border-t border-[#ececec] bg-[#faf7f4] p-4 space-y-3">
                    <p className="text-xs font-bold text-[#1a1a1a]">Update Live Shipment Status</p>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[9px] uppercase font-semibold text-[#6e6e6e] mb-1">Status</label>
                        <select
                          value={statusVal}
                          onChange={(e) => setStatusVal(e.target.value)}
                          className="w-full border border-[#ececec] p-2 text-xs bg-white focus:outline-none focus:border-[#d4145a]"
                        >
                          <option value="manifested">Manifested</option>
                          <option value="packed">Packed</option>
                          <option value="shipped">Shipped</option>
                          <option value="in_transit">In Transit</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="returned">Returned</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-semibold text-[#6e6e6e] mb-1">Current Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Bangalore Sort Hub"
                          value={locationVal}
                          onChange={(e) => setLocationVal(e.target.value)}
                          className="w-full border border-[#ececec] p-2 text-xs bg-white focus:outline-none focus:border-[#d4145a]"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-semibold text-[#6e6e6e] mb-1">Status Remarks</label>
                        <input
                          type="text"
                          placeholder="e.g. Package in transit to destination"
                          value={remarksVal}
                          onChange={(e) => setRemarksVal(e.target.value)}
                          className="w-full border border-[#ececec] p-2 text-xs bg-white focus:outline-none focus:border-[#d4145a]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 text-xs text-[#6e6e6e] hover:text-[#1a1a1a]"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={updating}
                        onClick={() => handleUpdateStatus(shpId)}
                        className="px-4 py-1.5 bg-[#d4145a] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#a00e42] transition-colors disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {updating && <Loader2 size={12} className="animate-spin" />}
                        Save Update
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 pt-3 border-t border-[#ececec] flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(shpId);
                        setStatusVal(status);
                        setLocationVal("");
                        setRemarksVal("");
                      }}
                      className="text-[10px] tracking-[0.1em] uppercase text-[#d4145a] hover:underline font-semibold"
                    >
                      Update Shipment Status
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
