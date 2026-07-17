import { useState } from "react";

const Field = ({ label, defaultValue, type = "text", placeholder }: { label: string; defaultValue?: string; type?: string; placeholder?: string }) => {
  const [v, setV] = useState(defaultValue ?? "");
  return (
    <div>
      <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">{label}</label>
      <input type={type} value={v} onChange={e => setV(e.target.value)} placeholder={placeholder} className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] bg-white" />
    </div>
  );
};

const Toggle = ({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#ececec] last:border-0">
      <span className="text-sm text-[#1a1a1a] font-light">{label}</span>
      <button onClick={() => setOn(o => !o)} className={`relative w-10 h-5 rounded-full transition-colors ${on ? "bg-[#d4145a]" : "bg-[#ececec]"}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
};

export default function WebsiteSettings() {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Configure</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Website Settings</h2>
      </div>

      {saved && <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-xs tracking-wide">Settings saved successfully.</div>}

      <div className="space-y-6">
        {/* General */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">General</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Site Name"      defaultValue="Mandola Fashion" />
            <Field label="Support Email"  defaultValue="support@mandola.com" type="email" />
            <Field label="Support Phone"  defaultValue="+91 98765 43210" />
            <Field label="Currency"       defaultValue="INR (₹)" />
            <Field label="GST Number"     defaultValue="27AAPFU0939F1ZV" />
            <Field label="Commission %"   defaultValue="10" type="number" />
          </div>
        </div>

        {/* Payment Gateway */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Payment Gateway</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Razorpay Key ID"     placeholder="rzp_live_xxxx" />
            <Field label="Razorpay Key Secret" placeholder="••••••••••••" type="password" />
          </div>
        </div>

        {/* SMTP */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">SMTP Settings</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="SMTP Host"     defaultValue="smtp.gmail.com" />
            <Field label="SMTP Port"     defaultValue="587" />
            <Field label="SMTP Username" defaultValue="noreply@mandola.com" />
            <Field label="SMTP Password" type="password" placeholder="••••••••" />
          </div>
        </div>

        {/* Toggles */}
        <div className="bg-white border border-[#ececec] p-6">
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Site Controls</h3>
          <Toggle label="Maintenance Mode"           defaultOn={false} />
          <Toggle label="New Seller Registrations"   defaultOn={true}  />
          <Toggle label="Customer Reviews"           defaultOn={true}  />
          <Toggle label="Email Notifications"        defaultOn={true}  />
          <Toggle label="SMS Notifications"          defaultOn={false} />
        </div>

        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }} className="px-8 py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
}
