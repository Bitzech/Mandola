import { useState, useEffect } from "react";
import { sellerService } from "../../services/seller.service";
import { RefreshCw } from "lucide-react";

const Toggle = ({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#ececec] last:border-0">
      <span className="text-sm text-[#1a1a1a] font-light">{label}</span>
      <button
        type="button"
        onClick={onToggle}
        className={`relative w-10 h-5 rounded-full transition-colors ${on ? "bg-[#d4145a]" : "bg-[#ececec]"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
};

export default function SellerSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [tagline, setTagline] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("7-Day Returns");
  const [businessType, setBusinessType] = useState("Sole Proprietorship");
  const [primaryCategory, setPrimaryCategory] = useState("Ethnic Wear");

  const [toggles, setToggles] = useState({
    newOrders: true,
    statusUpdates: true,
    returns: true,
    lowStock: true,
    settlements: true,
    reviews: false,
    announcements: true,
    email: true,
    sms: false
  });

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await sellerService.getProfile();
      const p = (res.data || res) as any;
      if (p) {
        setDisplayName(p.store_name || p.business_name || "");
        setTagline(p.tagline || p.description || "");
        setReturnPolicy(p.return_policy || "7-Day Returns");
        setBusinessType(p.business_type || "Sole Proprietorship");
        setPrimaryCategory(p.primary_category || "Ethnic Wear");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load seller settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const toggleHandler = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await sellerService.updateProfile({
        store_name: displayName,
        description: tagline,
        return_policy: returnPolicy,
        business_type: businessType,
        primary_category: primaryCategory,
        notification_preferences: JSON.stringify(toggles)
      } as any);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-[#9e9e9e]">Loading seller settings…</div>;
  }

  return (
    <div className="font-['Jost',sans-serif]">
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Store Preferences</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Settings</h2>
      </div>

      {saved && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-xs tracking-wide">
          Settings saved successfully.
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchSettings} className="flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase font-semibold underline">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* Store Settings */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Store Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Store Display Name</label>
              <input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full md:w-80 border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Store Tagline / Summary</label>
              <input
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="Your fashion, your way"
                className="w-full md:w-80 border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Return Policy Terms</label>
              <select
                value={returnPolicy}
                onChange={e => setReturnPolicy(e.target.value)}
                className="w-full md:w-80 border border-[#ececec] px-4 py-3 text-sm text-[#6e6e6e] focus:outline-none focus:border-[#d4145a] bg-white"
              >
                <option value="7-Day Returns">7-Day Returns</option>
                <option value="14-Day Returns">14-Day Returns</option>
                <option value="30-Day Returns">30-Day Returns</option>
                <option value="No Returns">No Returns</option>
              </select>
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Business Type & Category</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Business Structure</label>
              <select
                value={businessType}
                onChange={e => setBusinessType(e.target.value)}
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#6e6e6e] focus:outline-none focus:border-[#d4145a] bg-white"
              >
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="Private Limited">Private Limited</option>
                <option value="LLP">LLP</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Primary Category</label>
              <select
                value={primaryCategory}
                onChange={e => setPrimaryCategory(e.target.value)}
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#6e6e6e] focus:outline-none focus:border-[#d4145a] bg-white"
              >
                <option value="Women's Fashion">Women's Fashion</option>
                <option value="Ethnic Wear">Ethnic Wear</option>
                <option value="Western Wear">Western Wear</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Notification Preferences</h3>
          <div className="space-y-0">
            <Toggle label="New order notifications"        on={toggles.newOrders}     onToggle={() => toggleHandler("newOrders")} />
            <Toggle label="Order status updates"           on={toggles.statusUpdates}  onToggle={() => toggleHandler("statusUpdates")} />
            <Toggle label="Return & refund alerts"         on={toggles.returns}        onToggle={() => toggleHandler("returns")} />
            <Toggle label="Low stock alerts"               on={toggles.lowStock}       onToggle={() => toggleHandler("lowStock")} />
            <Toggle label="Payment & settlement updates"   on={toggles.settlements}    onToggle={() => toggleHandler("settlements")} />
            <Toggle label="New review notifications"       on={toggles.reviews}        onToggle={() => toggleHandler("reviews")} />
            <Toggle label="Platform announcements"         on={toggles.announcements} onToggle={() => toggleHandler("announcements")} />
            <Toggle label="Email notifications"            on={toggles.email}          onToggle={() => toggleHandler("email")} />
            <Toggle label="SMS notifications"              on={toggles.sms}            onToggle={() => toggleHandler("sms")} />
          </div>
        </div>

        <div>
          <button
            disabled={saving}
            onClick={handleSave}
            className="px-8 py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors disabled:opacity-50 font-semibold"
          >
            {saving ? "Saving Settings…" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
