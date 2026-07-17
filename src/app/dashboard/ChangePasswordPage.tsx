import { useState } from "react";
import { Check, Eye, EyeOff } from "lucide-react";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const toggle = (k: keyof typeof show) => setShow(s => ({ ...s, [k]: !s[k] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.current !== "user") { setError("Current password is incorrect."); return; }
    if (form.newPass.length < 6) { setError("New password must be at least 6 characters."); return; }
    if (form.newPass !== form.confirm) { setError("Passwords do not match."); return; }
    setDone(true);
    setForm({ current: "", newPass: "", confirm: "" });
  };

  return (
    <div className="max-w-md">
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Security</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Change Password</h2>
        <p className="text-sm text-[#6e6e6e] font-light mt-1">Keep your account safe with a strong password</p>
      </div>

      {done ? (
        <div className="bg-white border border-[#ececec] p-10 text-center">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={24} className="text-emerald-600" />
          </div>
          <p className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a] mb-2">Password Updated!</p>
          <p className="text-sm text-[#6e6e6e] font-light">Your password has been changed successfully.</p>
          <button onClick={() => setDone(false)} className="mt-6 px-6 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors">
            Change Again
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-[#ececec] p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-xs tracking-wide">
              {error}
            </div>
          )}

          {[
            { id: "current", label: "Current Password", key: "current" as const },
            { id: "newPass", label: "New Password",     key: "newPass" as const },
            { id: "confirm", label: "Confirm Password", key: "confirm" as const },
          ].map(field => (
            <div key={field.id}>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">{field.label}</label>
              <div className="relative">
                <input
                  value={form[field.key]}
                  onChange={set(field.key)}
                  required
                  type={show[field.key] ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] pr-12 focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
                />
                <button
                  type="button"
                  onClick={() => toggle(field.key)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6e6e6e] hover:text-[#d4145a] transition-colors"
                >
                  {show[field.key] ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          ))}

          <div className="pt-1">
            <button type="submit" className="w-full bg-[#1a1a1a] text-white py-3.5 text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-[#d4145a] transition-colors duration-300">
              Update Password
            </button>
          </div>

          <p className="text-[10px] text-[#6e6e6e] leading-relaxed text-center">
            Use a strong password with letters, numbers, and symbols.
          </p>
        </form>
      )}
    </div>
  );
}
