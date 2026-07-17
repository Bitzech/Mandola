import { useState } from "react";
import { Camera, Check } from "lucide-react";
import { MOCK_USER } from "./dashboardData";

export default function MyProfile() {
  const [form, setForm] = useState({
    name: MOCK_USER.name,
    email: MOCK_USER.email,
    phone: MOCK_USER.phone,
    gender: MOCK_USER.gender,
    dob: MOCK_USER.dob,
  });
  const [saved, setSaved] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Account</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">My Profile</h2>
        <p className="text-sm text-[#6e6e6e] font-light mt-1">Manage your personal information</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-6 mb-8 p-6 bg-white border border-[#ececec]">
        <div className="relative">
          <img src={MOCK_USER.avatar} alt={MOCK_USER.name} className="w-20 h-20 rounded-full object-cover" />
          <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#d4145a] text-white rounded-full flex items-center justify-center hover:bg-[#b0103e] transition-colors">
            <Camera size={13} />
          </button>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1a1a1a]">{MOCK_USER.name}</p>
          <p className="text-xs text-[#6e6e6e] mt-0.5">{MOCK_USER.email}</p>
          <button className="mt-2 text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline transition-colors">
            Change Photo
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white border border-[#ececec] p-6 space-y-5">
        <h3 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#1a1a1a] pb-4 border-b border-[#ececec]">Personal Information</h3>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Full Name</label>
            <input value={form.name} onChange={set("name")} required className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Phone Number</label>
            <input value={form.phone} onChange={set("phone")} className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Email Address</label>
          <input value={form.email} onChange={set("email")} type="email" required className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white" />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Gender</label>
            <select value={form.gender} onChange={set("gender")} className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white">
              <option>Female</option>
              <option>Male</option>
              <option>Non-binary</option>
              <option>Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Date of Birth</label>
            <input value={form.dob} onChange={set("dob")} type="date" className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] transition-colors bg-white" />
          </div>
        </div>

        <div className="pt-2 flex items-center gap-4">
          <button type="submit" className={`px-8 py-3 text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 flex items-center gap-2 ${saved ? "bg-emerald-600 text-white" : "bg-[#1a1a1a] text-white hover:bg-[#d4145a]"}`}>
            {saved ? <><Check size={14} /> Saved!</> : "Save Changes"}
          </button>
          <button type="button" className="px-8 py-3 border border-[#ececec] text-[#6e6e6e] text-xs tracking-[0.2em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
