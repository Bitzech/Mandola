import { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle, AlertTriangle, RefreshCw, Plus, X, UserPlus } from "lucide-react";
import { sellerStatusColor, fmt, type AdminNavigateFn } from "./adminData";
import { adminService } from "../../services/admin.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";

const TABS = ["All", "Approved", "Pending", "Rejected", "Suspended"] as const;

export default function SellersPage({ onNavigate: _ }: { onNavigate: AdminNavigateFn }) {
  const [tab, setTab] = useState<typeof TABS[number]>("All");
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    store_name: "",
    business_name: "",
    gst_number: "",
    address: "",
    status: "approved",
  });

  const fetchSellers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await adminService.getSellers({ limit: 50 });
      const rawData = response.data || response;
      const itemsList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];
      setSellers(itemsList);
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load seller accounts.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleUpdateStatus = async (sellerId: string | number, nextStatus: string) => {
    setUpdatingId(sellerId);
    try {
      await adminService.updateSellerStatus(sellerId, nextStatus.toLowerCase());
      toast.success(`Seller status updated to ${nextStatus}.`);
      setSellers((prev) =>
        prev.map((s) => (s.id === sellerId || s.seller_id === sellerId ? { ...s, status: nextStatus.toLowerCase() } : s))
      );
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to update seller status."));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateSeller = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createForm.first_name.trim()) {
      toast.error("First Name is required.");
      return;
    }
    if (!createForm.email.trim()) {
      toast.error("Email Address is required.");
      return;
    }
    if (!createForm.phone.trim()) {
      toast.error("Phone Number is required.");
      return;
    }
    if (createForm.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (createForm.password !== createForm.confirm_password) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!createForm.store_name.trim()) {
      toast.error("Store Name is required.");
      return;
    }

    setCreating(true);
    try {
      await adminService.createSeller(createForm);
      toast.success("Seller account created successfully!");
      setShowCreateModal(false);
      setCreateForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
        store_name: "",
        business_name: "",
        gst_number: "",
        address: "",
        status: "approved",
      });
      fetchSellers();
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to create seller account."));
    } finally {
      setCreating(false);
    }
  };

  const displayed = sellers.filter((s) => {
    if (tab === "All") return true;
    const st = (s.status || "pending").toLowerCase();
    return st === tab.toLowerCase();
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Sellers</h2>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#d4145a] text-white text-[9px] tracking-[0.15em] uppercase font-semibold hover:bg-[#b8114d] transition-colors shadow-sm"
        >
          <UserPlus size={13} strokeWidth={2} /> Create Seller
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 mb-5 bg-white border border-[#ececec] p-1 w-fit">
        {TABS.map((t) => {
          const count = t === "All" ? sellers.length : sellers.filter((s) => (s.status || "pending").toLowerCase() === t.toLowerCase()).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-shrink-0 px-4 py-2 text-[10px] tracking-[0.12em] uppercase font-semibold transition-colors ${tab === t ? "bg-[#d4145a] text-white" : "text-[#6e6e6e] hover:text-[#1a1a1a]"}`}
            >
              {t} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="bg-white border border-[#ececec] p-12 text-center animate-pulse">
          <p className="text-xs text-[#9e9e9e] uppercase tracking-widest">Loading sellers data…</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-12 text-center">
          <p className="text-sm text-red-600 font-light mb-4">{error}</p>
          <button onClick={fetchSellers} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry Loading
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((s) => {
            const statusRaw = s.status || "Pending";
            const statusFormatted = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);
            const storeName = s.business_name || s.store_name || s.name || "Seller Store";
            const sellerName = `${s.first_name || ""} ${s.last_name || ""}`.trim() || s.contact_person || s.owner_name || "Contact Person";
            const isUpdating = updatingId === s.id;

            return (
              <div key={s.id} className="bg-white border border-[#ececec] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#fce8ef] text-[#d4145a] flex items-center justify-center font-bold text-base flex-shrink-0">
                      {storeName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-[#1a1a1a]">{storeName}</p>
                        <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${sellerStatusColor(statusFormatted)}`}>{statusFormatted}</span>
                      </div>
                      <p className="text-xs text-[#6e6e6e] mt-0.5">{sellerName} · {s.email || s.user_email || "No email"}</p>
                      <p className="text-[10px] text-[#9e9e9e] mt-0.5">{s.phone || s.user_phone || "No phone"} · Joined {s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-center">
                    {[
                      ["Products", s.products_count || 0],
                      ["Orders", s.orders_count || 0],
                      ["Revenue", fmt(s.total_revenue || 0)],
                    ].map(([l, v]) => (
                      <div key={String(l)}>
                        <p className="text-[9px] tracking-[0.1em] uppercase text-[#9e9e9e]">{l}</p>
                        <p className="text-sm font-bold text-[#1a1a1a]">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#ececec] flex items-center gap-2 flex-wrap">
                  {statusRaw.toLowerCase() === "pending" && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(s.id, "approved")}
                        disabled={isUpdating}
                        className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-[9px] tracking-[0.1em] uppercase hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                      >
                        {isUpdating ? <RefreshCw size={11} className="animate-spin" /> : <CheckCircle size={11} strokeWidth={2} />} Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(s.id, "rejected")}
                        disabled={isUpdating}
                        className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 text-[9px] tracking-[0.1em] uppercase hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <XCircle size={11} strokeWidth={2} /> Reject
                      </button>
                    </>
                  )}
                  {statusRaw.toLowerCase() === "approved" && (
                    <button
                      onClick={() => handleUpdateStatus(s.id, "suspended")}
                      disabled={isUpdating}
                      className="flex items-center gap-1.5 px-3 py-2 border border-amber-200 text-amber-700 text-[9px] tracking-[0.1em] uppercase hover:bg-amber-50 transition-colors disabled:opacity-50"
                    >
                      <AlertTriangle size={11} strokeWidth={2} /> Suspend
                    </button>
                  )}
                  {statusRaw.toLowerCase() === "suspended" && (
                    <button
                      onClick={() => handleUpdateStatus(s.id, "approved")}
                      disabled={isUpdating}
                      className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1a1a] text-white text-[9px] tracking-[0.1em] uppercase hover:bg-[#d4145a] transition-colors font-semibold disabled:opacity-50"
                    >
                      <CheckCircle size={11} strokeWidth={2} /> Reactivate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {displayed.length === 0 && (
            <div className="bg-white border border-[#ececec] py-16 text-center">
              <p className="text-xs text-[#9e9e9e]">No {tab.toLowerCase()} sellers found.</p>
            </div>
          )}
        </div>
      )}

      {/* Create Seller Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 overflow-y-auto">
          <div className="bg-white w-full max-w-xl p-6 sm:p-8 relative shadow-2xl my-8">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-[#6e6e6e] hover:text-[#1a1a1a] transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mb-6">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">New Account</span>
              <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl font-bold text-[#1a1a1a] mt-1">Create Seller Account</h3>
              <p className="text-xs text-[#6e6e6e] mt-1 font-light">Register a new seller account with role_id = 2 and store profile.</p>
            </div>

            <form onSubmit={handleCreateSeller} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-1 font-semibold">First Name *</label>
                  <input
                    type="text"
                    required
                    value={createForm.first_name}
                    onChange={(e) => setCreateForm((f) => ({ ...f, first_name: e.target.value }))}
                    placeholder="e.g. Priya"
                    className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-1 font-semibold">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={createForm.last_name}
                    onChange={(e) => setCreateForm((f) => ({ ...f, last_name: e.target.value }))}
                    placeholder="e.g. Sharma"
                    className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-1 font-semibold">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="seller@example.com"
                    className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-1 font-semibold">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={createForm.phone}
                    onChange={(e) => setCreateForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="9876543210"
                    className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-1 font-semibold">Password *</label>
                  <input
                    type="password"
                    required
                    value={createForm.password}
                    onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-1 font-semibold font-semibold">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={createForm.confirm_password}
                    onChange={(e) => setCreateForm((f) => ({ ...f, confirm_password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-1 font-semibold">Store Name *</label>
                  <input
                    type="text"
                    required
                    value={createForm.store_name}
                    onChange={(e) => setCreateForm((f) => ({ ...f, store_name: e.target.value }))}
                    placeholder="e.g. Priya Fashions"
                    className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-1 font-semibold">GST Number (Optional)</label>
                  <input
                    type="text"
                    value={createForm.gst_number}
                    onChange={(e) => setCreateForm((f) => ({ ...f, gst_number: e.target.value }))}
                    placeholder="27AAPFU0939F1ZV"
                    className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-1 font-semibold">Status *</label>
                <select
                  value={createForm.status}
                  onChange={(e) => setCreateForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
                >
                  <option value="approved">Approved (Active)</option>
                  <option value="pending">Pending Approval</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#ececec]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border border-[#ececec] text-[#1a1a1a] py-3 text-[10px] tracking-[0.2em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-[#d4145a] text-white py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-[#b8114d] transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creating ? <RefreshCw size={13} className="animate-spin" /> : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
