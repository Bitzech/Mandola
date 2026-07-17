import { useState } from "react";
import { Star } from "lucide-react";
import logoImg from "@/imports/image.png";

interface Props {
  onBack: () => void;
  onLogin?: () => void;
  onSellerLogin?: () => void;
  onAdminLogin?: () => void;
}

const BASE_URL = "https://mandola-backend.onrender.com/api/v1";

export default function AuthPage({
  onBack,
  onLogin,
  onSellerLogin,
  onAdminLogin,
}: Props) {
  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [authError, setAuthError] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAuthError("");
      setForm((f) => ({ ...f, [k]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    try {
      // REGISTER
      if (tab === "register") {
        const response = await fetch(`${BASE_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            phone: form.phone,
            password: form.password,
            confirm_password: form.confirm_password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        setDone(true);
        setLoading(false);
        return;
      }

      // LOGIN
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      // Save token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Save user
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect by role
      switch (data.user?.role) {
        case "admin":
          onAdminLogin?.();
          break;

        case "seller":
          onSellerLogin?.();
          break;

        default:
          onLogin?.();
      }
    } catch (error: any) {
      setAuthError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f4] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <button onClick={onBack} className="inline-block mb-6">
            <img
              src={logoImg}
              alt="Mandola"
              className="h-16 w-auto object-contain mx-auto"
            />
          </button>

          <p className="text-[10px] tracking-[0.3em] uppercase text-[#6e6e6e]">
            Your Fashion Destination
          </p>
        </div>

        {/* Card */}
        <div className="bg-white shadow-[0_4px_40px_rgba(0,0,0,0.06)] p-8 md:p-10">
          {/* Tabs */}
          <div className="flex border-b border-[#ececec] mb-8">
            {(["signin", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setDone(false);
                  setAuthError("");
                }}
                className={`flex-1 pb-3 text-[11px] tracking-[0.2em] uppercase font-semibold transition-all ${
                  tab === t
                    ? "text-[#d4145a] border-b-2 border-[#d4145a] -mb-px"
                    : "text-[#6e6e6e] hover:text-[#1a1a1a]"
                }`}
              >
                {t === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Success State */}
          {done ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-[#fce8ef] rounded-full flex items-center justify-center mx-auto mb-5">
                <Star size={24} className="text-[#d4145a] fill-[#d4145a]" />
              </div>

              <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a1a] mb-2">
                Welcome to Mandola!
              </h3>

              <p className="text-sm text-[#6e6e6e] font-light mb-6">
                Your account has been created successfully.
              </p>

              <button
                onClick={() => {
                  setDone(false);
                  setTab("signin");
                }}
                className="px-8 py-3 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors"
              >
                Sign In Now
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error */}
              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-xs tracking-wide rounded-md">
                  {authError}
                </div>
              )}

              {/* Register Fields */}
              {tab === "register" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">
                      First Name
                    </label>

                    <input
                      value={form.first_name}
                      onChange={set("first_name")}
                      required
                      placeholder="Priya"
                      className="w-full border border-[#ececec] px-4 py-3 text-sm focus:outline-none focus:border-[#d4145a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">
                      Last Name
                    </label>

                    <input
                      value={form.last_name}
                      onChange={set("last_name")}
                      required
                      placeholder="Sharma"
                      className="w-full border border-[#ececec] px-4 py-3 text-sm focus:outline-none focus:border-[#d4145a]"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">
                  Email Address
                </label>

                <input
                  value={form.email}
                  onChange={set("email")}
                  required
                  type="email"
                  placeholder="hello@example.com"
                  className="w-full border border-[#ececec] px-4 py-3 text-sm focus:outline-none focus:border-[#d4145a]"
                />
              </div>

              {/* Phone */}
              {tab === "register" && (
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">
                    Phone Number
                  </label>

                  <input
                    value={form.phone}
                    onChange={set("phone")}
                    required
                    placeholder="9876543210"
                    className="w-full border border-[#ececec] px-4 py-3 text-sm focus:outline-none focus:border-[#d4145a]"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    value={form.password}
                    onChange={set("password")}
                    required
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full border border-[#ececec] px-4 py-3 text-sm focus:outline-none focus:border-[#d4145a] pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6e6e6e] text-[10px]"
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              {tab === "register" && (
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">
                    Confirm Password
                  </label>

                  <input
                    value={form.confirm_password}
                    onChange={set("confirm_password")}
                    required
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-[#ececec] px-4 py-3 text-sm focus:outline-none focus:border-[#d4145a]"
                  />
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a1a1a] text-white py-3.5 text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-[#d4145a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Please Wait..."
                  : tab === "signin"
                  ? "Sign In to My Account"
                  : "Create My Account"}
              </button>

              {/* Toggle */}
              <button
                type="button"
                onClick={() => {
                  setTab(tab === "signin" ? "register" : "signin");
                  setAuthError("");
                }}
                className="w-full border border-[#ececec] text-[#1a1a1a] py-3 text-[10px] tracking-[0.2em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors"
              >
                {tab === "signin"
                  ? "New here? Create Account"
                  : "Already have an account? Sign In"}
              </button>
            </form>
          )}
        </div>

        {/* Back */}
        <p className="text-center text-[10px] text-[#6e6e6e] mt-6 tracking-wide">
          <button onClick={onBack} className="hover:text-[#d4145a] transition-colors">
            ← Back to Shopping
          </button>
        </p>
      </div>
    </div>
  );
}