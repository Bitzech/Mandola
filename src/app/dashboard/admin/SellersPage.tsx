import { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle, AlertTriangle, RefreshCw, UserPlus, X, Search, UserCheck } from "lucide-react";
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

  // Convert Customer to Seller Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  // Store Details Form State
  const [storeName, setStoreName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [converting, setConverting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

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

  // Fetch only Customer Users (role_id = 3)
  const fetchCustomers = async (searchQuery: string = "") => {
    setCustomersLoading(true);
    setModalError(null);
    try {
      const response: any = await adminService.getUsers({
        role: 3, // Role 3 = Customer
        search: searchQuery.trim(),
        limit: 50
      });
      const rawData = response.data || response;
      const userItems = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];

      // Ensure only role_id = 3 customers are listed
      const customerOnlyList = userItems.filter((u: any) => Number(u.role_id) === 3);
      setCustomers(customerOnlyList);
    } catch (err: any) {
      setModalError(extractErrorMessage(err, "Failed to fetch customer accounts."));
    } finally {
      setCustomersLoading(false);
    }
  };

  useEffect(() => {
    if (showCreateModal) {
      fetchCustomers(customerSearch);
    }
  }, [showCreateModal]);

  const handleSearchCustomers = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers(customerSearch);
  };

  const handleSelectCustomer = (c: any) => {
    setSelectedCustomer(c);
    const defaultStoreName = `${c.first_name || "Seller"}'s Store`;
    setStoreName(defaultStoreName);
    setBusinessName(defaultStoreName);
  };

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

  const handleConvertCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomer) {
      toast.error("Please select an existing customer to convert into a seller.");
      return;
    }
    if (!storeName.trim()) {
      toast.error("Store Name is required.");
      return;
    }

    setConverting(true);
    setModalError(null);

    try {
      // Call backend API to update user role_id from 3 to 2 and create seller_profile
      await adminService.createSeller({
        user_id: selectedCustomer.id,
        email: selectedCustomer.email,
        store_name: storeName.trim(),
        business_name: (businessName.trim() || storeName.trim()),
        gst_number: gstNumber.trim(),
        status: "approved"
      });

      toast.success(`Customer ${selectedCustomer.email} converted to Seller successfully!`);
      setShowCreateModal(false);
      setSelectedCustomer(null);
      setStoreName("");
      setBusinessName("");
      setGstNumber("");
      setCustomerSearch("");

      // Refresh sellers list
      fetchSellers();
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to convert customer into seller.");
      setModalError(msg);
      toast.error(msg);
    } finally {
      setConverting(false);
    }
  };

  const displayed = sellers.filter((s) => {
    if (tab === "All") return true;
    const st = (s.status || "pending").toLowerCase();
    return st === tab.toLowerCase();
  });

  return (
    <div className="font-['Jost',sans-serif]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Sellers</h2>
        </div>
        <button
          onClick={() => {
            setShowCreateModal(true);
            setSelectedCustomer(null);
            setModalError(null);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#d4145a] text-white text-[9px] tracking-[0.15em] uppercase font-semibold hover:bg-[#b8114d] transition-colors shadow-sm"
        >
          <UserPlus size={13} strokeWidth={2} /> Convert Customer to Seller
        </button>
      </div>

      {/* Filter Tabs */}
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
            const statusRaw = s.status || s.seller_status || "approved";
            const isSuspended = statusRaw.toLowerCase() === "suspended";
            const statusFormatted = isSuspended ? "Suspended" : statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);
            const storeNameStr = s.business_name || s.store_name || s.name || "Seller Store";
            const sellerName = `${s.first_name || ""} ${s.last_name || ""}`.trim() || s.contact_person || s.owner_name || "Contact Person";
            const isUpdating = updatingId === s.id;

            return (
              <div key={s.id} className={`p-5 transition-all ${isSuspended ? "bg-amber-50/40 border-2 border-amber-300 shadow-sm" : "bg-white border border-[#ececec]"}`}>
                {isSuspended && (
                  <div className="mb-3 bg-amber-100/90 border border-amber-300 px-3.5 py-2 text-xs text-amber-900 font-medium flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs">
                      <AlertTriangle size={14} className="text-amber-700 flex-shrink-0" />
                      <span><strong className="uppercase tracking-wider">STORE SUSPENDED:</strong> Login access & store operations are blocked for this seller.</span>
                    </span>
                  </div>
                )}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0 ${isSuspended ? "bg-amber-200 text-amber-900" : "bg-[#fce8ef] text-[#d4145a]"}`}>
                      {storeNameStr.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-[#1a1a1a]">{storeNameStr}</p>
                        <span className={`text-[9px] tracking-[0.08em] uppercase px-2.5 py-1 font-bold ${isSuspended ? "bg-amber-100 text-amber-900 border border-amber-300" : sellerStatusColor(statusFormatted)}`}>{statusFormatted}</span>
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

                <div className="mt-4 pt-3 border-t border-[#ececec] flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    {/* Suspend / Reactivate Store Status */}
                    {statusRaw.toLowerCase() === "suspended" ? (
                      <button
                        onClick={() => handleUpdateStatus(s.id, "approved")}
                        disabled={isUpdating}
                        className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-[9px] tracking-[0.1em] uppercase hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                      >
                        {isUpdating ? <RefreshCw size={11} className="animate-spin" /> : <CheckCircle size={11} strokeWidth={2} />} Reactivate Store
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(s.id, "suspended")}
                        disabled={isUpdating}
                        className="flex items-center gap-1.5 px-3 py-2 border border-amber-200 text-amber-700 text-[9px] tracking-[0.1em] uppercase hover:bg-amber-50 transition-colors disabled:opacity-50"
                      >
                        <AlertTriangle size={11} strokeWidth={2} /> Suspend Store
                      </button>
                    )}
                  </div>

                  {/* Account Role Management: Revert to Customer (Normal User) */}
                  <button
                    onClick={async () => {
                      const uId = s.user_id || s.id;
                      setUpdatingId(s.id);
                      try {
                        await adminService.updateUserRole(uId, 3);
                        toast.success(`Account ${s.email || storeNameStr} reverted to Normal Customer.`);
                        fetchSellers();
                      } catch (err: any) {
                        toast.error(extractErrorMessage(err, "Failed to revert user role."));
                      } finally {
                        setUpdatingId(null);
                      }
                    }}
                    disabled={isUpdating}
                    className="flex items-center gap-1.5 px-3.5 py-2 border border-[#ececec] text-[#6e6e6e] text-[9px] tracking-[0.1em] uppercase hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors font-semibold disabled:opacity-50"
                    title="Change account role back to normal Customer (role_id = 3)"
                  >
                    <UserCheck size={12} strokeWidth={1.5} /> Revert to Normal Customer
                  </button>
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

      {/* Convert Customer to Seller Modal */}
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
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Customer Promotion</span>
              <h3 className="font-['Playfair_Display'] text-xl sm:text-2xl font-bold text-[#1a1a1a] mt-1">Convert Customer to Seller</h3>
              <p className="text-xs text-[#6e6e6e] mt-1 font-light">Select an existing customer (role_id = 3) to update their role to Seller (role_id = 2) and create their store profile.</p>
            </div>

            {modalError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 text-xs">
                {modalError}
              </div>
            )}

            {/* Step 1: Customer Search */}
            <form onSubmit={handleSearchCustomers} className="mb-5">
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-1.5 font-semibold">1. Search Customer Accounts (role_id = 3)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e9e9e]" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Search by name, email, or phone…"
                    className="w-full border border-[#ececec] pl-9 pr-3 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={customersLoading}
                  className="px-4 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.15em] uppercase hover:bg-[#d4145a] transition-colors font-semibold"
                >
                  {customersLoading ? <RefreshCw size={12} className="animate-spin" /> : "Search"}
                </button>
              </div>
            </form>

            {/* Customer List Selection */}
            <div className="mb-6">
              <label className="block text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-2 font-semibold">
                Select Customer ({customers.length} found)
              </label>
              <div className="max-h-44 overflow-y-auto border border-[#ececec] divide-y divide-[#ececec] bg-white">
                {customersLoading ? (
                  <div className="p-6 text-center text-xs text-[#9e9e9e] animate-pulse">Loading customer accounts…</div>
                ) : customers.length > 0 ? (
                  customers.map((c) => {
                    const isSelected = selectedCustomer?.id === c.id;
                    const fullName = `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Customer";

                    return (
                      <div
                        key={c.id}
                        onClick={() => handleSelectCustomer(c)}
                        className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected ? "bg-[#fce8ef] border-l-4 border-l-[#d4145a]" : "hover:bg-[#faf7f4]"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5">
                            {fullName}
                            {isSelected && <UserCheck size={14} className="text-[#d4145a]" />}
                          </p>
                          <p className="text-[10px] text-[#6e6e6e] mt-0.5">{c.email} · {c.phone || "No phone"}</p>
                        </div>
                        <button
                          type="button"
                          className={`text-[9px] tracking-[0.1em] uppercase font-semibold px-2.5 py-1 ${
                            isSelected ? "bg-[#d4145a] text-white" : "border border-[#ececec] text-[#6e6e6e]"
                          }`}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-xs text-[#9e9e9e]">No customer accounts found.</div>
                )}
              </div>
            </div>

            {/* Step 2: Store Details Form */}
            <form onSubmit={handleConvertCustomer} className="space-y-4">
              <div className="pt-4 border-t border-[#ececec]">
                <label className="block text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-3 font-semibold">
                  2. Store & Business Details
                </label>

                {selectedCustomer ? (
                  <div className="bg-[#faf7f4] border border-[#ececec] p-3 mb-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#9e9e9e] text-[10px] uppercase block">Selected User</span>
                      <span className="font-bold text-[#1a1a1a]">{selectedCustomer.first_name} {selectedCustomer.last_name}</span> ({selectedCustomer.email})
                    </div>
                    <span className="text-[9px] tracking-[0.1em] uppercase font-bold text-[#d4145a] bg-white px-2 py-1 border border-[#fce8ef]">Role: Customer (3)</span>
                  </div>
                ) : (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2.5 mb-4">
                    Please click on a customer from the list above to select them for conversion.
                  </p>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-1 font-semibold">Store Name *</label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="e.g. Priya Fashions"
                      className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-1 font-semibold">Business Name (Optional)</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Priya Fashions Pvt Ltd"
                      className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] mb-1 font-semibold">GSTIN Number (Optional)</label>
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                    placeholder="27AAPFU0939F1ZV"
                    className="w-full border border-[#ececec] px-3.5 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white font-mono uppercase"
                  />
                </div>
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
                  disabled={converting || !selectedCustomer}
                  className="flex-1 bg-[#d4145a] text-white py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-[#b8114d] transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {converting ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" /> Converting…
                    </>
                  ) : (
                    "Convert to Seller"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
