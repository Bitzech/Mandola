import { useState, useEffect } from "react";
import { Camera, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../utils/errorExtractor";

export default function MyProfile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "Female",
    dob: user?.dob || "",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "Female",
        dob: user.dob || "",
      });
    }
  }, [user]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const nameParts = form.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const res = await updateProfile({
        name: form.name,
        first_name: firstName,
        last_name: lastName,
        email: form.email,
        phone: form.phone,
        gender: form.gender,
        dob: form.dob,
      });

      const resData = res?.data || res;
      if (resData?.requires_verification) {
        toast.info(resData.message || "Verification required for updated contact info.");
      } else {
        toast.success("Profile updated successfully!");
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to update profile."));
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl = user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop";

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
          <img src={avatarUrl} alt={form.name} className="w-20 h-20 rounded-full object-cover" />
          <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#d4145a] text-white rounded-full flex items-center justify-center hover:bg-[#b0103e] transition-colors">
            <Camera size={13} />
          </button>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1a1a1a]">{form.name || "User Profile"}</p>
          <p className="text-xs text-[#6e6e6e] mt-0.5">{form.email}</p>
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
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 flex items-center gap-2 disabled:opacity-50 ${saved ? "bg-emerald-600 text-white" : "bg-[#1a1a1a] text-white hover:bg-[#d4145a]"}`}
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : saved ? <><Check size={14} /> Saved!</> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
