import { useState } from "react";

const Toggle = ({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#ececec] last:border-0">
      <span className="text-sm text-[#1a1a1a] font-light">{label}</span>
      <button
        onClick={() => setOn(o => !o)}
        className={`relative w-10 h-5 rounded-full transition-colors ${on ? "bg-[#d4145a]" : "bg-[#ececec]"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
};

export default function SellerSettingsPage() {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Configure</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Settings</h2>
      </div>

      {saved && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-xs tracking-wide">
          Settings saved successfully.
        </div>
      )}

      <div className="space-y-6">
        {/* Store Settings */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Store Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Store Display Name</label>
              <input defaultValue="Priya Fashions" className="w-full md:w-80 border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Store Tagline</label>
              <input placeholder="Your fashion, your way" className="w-full md:w-80 border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] bg-white" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Return Policy</label>
              <select className="w-full md:w-80 border border-[#ececec] px-4 py-3 text-sm text-[#6e6e6e] focus:outline-none focus:border-[#d4145a] bg-white">
                <option>7-Day Returns</option>
                <option>14-Day Returns</option>
                <option>30-Day Returns</option>
                <option>No Returns</option>
              </select>
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Business Details</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Business Type</label>
              <select className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#6e6e6e] focus:outline-none focus:border-[#d4145a] bg-white">
                <option>Sole Proprietorship</option>
                <option>Partnership</option>
                <option>Private Limited</option>
                <option>LLP</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Primary Category</label>
              <select className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#6e6e6e] focus:outline-none focus:border-[#d4145a] bg-white">
                <option>Women's Fashion</option>
                <option>Ethnic Wear</option>
                <option>Western Wear</option>
                <option>Accessories</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Notification Preferences</h3>
          <div className="space-y-0">
            <Toggle label="New order notifications"        defaultOn={true}  />
            <Toggle label="Order status updates"           defaultOn={true}  />
            <Toggle label="Return & refund alerts"         defaultOn={true}  />
            <Toggle label="Low stock alerts"               defaultOn={true}  />
            <Toggle label="Payment & settlement updates"   defaultOn={true}  />
            <Toggle label="New review notifications"       defaultOn={false} />
            <Toggle label="Platform announcements"         defaultOn={true}  />
            <Toggle label="Email notifications"            defaultOn={true}  />
            <Toggle label="SMS notifications"              defaultOn={false} />
          </div>
        </div>

        <div>
          <button
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
            className="px-8 py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
