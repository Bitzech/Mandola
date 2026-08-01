import { useState, useEffect } from "react";
import { Camera, RefreshCw, Upload, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { sellerService } from "../../services/seller.service";
import { useAuth } from "../../context/AuthContext";
import { extractErrorMessage } from "../../utils/errorExtractor";

export default function SellerProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Store & Owner Fields
  const [businessName, setBusinessName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  // Tax & Registration Fields
  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");

  // Address & Location Fields
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("India");

  // Bank & Settlement Fields
  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");

  // Media
  const [logo, setLogo] = useState("");
  const [banner, setBanner] = useState("");

  // Raw initial copy for reset
  const [initialData, setInitialData] = useState<any>(null);

  const populateForm = (p: any) => {
    setBusinessName(p.business_name || p.store_name || "");
    setStoreName(p.store_name || p.business_name || "");
    setOwnerName(p.owner_name || p.owner || `${user?.first_name || ""} ${user?.last_name || ""}`.trim());
    setEmail(p.email || user?.email || "");
    setPhone(p.phone || user?.phone || "");
    setDescription(p.description || "");

    setGstNumber(p.gst_number || p.gstin || p.gst || "");
    setPanNumber(p.pan_number || p.pan || "");

    setAddress(p.address || "");
    setCity(p.city || "");
    setStateName(p.state || "");
    setPincode(p.pincode || "");
    setCountry(p.country || "India");

    setBankName(p.bank_name || p.bank?.name || "");
    setAccountHolderName(p.account_holder_name || p.owner_name || "");
    setAccountNumber(p.account_number || p.bank_account_number || p.bank?.account || "");
    setIfscCode(p.ifsc_code || p.bank_ifsc || p.bank?.ifsc || "");
    setUpiId(p.upi_id || "");

    setLogo(p.logo || user?.avatar || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80");
    setBanner(p.banner || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80");
  };

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await sellerService.getProfile();
      const p = (res.data || res) as any;
      if (p) {
        setInitialData(p);
        populateForm(p);
      }
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load seller profile.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleReset = () => {
    if (initialData) {
      populateForm(initialData);
      toast.info("Form reset to saved profile data.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    const payload: any = {
      business_name: businessName || storeName,
      store_name: storeName || businessName,
      owner_name: ownerName,
      email,
      phone,
      description,
      gst_number: gstNumber.toUpperCase(),
      pan_number: panNumber.toUpperCase(),
      address,
      city,
      state: stateName,
      pincode,
      country,
      bank_name: bankName,
      account_holder_name: accountHolderName || ownerName,
      account_number: accountNumber,
      ifsc_code: ifscCode.toUpperCase(),
      upi_id: upiId,
      logo,
      banner,
    };

    try {
      const res = await sellerService.updateProfile(payload);
      const updated = res.data || res;
      setInitialData(updated);
      setSuccessMsg("Seller profile and business details updated successfully.");
      toast.success("Seller profile saved successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to update seller profile.");
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[#d4145a] border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#9e9e9e]">Loading Seller Profile…</p>
      </div>
    );
  }

  return (
    <div className="font-['Jost',sans-serif] space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Store Setup & Verification</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">My Seller Profile</h2>
        </div>
        <button
          onClick={fetchProfile}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 border border-[#ececec] text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
        >
          <RefreshCw size={13} />
          Reload Data
        </button>
      </div>

      {/* Notifications / Alerts */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-xs tracking-wide flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs tracking-wide flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchProfile} className="text-[10px] uppercase font-bold underline ml-4">
            Retry
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Banner Section */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-4 pb-3 border-b border-[#ececec]">
            Store Branding & Media
          </h3>

          <div className="relative h-44 bg-[#faf7f4] border border-[#ececec] mb-5 overflow-hidden group">
            <img src={banner} alt="Store Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
              <Camera size={20} strokeWidth={1.5} className="mb-1" />
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold">Store Header Banner</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Store Logo URL</label>
              <div className="flex items-center gap-3">
                <img src={logo} alt="Logo Preview" className="w-10 h-10 rounded-full object-cover border-2 border-[#d4145a] flex-shrink-0" />
                <input
                  type="text"
                  value={logo}
                  onChange={e => setLogo(e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-[#ececec] px-3 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Header Banner URL</label>
              <input
                type="text"
                value={banner}
                onChange={e => setBanner(e.target.value)}
                placeholder="https://..."
                className="w-full border border-[#ececec] px-3 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
              />
            </div>
          </div>
        </div>

        {/* Basic Business Details */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">
            Basic Store Information
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Store Name *</label>
              <input
                required
                value={storeName}
                onChange={e => { setStoreName(e.target.value); setBusinessName(e.target.value); }}
                placeholder="e.g. Priya Fashions"
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Owner Full Name *</label>
              <input
                required
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                placeholder="e.g. Priya Mehta"
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Business Email *</label>
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seller@example.com"
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Contact Phone *</label>
              <input
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Store Description / Bio</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Briefly describe your boutique, ethnic wear collections, specialty fabrics, or brand story…"
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Tax & Registration */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">
            Tax & Legal Verification
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">GSTIN (15-Digit GST Number)</label>
              <input
                value={gstNumber}
                onChange={e => setGstNumber(e.target.value.toUpperCase())}
                placeholder="e.g. 27AAPFU0939F1ZV"
                maxLength={15}
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">PAN Number (10-Digit PAN)</label>
              <input
                value={panNumber}
                onChange={e => setPanNumber(e.target.value.toUpperCase())}
                placeholder="e.g. ABCDE1234F"
                maxLength={10}
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">
            Registered Warehouse / Store Address
          </h3>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-3">
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Street Address</label>
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Shop number, street, landmark…"
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">City</label>
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Mumbai"
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">State</label>
              <input
                value={stateName}
                onChange={e => setStateName(e.target.value)}
                placeholder="Maharashtra"
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Pincode / Postal Code</label>
              <input
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                placeholder="400050"
                maxLength={6}
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Bank & Payout Details */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">
            Bank Settlement Details
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Bank Name</label>
              <input
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                placeholder="e.g. HDFC Bank"
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Account Holder Name</label>
              <input
                value={accountHolderName}
                onChange={e => setAccountHolderName(e.target.value)}
                placeholder="Name as per bank passbook"
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Account Number</label>
              <input
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                placeholder="Bank account number"
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">IFSC Code (11-Digit Code)</label>
              <input
                value={ifscCode}
                onChange={e => setIfscCode(e.target.value.toUpperCase())}
                placeholder="e.g. HDFC0001234"
                maxLength={11}
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white font-mono uppercase"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">UPI ID (Optional Payout Handler)</label>
              <input
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                placeholder="e.g. priyafashions@okhdfcbank"
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors disabled:opacity-50 font-semibold flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw size={14} className="animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save size={14} /> Save Profile Changes
              </>
            )}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={handleReset}
            className="px-6 py-3 border border-[#ececec] text-[#6e6e6e] text-[10px] tracking-[0.15em] uppercase hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors disabled:opacity-50"
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}
