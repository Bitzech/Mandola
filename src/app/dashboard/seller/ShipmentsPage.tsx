import { useState, useEffect } from "react";
import { shipmentService } from "../../services/shipment.service";
import { orderStatusColor, fmt } from "./sellerData";
import { RefreshCw, Search, Truck, MapPin } from "lucide-react";
import { apiClient } from "../../services/apiClient";

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [trackingNoInput, setTrackingNoInput] = useState("");
  const [courierInput, setCourierInput] = useState("");
  const [updating, setUpdating] = useState(false);
  const [trackDetail, setTrackDetail] = useState<any | null>(null);

  const fetchShipments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await shipmentService.getShipments({ search: search.trim() });
      const resData = (res?.data || res) as any;
      if (Array.isArray(resData)) {
        setShipments(resData);
      } else if (resData && Array.isArray(resData.shipments)) {
        setShipments(resData.shipments);
      } else if (resData && Array.isArray(resData.items)) {
        setShipments(resData.items);
      } else {
        setShipments([]);
      }
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
    setTrackingNoInput(s.tracking_number || s.tracking || "");
    setCourierInput(s.courier_name || s.courier || "");
  };

  const handleSaveShipment = async (s: any) => {
    setUpdating(true);
    try {
      await apiClient.put(`/shipments/${s.id}`, {
        tracking_number: trackingNoInput,
        courier_name: courierInput
      });
      setEditingId(null);
      fetchShipments();
    } catch (err: any) {
      alert(err?.message || "Failed to update shipment details.");
    } finally {
      setUpdating(false);
    }
  };

  const handleTrackShipment = async (id: string | number) => {
    try {
      const res = await shipmentService.trackShipment(id);
      setTrackDetail(res.data || res);
    } catch {
      alert("Fetching live tracking details from courier API...");
    }
  };

  return (
    <div className="font-['Jost',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Logistics & Tracking</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Shipments ({shipments.length})</h2>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e9e9e]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") fetchShipments(); }}
            placeholder="Search tracking # or courier…"
            className="w-full border border-[#ececec] pl-9 pr-4 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
          />
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
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#ececec] p-5 h-36 animate-pulse" />
          ))
        ) : shipments.length > 0 ? (
          shipments.map(s => {
            const statusStr = s.status || s.shipment_status || "Shipped";
            const trackingNo = s.tracking_number || s.tracking || "N/A";
            const courierName = s.courier_name || s.courier || "Standard Courier";
            const expectedDate = s.estimated_delivery ? new Date(s.estimated_delivery).toLocaleDateString() : (s.expected || "3-5 Days");

            return (
              <div key={s.id} className="bg-white border border-[#ececec] p-5 hover:border-[#c0c0c0] transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4 pb-4 border-b border-[#ececec]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#fce8ef] text-[#d4145a] rounded-full flex items-center justify-center flex-shrink-0">
                      <Truck size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#d4145a]">{s.order_number || `#ORD-${s.order_id || s.id}`}</p>
                      <p className="text-xs font-medium text-[#1a1a1a] mt-0.5">{s.product_name || s.product || "Sub-Order Items"}</p>
                      <p className="text-[10px] text-[#6e6e6e] mt-0.5">{s.customer_name || s.customer || "Customer"}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${orderStatusColor(statusStr)}`}>
                    {statusStr}
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] mb-1">Courier Service</p>
                    {editingId === s.id ? (
                      <input
                        value={courierInput}
                        onChange={e => setCourierInput(e.target.value)}
                        className="w-full border border-[#d4145a] px-2 py-1 text-xs text-[#1a1a1a] focus:outline-none"
                        placeholder="Courier name"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-[#1a1a1a]">{courierName}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] mb-1">Tracking Number</p>
                    {editingId === s.id ? (
                      <input
                        value={trackingNoInput}
                        onChange={e => setTrackingNoInput(e.target.value)}
                        className="w-full border border-[#d4145a] px-2 py-1 text-xs font-mono text-[#1a1a1a] focus:outline-none"
                        placeholder="AWB / Tracking #"
                      />
                    ) : (
                      <p className="text-sm font-mono font-semibold text-[#d4145a]">{trackingNo}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e] mb-1">Expected Delivery</p>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{expectedDate}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#ececec] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {editingId === s.id ? (
                      <>
                        <button disabled={updating} onClick={() => handleSaveShipment(s)} className="text-[10px] tracking-[0.1em] uppercase text-green-600 font-bold hover:underline">
                          Save Changes
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-[10px] tracking-[0.1em] uppercase text-[#9e9e9e] hover:underline">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleStartEdit(s)} className="text-[10px] tracking-[0.1em] uppercase text-[#d4145a] hover:underline font-semibold">
                        Edit Tracking Info
                      </button>
                    )}
                  </div>

                  <button onClick={() => handleTrackShipment(s.id)} className="flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase text-[#1a1a1a] hover:text-[#d4145a] font-semibold">
                    <MapPin size={12} /> Track Package Timeline
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-[#ececec] py-16 text-center">
            <p className="text-xs text-[#9e9e9e] tracking-wide">No shipment tracking records found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
