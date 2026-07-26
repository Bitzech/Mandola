import { useState, useEffect } from "react";
import { MapPin, Edit2, Trash2, Plus, Check, RefreshCw } from "lucide-react";
import { addressService, type AddressPayload } from "../services/address.service";
import { extractErrorMessage } from "../utils/errorExtractor";
import { toast } from "sonner";

interface AddressUI {
  id: string | number;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const blankForm = (): AddressUI => ({
  id: "",
  label: "Home",
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
});

export default function SavedAddresses() {
  const [addresses, setAddresses] = useState<AddressUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<AddressUI>(blankForm());
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await addressService.getAddresses();
      const rawAddrs = response.data || response;
      if (Array.isArray(rawAddrs)) {
        const mapped: AddressUI[] = rawAddrs.map((a: any) => ({
          id: a.id,
          label: a.address_type ? a.address_type.charAt(0).toUpperCase() + a.address_type.slice(1) : a.label || "Home",
          name: a.full_name || a.name || "",
          phone: a.phone || "",
          line1: a.address_line_1 || a.line1 || "",
          line2: a.address_line_2 || a.line2 || "",
          city: a.city || "",
          state: a.state || "",
          pincode: a.pincode || "",
          isDefault: Boolean(a.is_default || a.isDefault),
        }));
        setAddresses(mapped);
      } else {
        setAddresses([]);
      }
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load saved addresses.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const setField = (k: keyof AddressUI) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFieldErrors((prev) => ({ ...prev, [k]: "" }));
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const startEdit = (addr: AddressUI) => {
    setEditingId(addr.id);
    setAdding(false);
    setFieldErrors({});
    setForm({ ...addr });
  };

  const startAdd = () => {
    setAdding(true);
    setEditingId(null);
    setFieldErrors({});
    setForm(blankForm());
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    const cleanName = form.name.trim();
    if (!cleanName || cleanName.length < 2) {
      errors.name = "Full name must be at least 2 characters.";
    }

    const cleanPhone = form.phone.replace(/\D/g, "").slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      errors.phone = "Phone number must be a 10-digit number.";
    }

    const cleanLine1 = form.line1.trim();
    if (!cleanLine1 || cleanLine1.length < 5) {
      errors.line1 = "Address line 1 must be at least 5 characters.";
    }

    const cleanCity = form.city.trim();
    if (!cleanCity || cleanCity.length < 2) {
      errors.city = "City must be at least 2 characters.";
    }

    const cleanState = form.state.trim();
    if (!cleanState || cleanState.length < 2) {
      errors.state = "State must be at least 2 characters.";
    }

    const cleanPincode = form.pincode.replace(/\D/g, "").slice(0, 6);
    if (!cleanPincode || cleanPincode.length !== 6) {
      errors.pincode = "Pincode must be a 6-digit number.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstMsg = Object.values(errors)[0];
      toast.error(firstMsg);
      return false;
    }

    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setFieldErrors({});

    const cleanPhone = form.phone.replace(/\D/g, "").slice(-10);
    const cleanPincode = form.pincode.replace(/\D/g, "").slice(0, 6);

    const payload: AddressPayload = {
      full_name: form.name.trim(),
      phone: cleanPhone,
      address_line_1: form.line1.trim(),
      address_line_2: form.line2.trim() || undefined,
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: cleanPincode,
      address_type: ["home", "office", "other"].includes(form.label.toLowerCase()) ? form.label.toLowerCase() : "home",
      country: "India",
    };

    try {
      if (adding) {
        await addressService.createAddress(payload);
        toast.success("Address added successfully!");
      } else if (editingId) {
        await addressService.updateAddress(editingId, payload);
        toast.success("Address updated successfully!");
      }
      setEditingId(null);
      setAdding(false);
      fetchAddresses();
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to save address.");
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await addressService.deleteAddress(id);
      toast.success("Address deleted.");
      fetchAddresses();
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to delete address."));
    }
  };

  const handleSetDefault = async (id: string | number) => {
    try {
      await addressService.setDefaultAddress(id);
      toast.success("Default address updated!");
      fetchAddresses();
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to set default address."));
    }
  };

