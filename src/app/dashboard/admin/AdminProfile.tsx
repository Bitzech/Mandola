import { useState, useEffect } from "react";
import { Camera, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { extractErrorMessage } from "../../utils/errorExtractor";

export default function AdminProfile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Super Admin",
    email: user?.email || "admin@mandola.com",
    phone: user?.phone || "+91 98765 00000",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Super Admin",
        email: user.email || "admin@mandola.com",
        phone: user.phone || "+91 98765 00000",
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const parts = form.name.split(" ");
      await updateProfile({
        name: form.name,
        first_name: parts[0] || "",
        last_name: parts.slice(1).join(" ") || "",
        email: form.email,
        phone: form.phone,
      });
      toast.success("Admin profile updated.");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to update admin profile"));
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl = user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop";

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Admin</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">My Profile</h2>
      </div>

      {saved && <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-xs tracking-wide">Profile updated successfully.</div>}

      <div className="max-w-lg">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-[#ececec]">
          <div className="relative group cursor-pointer flex-shrink-0">
            <img src={avatarUrl} alt={form.name} className="w-20 h-20 rounded-full object-cover" />
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={18} strokeWidth={1.5} className="text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a1a1a]">{form.name}</p>
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#d4145a] font-semibold mt-0.5">Administrator</p>
            <button className="mt-2 text-[10px] tracking-[0.15em] uppercase text-[#d4145a] border border-[#d4145a] px-3 py-1.5 hover:bg-[#fce8ef] transition-colors">Upload Photo</button>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-white border border-[#ececec] p-6 space-y-5">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Full Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} type="text" className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Email Address</label>
            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Phone Number</label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} type="text" className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Role</label>
            <input value="Administrator" readOnly className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#9e9e9e] bg-[#faf7f4] cursor-not-allowed" />
          </div>
          <button type="submit" disabled={loading} className="px-8 py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors disabled:opacity-50 flex items-center gap-2">
            {loading ? <RefreshCw size={14} className="animate-spin" /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
