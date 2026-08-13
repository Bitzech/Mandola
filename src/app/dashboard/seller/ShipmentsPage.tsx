import { useState, useEffect } from "react";
import { orderStatusColor, fmt } from "./sellerData";
import { shipmentService } from "../../services/shipment.service";
import { sellerService } from "../../services/seller.service";
import { apiClient } from "../../services/apiClient";
import { toast } from "sonner";
import { Loader2, Truck, RefreshCw, Search, MapPin } from "lucide-react";

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [updating, setUpdating] = useState(false);
  const [statusVal, setStatusVal] = useState("shipped");
  const [locationVal, setLocationVal] = useState("");
  const [remarksVal, setRemarksVal] = useState("");
  const [trackingNoInput, setTrackingNoInput] = useState("");
  const [courierInput, setCourierInput] = useState("");
  const [trackDetail, setTrackDetail] = useState<any | null>(null);

  const fetchShipments = async () => {
    setLoading(true);
    setError(null);
    try {
      let res: any;
      const params: any = { limit: 50 };
      if (search.trim()) params.search = search.trim();

      if (shipmentService.getSellerShipments) {
        res = await shipmentService.getSellerShipments(params);
      } else {
        res = await shipmentService.getShipments(params);
      }
      const resData: any = res?.data || res;
      const itemsList = resData?.items || resData?.shipments || (Array.isArray(resData) ? resData : []);
      setShipments(Array.isArray(itemsList) ? itemsList : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load shipments list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleStartEdit = (s: any) => {
    setEditingId(s.id);
    setStatusVal(s.shipment_status || s.status || "shipped");
    setLocationVal("");
    setRemarksVal("");
    setTrackingNoInput(s.tracking_number || s.tracking || "");
    setCourierInput(s.courier_name || s.courier || "");
  };

  const handleUpdateStatus = async (shipmentId: string | number) => {
    setUpdating(true);
    try {
      await sellerService.updateOrderStatus(shipmentId, statusVal, {
        tracking_number: trackingNoInput,
        awb_number: trackingNoInput,
        courier_name: courierInput,
        shipping_partner: courierInput,
        location: locationVal,
        remarks: remarksVal
      });
      toast.success("Shipment updated successfully!");
      setEditingId(null);
      fetchShipments();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to update shipment status.");
    } finally {
      setUpdating(false);
    }
  };

  const handleTrackShipment = async (id: string | number) => {
    try {
      const res = await shipmentService.trackShipment(id);
      setTrackDetail(res.data || res);
      toast.info("Shipment tracking loaded.");
    } catch {
      toast.info("Fetching live tracking details from courier API...");
    }
  };

  return (
    <div className="font-['Jost',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold font-['Jost']">Logistics & Tracking</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Shipments ({shipments.length})</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e9e9e]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") fetchShipments(); }}
              placeholder="Search tracking # or courier…"
              className="w-full border border-[#ececec] pl-9 pr-4 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
            />
          </div>

          <button
            onClick={fetchShipments}
            className="flex items-center gap-1.5 px-3 py-2 border border-[#ececec] text-xs text-[#6e6e6e] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs mb-5 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchShipments} className="flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase font-semibold underline">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* Shipments List */}
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
            const courier = s.courier_name || s.courier || "Standard Courier";
            const tracking = s.tracking_number || s.tracking || "N/A";
            const status = s.shipment_status || s.status || "shipped";
            const estDelivery = s.estimated_delivery ? new Date(s.estimated_delivery).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : (s.expected || "3-5 Business Days");

            const isEditing = editingId === shpId;

            return (
              <div key={shpId} className="bg-white border border-[#ececec] p-5 hover:border-[#c0c0c0] transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-[#ececec]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#fce8ef] text-[#d4145a] rounded-full flex items-center justify-center flex-shrink-0">
                      <Truck size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#d4145a]">{shpNum}</span>
                        <span className="text-xs text-[#6e6e6e]">({orderNum})</span>
                      </div>
                      <p className="text-xs font-medium text-[#1a1a1a] mt-0.5">{s.product_name || s.product || customer}</p>
                      <p className="text-[10px] text-[#6e6e6e] mt-0.5">Customer: {customer}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] tracking-[0.08em] uppercase px-2.5 py-1 font-semibold ${orderStatusColor(status)}`}>
                    {status}
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] mb-1">Courier Partner</p>
                    {isEditing ? (
                      <input
                        value={courierInput}
                        onChange={e => setCourierInput(e.target.value)}
                        className="w-full border border-[#d4145a] px-2 py-1 text-xs text-[#1a1a1a] focus:outline-none"
                        placeholder="Courier name"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-[#1a1a1a]">{courier}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] mb-1">Tracking AWB / #</p>
                    {isEditing ? (
                      <input
                        value={trackingNoInput}
                        onChange={e => setTrackingNoInput(e.target.value)}
                        className="w-full border border-[#d4145a] px-2 py-1 text-xs font-mono text-[#1a1a1a] focus:outline-none"
                        placeholder="AWB / Tracking #"
                      />
                    ) : (
                      <p className="text-sm font-mono font-semibold text-[#d4145a]">{tracking}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] mb-1">Est. Delivery</p>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{estDelivery}</p>
                  </div>
                </div>

                {/* Edit Status Form */}
                {isEditing ? (
                  <div className="mt-4 pt-4 border-t border-[#ececec] bg-[#faf7f4] p-4 space-y-3">
                    <p className="text-xs font-bold text-[#1a1a1a]">Update Live Shipment Details</p>
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
                  <div className="mt-4 pt-3 border-t border-[#ececec] flex items-center justify-between">
                    <button
                      onClick={() => handleStartEdit(s)}
                      className="text-[10px] tracking-[0.1em] uppercase text-[#d4145a] hover:underline font-semibold"
                    >
                      Update Shipment Status
                    </button>
                    <button onClick={() => handleTrackShipment(s.id)} className="flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase text-[#1a1a1a] hover:text-[#d4145a] font-semibold">
                      <MapPin size={12} /> Track Package
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