  const showForm = editingId !== null || adding;

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Delivery</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Saved Addresses</h2>
        </div>
        {!showForm && (
          <button onClick={startAdd} className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors">
            <Plus size={13} /> Add New
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4 mb-6 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white p-5 border border-[#ececec] h-48 bg-slate-50" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-12 text-center">
          <p className="text-sm text-red-600 font-light mb-4">{error}</p>
          <button onClick={fetchAddresses} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry Loading
          </button>
        </div>
      ) : null}

      {/* Address cards */}
      {!loading && !error && !showForm && (
        addresses.length === 0 ? (
          <div className="bg-white border border-[#ececec] p-16 text-center">
            <MapPin size={48} className="text-[#ececec] mx-auto mb-4" strokeWidth={1} />
            <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a] mb-2">No addresses saved</p>
            <p className="text-sm text-[#6e6e6e] font-light mb-4">Add a shipping address for faster checkout.</p>
            <button onClick={startAdd} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a]">
              Add Address
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {addresses.map((addr) => (
              <div key={addr.id} className={`bg-white p-5 border transition-colors ${addr.isDefault ? "border-[#d4145a]" : "border-[#ececec]"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] tracking-[0.15em] uppercase font-semibold bg-[#faf7f4] text-[#1a1a1a] px-2.5 py-1">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[9px] tracking-[0.1em] uppercase font-semibold bg-[#fce8ef] text-[#d4145a] px-2 py-0.5">Default</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(addr)} className="text-[#6e6e6e] hover:text-[#d4145a] transition-colors"><Edit2 size={14} /></button>
                    {!addr.isDefault && (
                      <button onClick={() => handleDelete(addr.id)} className="text-[#6e6e6e] hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={15} strokeWidth={1.5} className="text-[#d4145a] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{addr.name}</p>
                    <p className="text-xs text-[#6e6e6e] font-light leading-relaxed mt-0.5">
                      {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
                      {addr.city}, {addr.state} — {addr.pincode}
                    </p>
                    <p className="text-xs text-[#6e6e6e] mt-1">{addr.phone}</p>
                  </div>
                </div>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr.id)} className="mt-4 flex items-center gap-1.5 text-[10px] tracking-[0.1em] uppercase text-[#d4145a] hover:underline transition-colors">
                    <Check size={11} /> Set as Default
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Add/Edit form */}
      {showForm && (
        <form onSubmit={handleSave} className="bg-white border border-[#ececec] p-6 space-y-4">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] pb-3 border-b border-[#ececec]">
            {adding ? "Add New Address" : "Edit Address"}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Label</label>
              <select value={form.label} onChange={setField("label")} className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white">
                <option>Home</option><option>Office</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Full Name *</label>
              <input
                value={form.name}
                onChange={setField("name")}
                placeholder="e.g. Ananya Sharma"
                required
                className={`w-full border px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none bg-white ${fieldErrors.name ? "border-red-500 focus:border-red-500" : "border-[#ececec] focus:border-[#d4145a]"}`}
              />
              {fieldErrors.name && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.name}</p>}
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Phone Number (10 digits) *</label>
              <input
                value={form.phone}
                onChange={setField("phone")}
                placeholder="e.g. 9876543210"
                maxLength={10}
                required
                className={`w-full border px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none bg-white ${fieldErrors.phone ? "border-red-500 focus:border-red-500" : "border-[#ececec] focus:border-[#d4145a]"}`}
              />
              {fieldErrors.phone && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.phone}</p>}
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Pincode (6 digits) *</label>
              <input
                value={form.pincode}
                onChange={setField("pincode")}
                placeholder="e.g. 110001"
                maxLength={6}
                required
                className={`w-full border px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none bg-white ${fieldErrors.pincode ? "border-red-500 focus:border-red-500" : "border-[#ececec] focus:border-[#d4145a]"}`}
              />
              {fieldErrors.pincode && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.pincode}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Address Line 1 (Min 5 chars) *</label>
            <input
              value={form.line1}
              onChange={setField("line1")}
              placeholder="House/Flat No., Building, Street Name"
              required
              className={`w-full border px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none bg-white ${fieldErrors.line1 ? "border-red-500 focus:border-red-500" : "border-[#ececec] focus:border-[#d4145a]"}`}
            />
            {fieldErrors.line1 && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.line1}</p>}
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Address Line 2 (optional)</label>
            <input value={form.line2} onChange={setField("line2")} placeholder="Apartment, suite, unit, etc." className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">City *</label>
              <input
                value={form.city}
                onChange={setField("city")}
                placeholder="e.g. New Delhi"
                required
                className={`w-full border px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none bg-white ${fieldErrors.city ? "border-red-500 focus:border-red-500" : "border-[#ececec] focus:border-[#d4145a]"}`}
              />
              {fieldErrors.city && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.city}</p>}
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">State *</label>
              <input
                value={form.state}
                onChange={setField("state")}
                placeholder="e.g. Delhi"
                required
                className={`w-full border px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none bg-white ${fieldErrors.state ? "border-red-500 focus:border-red-500" : "border-[#ececec] focus:border-[#d4145a]"}`}
              />
              {fieldErrors.state && <p className="text-[10px] text-red-500 mt-1">{fieldErrors.state}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <RefreshCw size={13} className="animate-spin" /> : null}
              {adding ? "Save Address" : "Update Address"}
            </button>
            <button type="button" onClick={() => { setEditingId(null); setAdding(false); }} className="px-8 py-3 border border-[#ececec] text-[#6e6e6e] text-[10px] tracking-[0.2em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
