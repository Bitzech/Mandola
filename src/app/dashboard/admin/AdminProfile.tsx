import { useState } from "react";
import { Camera } from "lucide-react";
import { MOCK_ADMIN } from "./adminData";

export default function AdminProfile() {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Admin</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">My Profile</h2>
      </div>

      {saved && <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-xs tracking-wide">Profile updated.</div>}

      <div className="max-w-lg">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-[#ececec]">
          <div className="relative group cursor-pointer flex-shrink-0">
            <img src={MOCK_ADMIN.avatar} alt={MOCK_ADMIN.name} className="w-20 h-20 rounded-full object-cover" />
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={18} strokeWidth={1.5} className="text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a1a1a]">{MOCK_ADMIN.name}</p>
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#d4145a] font-semibold mt-0.5">{MOCK_ADMIN.role}</p>
            <button className="mt-2 text-[10px] tracking-[0.15em] uppercase text-[#d4145a] border border-[#d4145a] px-3 py-1.5 hover:bg-[#fce8ef] transition-colors">Upload Photo</button>
          </div>
        </div>

        <form onSubmit={e => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 3000); }} className="bg-white border border-[#ececec] p-6 space-y-5">
          {[
            { label: "Full Name",      defaultValue: MOCK_ADMIN.name },
            { label: "Email Address",  defaultValue: MOCK_ADMIN.email, type: "email" },
            { label: "Phone Number",   defaultValue: MOCK_ADMIN.phone },
          ].map(({ label, defaultValue, type = "text" }) => (
            <div key={label}>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">{label}</label>
              <input defaultValue={defaultValue} type={type} className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white" />
            </div>
          ))}
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Role</label>
            <input value={MOCK_ADMIN.role} readOnly className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#9e9e9e] bg-[#faf7f4] cursor-not-allowed" />
          </div>
          <button type="submit" className="px-8 py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
