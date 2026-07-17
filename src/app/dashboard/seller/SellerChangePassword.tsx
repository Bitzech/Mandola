import { useState } from "react";

export default function SellerChangePassword() {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [k]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) { setError("Please enter your current password."); return; }
    if (form.newPass.length < 6) { setError("New password must be at least 6 characters."); return; }
    if (form.newPass !== form.confirm) { setError("Passwords do not match."); return; }
    setSuccess(true);
    setForm({ current: "", newPass: "", confirm: "" });
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Security</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Change Password</h2>
      </div>

      <div className="max-w-md">
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-xs tracking-wide">{error}</div>
        )}
        {success && (
          <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-xs tracking-wide">
            Password updated successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-[#ececec] p-6 space-y-5">
          {(["current", "newPass", "confirm"] as const).map(key => (
            <div key={key}>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">
                {key === "current" ? "Current Password" : key === "newPass" ? "New Password" : "Confirm New Password"}
              </label>
              <div className="relative">
                <input
                  type={show[key] ? "text" : "password"}
                  value={form[key]}
                  onChange={set(key)}
                  placeholder="••••••••"
                  className="w-full border border-[#ececec] px-4 py-3 pr-14 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShow(prev => ({ ...prev, [key]: !prev[key] }))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] tracking-wide text-[#6e6e6e] hover:text-[#d4145a]"
                >
                  {show[key] ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          ))}

          <p className="text-[10px] text-[#9e9e9e] leading-relaxed">
            Use at least 8 characters with a mix of uppercase, lowercase, numbers, and symbols.
          </p>

          <button type="submit" className="w-full bg-[#1a1a1a] text-white py-3.5 text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#d4145a] transition-colors">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
