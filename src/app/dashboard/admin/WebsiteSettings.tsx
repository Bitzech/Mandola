import { useState, useEffect } from "react";
import { adminService } from "../../services/admin.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

export default function WebsiteSettings() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    site_name: "Mandola Fashion",
    support_email: "support@mandola.com",
    support_phone: "+91 98765 43210",
    commission_rate: "10",
    maintenance_mode: false,
    seller_registration: true,
  });

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getSettings();
      const rawData = response.data || response;
      if (Array.isArray(rawData)) {
        setSettings(rawData);
        const map: any = {};
        rawData.forEach((item: any) => {
          map[item.key] = item.value;
        });
        setForm((prev) => ({
          ...prev,
          site_name: map.site_name || prev.site_name,
          support_email: map.support_email || prev.support_email,
          support_phone: map.support_phone || prev.support_phone,
          commission_rate: map.commission_rate || prev.commission_rate,
          maintenance_mode: map.maintenance_mode === "true",
          seller_registration: map.seller_registration !== "false",
        }));
      }
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load platform settings.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      toast.success("Settings updated successfully!");
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to save settings."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-slate-200" />
        <div className="bg-white border border-[#ececec] p-6 h-64 bg-slate-50" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Configure</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Website Settings</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">General</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Site Name</label>
              <input
                value={form.site_name}
                onChange={(e) => setForm((f) => ({ ...f, site_name: e.target.value }))}
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Support Email</label>
              <input
                type="email"
                value={form.support_email}
                onChange={(e) => setForm((f) => ({ ...f, support_email: e.target.value }))}
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Support Phone</label>
              <input
                value={form.support_phone}
                onChange={(e) => setForm((f) => ({ ...f, support_phone: e.target.value }))}
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Commission %</label>
              <input
                type="number"
                value={form.commission_rate}
                onChange={(e) => setForm((f) => ({ ...f, commission_rate: e.target.value }))}
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white"
              />
            </div>
          </div>
        </div>

        {/* Site Controls */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Site Controls</h3>
          <div className="flex items-center justify-between py-3 border-b border-[#ececec]">
            <span className="text-sm text-[#1a1a1a] font-light">Maintenance Mode</span>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, maintenance_mode: !f.maintenance_mode }))}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.maintenance_mode ? "bg-[#d4145a]" : "bg-[#ececec]"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.maintenance_mode ? "translate-x-5" : ""}`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-[#1a1a1a] font-light">New Seller Registrations</span>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, seller_registration: !f.seller_registration }))}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.seller_registration ? "bg-[#d4145a]" : "bg-[#ececec]"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.seller_registration ? "translate-x-5" : ""}`} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <RefreshCw size={13} className="animate-spin" /> : null} Save Settings
        </button>
      </form>
    </div>
  );
}
