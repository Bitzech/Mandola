import { useState } from "react";
import { Camera } from "lucide-react";
import { MOCK_SELLER } from "./sellerData";

const Field = ({ label, defaultValue, type = "text", placeholder }: { label: string; defaultValue?: string; type?: string; placeholder?: string }) => {
  const [val, setVal] = useState(defaultValue ?? "");
  return (
    <div>
      <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">{label}</label>
      <input
        type={type}
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
      />
    </div>
  );
};

export default function SellerProfile() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Seller</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">My Profile</h2>
      </div>

      {saved && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-xs tracking-wide">
          Profile updated successfully.
        </div>
      )}

      {/* Store Banner */}
      <div className="relative h-40 bg-[#faf7f4] border border-[#ececec] mb-8 overflow-hidden group cursor-pointer">
        <img src={MOCK_SELLER.banner} alt="Store Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex items-center gap-2 text-white text-xs tracking-[0.15em] uppercase">
            <Camera size={16} strokeWidth={1.5} />
            Change Banner
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Store Logo */}
        <div className="flex items-start gap-6 pb-8 border-b border-[#ececec]">
          <div className="relative group cursor-pointer flex-shrink-0">
            <img src={MOCK_SELLER.avatar} alt={MOCK_SELLER.storeName} className="w-20 h-20 rounded-full object-cover border-2 border-[#d4145a]" />
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={18} strokeWidth={1.5} className="text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a1a1a]">{MOCK_SELLER.storeName}</p>
            <p className="text-xs text-[#6e6e6e] mt-0.5 font-light">{MOCK_SELLER.email}</p>
            <button type="button" className="mt-3 text-[10px] tracking-[0.15em] uppercase text-[#d4145a] border border-[#d4145a] px-4 py-1.5 hover:bg-[#fce8ef] transition-colors">
              Upload Logo
            </button>
          </div>
        </div>

        {/* Store Details */}
        <div>
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Store Information</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Business Name"  defaultValue={MOCK_SELLER.storeName} />
            <Field label="Owner Name"     defaultValue={MOCK_SELLER.owner} />
            <Field label="Email Address"  defaultValue={MOCK_SELLER.email} type="email" />
            <Field label="Phone Number"   defaultValue={MOCK_SELLER.phone} />
            <Field label="GST Number"     defaultValue={MOCK_SELLER.gst} />
            <div className="md:col-span-2">
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Store Address</label>
              <textarea
                defaultValue={MOCK_SELLER.address}
                rows={2}
                className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div>
          <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] mb-5 pb-3 border-b border-[#ececec]">Bank Details</h3>
          <div className="grid md:grid-cols-3 gap-5">
            <Field label="Bank Name"      defaultValue={MOCK_SELLER.bank.name} />
            <Field label="Account Number" defaultValue={MOCK_SELLER.bank.account} />
            <Field label="IFSC Code"      defaultValue={MOCK_SELLER.bank.ifsc} />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="px-8 py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors">
            Save Changes
          </button>
          <button type="button" className="px-6 py-3 border border-[#ececec] text-[#6e6e6e] text-[10px] tracking-[0.2em] uppercase hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
