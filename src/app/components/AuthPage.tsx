import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Star, ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import logoImg from "@/imports/image.png";
import { useAuth, getRoleFromId } from "../context/AuthContext";

interface Props {
  onBack: () => void;
  onLogin?: () => void;
  onSellerLogin?: () => void;
  onAdminLogin?: () => void;
}

export default function AuthPage({ onBack }: Props) {
  const navigate = useNavigate();
  const { login, register, sendOTP, verifyOTP, saveAuthSession } = useAuth();

  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [subStep, setSubStep] = useState<"form" | "otp">("form");
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Temporary storage for tokens returned from register API prior to OTP verification
  const [pendingTokens, setPendingTokens] = useState<{
    accessToken?: string;
    refreshToken?: string;
    user?: any;
    roleId?: number;
  } | null>(null);

  // Stored credentials for automatic login after 403 unverified login OTP flow
  const [storedLoginCreds, setStoredLoginCreds] = useState<{
    email: string;
    password: string;
  } | null>(null);

  // Countdown timer effect for OTP resend
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (subStep === "otp" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [subStep, countdown]);

  const setField = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthError("");
    setFieldErrors((prev) => ({ ...prev, [k]: "" }));
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const handleTabChange = (t: "signin" | "register") => {
    setTab(t);
    setSubStep("form");
    setAuthError("");
    setFieldErrors({});
    setOtp("");
    setPendingTokens(null);
    setStoredLoginCreds(null);
  };

  const parseBackendError = (err: any) => {
    let globalMsg = "An error occurred. Please try again.";
    const newFieldErrors: Record<string, string> = {};

    if (!err.response) {
      globalMsg = "Network error. Please check your connection.";
    } else if (err.response.data) {
      const data = err.response.data;
      if (data.message) {
        globalMsg = data.message;
      }
      if (Array.isArray(data.errors)) {
        data.errors.forEach((e: any) => {
          if (e.field && e.message) {
            newFieldErrors[e.field] = e.message;
          }
        });
      } else if (typeof data.errors === "object" && data.errors !== null) {
        Object.keys(data.errors).forEach((key) => {
          const val = data.errors[key];
          newFieldErrors[key] = Array.isArray(val) ? val.join(" ") : String(val);
        });
      }
    }

    setFieldErrors(newFieldErrors);
    setAuthError(globalMsg);
    toast.error(globalMsg);
  };

  const handleRegisterSubmit = async () => {
    if (form.password !== form.confirm) {
      const msg = "Passwords do not match";
      setFieldErrors({ confirm: msg, confirm_password: msg });
      setAuthError(msg);
      return;
    }

    setLoading(true);
    setAuthError("");
    setFieldErrors({});

    try {
      const regResponse = await register({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirm_password: form.confirm,
      });

      const resData = regResponse?.data || regResponse;
      const accessToken =
        resData?.access_token ||
        resData?.accessToken ||
        resData?.tokens?.access_token ||
        regResponse?.access_token;
      const refreshTokenValue =
        resData?.refresh_token ||
        resData?.refreshToken ||
        resData?.tokens?.refresh_token ||
        regResponse?.refresh_token;
      const userObj = resData?.user || resData?.user_info || regResponse?.user;
      const userRoleId = resData?.role_id || userObj?.role_id || 3;

      if (accessToken) {
        setPendingTokens({
          accessToken,
          refreshToken: refreshTokenValue,
          user: userObj,
          roleId: userRoleId,
        });
      }

      // Immediately call send-otp
      await sendOTP(form.email, "verify_email");

      toast.success("Account registered! OTP sent to your email.");
      setSubStep("otp");
      setCountdown(60);
    } catch (err: any) {
      parseBackendError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async () => {
    setLoading(true);
    setAuthError("");
    setFieldErrors({});

    try {
      const loginResponse = await login({
        email: form.email,
        password: form.password,
      });

      const resData = loginResponse?.data || loginResponse;
      const userObj = resData?.user || resData?.user_info;
      const roleIdNum = resData?.role_id || userObj?.role_id || 3;
      const userRole = getRoleFromId(roleIdNum);

      toast.success("Signed in successfully!");
      redirectUserByRole(userRole);
    } catch (err: any) {
      const status = err.response?.status;
      const reqVerification = err.response?.data?.requires_verification;

      if (status === 403 && reqVerification) {
        setStoredLoginCreds({ email: form.email, password: form.password });
        try {
          await sendOTP(form.email, "verify_email");
          toast.info("Account requires email verification. OTP sent!");
          setSubStep("otp");
          setCountdown(60);
        } catch (otpErr: any) {
          parseBackendError(otpErr);
        }
      } else {
        parseBackendError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setAuthError("Please enter a valid 6-digit OTP code");
      return;
    }

    setLoading(true);
    setAuthError("");
    setFieldErrors({});

    try {
      const verifyRes = await verifyOTP(form.email, otp.trim(), "verify_email");
      toast.success("Verification successful!");

      const resData = verifyRes?.data || verifyRes;
      const accessToken =
        resData?.access_token ||
        resData?.accessToken ||
        resData?.tokens?.access_token ||
        verifyRes?.access_token ||
        pendingTokens?.accessToken;

      const refreshTokenValue =
        resData?.refresh_token ||
        resData?.refreshToken ||
        resData?.tokens?.refresh_token ||
        verifyRes?.refresh_token ||
        pendingTokens?.refreshToken;

      const userObj = resData?.user || resData?.user_info || verifyRes?.user || pendingTokens?.user;
      const roleIdNum = resData?.role_id || userObj?.role_id || pendingTokens?.roleId || 3;
      const targetRole = getRoleFromId(roleIdNum);

      if (accessToken) {
        saveAuthSession({
          accessToken,
          refreshToken: refreshTokenValue,
          user: userObj,
          roleId: roleIdNum,
        });
        redirectUserByRole(targetRole);
      } else if (storedLoginCreds) {
        // If login 403 flow was used and verify OTP succeeded
        const autoLoginRes = await login(storedLoginCreds);
        const autoResData = autoLoginRes?.data || autoLoginRes;
        const autoRoleId = autoResData?.role_id || autoResData?.user?.role_id || 3;
        redirectUserByRole(getRoleFromId(autoRoleId));
      } else {
        // Fallback: try logging in with registered password
        if (form.email && form.password) {
          const autoLoginRes = await login({ email: form.email, password: form.password });
          const autoResData = autoLoginRes?.data || autoLoginRes;
          const autoRoleId = autoResData?.role_id || autoResData?.user?.role_id || 3;
          redirectUserByRole(getRoleFromId(autoRoleId));
        } else {
          redirectUserByRole("customer");
        }
      }
    } catch (err: any) {
      parseBackendError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0 || loading) return;
    setLoading(true);
    setAuthError("");
    try {
      await sendOTP(form.email, "verify_email");
      toast.success("A new OTP code has been sent to your email.");
      setCountdown(60);
    } catch (err: any) {
      parseBackendError(err);
    } finally {
      setLoading(false);
    }
  };

  const redirectUserByRole = (userRole: string) => {
    if (userRole === "admin") {
      navigate("/admin");
    } else if (userRole === "seller") {
      navigate("/seller");
    } else {
      navigate("/customer");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (tab === "signin") {
      handleLoginSubmit();
    } else {
      handleRegisterSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f4] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <button onClick={onBack} className="inline-block mb-6">
            <img src={logoImg} alt="Mandola" className="h-16 w-auto object-contain mx-auto" />
          </button>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#6e6e6e]">Your Fashion Destination</p>
        </div>

        <div className="bg-white shadow-[0_4px_40px_rgba(0,0,0,0.06)] p-8 md:p-10">
          <div className="flex border-b border-[#ececec] mb-8">
            {(["signin", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleTabChange(t)}
                disabled={loading}
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

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-xs tracking-wide mb-6">
              {authError}
            </div>
          )}

          {subStep === "otp" ? (
            /* OTP Verification UI inside the SAME card */
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-[#fce8ef] rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck size={22} className="text-[#d4145a]" />
                </div>
                <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1a1a1a] mb-1">
                  Verify Your Email
                </h3>
                <p className="text-xs text-[#6e6e6e] font-light leading-relaxed">
                  We have sent a 6-digit OTP verification code to <span className="font-semibold text-[#1a1a1a]">{form.email}</span>
                </p>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2 text-center">
                  6-Digit OTP Code
                </label>
                <input
                  value={otp}
                  onChange={(e) => {
                    setAuthError("");
                    setFieldErrors({});
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                  }}
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="000000"
                  className="w-full border border-[#ececec] px-4 py-3 text-center text-xl tracking-[0.5em] font-mono text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
                />
                {(fieldErrors.otp || fieldErrors.code) && (
                  <p className="text-xs text-red-500 mt-1 font-light text-center">
                    {fieldErrors.otp || fieldErrors.code}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otp.trim().length !== 6}
                className="w-full bg-[#1a1a1a] text-white py-3.5 text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-[#d4145a] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={countdown > 0 || loading}
                  className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline disabled:text-[#a0a0a0] disabled:no-underline disabled:cursor-not-allowed"
                >
                  <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSubStep("form");
                    setAuthError("");
                    setFieldErrors({});
                  }}
                  disabled={loading}
                  className="flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-[#6e6e6e] hover:text-[#1a1a1a]"
                >
                  <ArrowLeft size={12} />
                  Back
                </button>
              </div>
            </form>
          ) : (
            /* Main Form (Registration or Login) */
            <form onSubmit={handleSubmit} className="space-y-5">
              {tab === "register" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">
                      First Name
                    </label>
                    <input
                      value={form.firstName}
                      onChange={setField("firstName")}
                      required
                      placeholder="Priya"
                      className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
                    />
                    {(fieldErrors.first_name || fieldErrors.firstName) && (
                      <p className="text-xs text-red-500 mt-1 font-light">
                        {fieldErrors.first_name || fieldErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">
                      Last Name
                    </label>
                    <input
                      value={form.lastName}
                      onChange={setField("lastName")}
                      required
                      placeholder="Sharma"
                      className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
                    />
                    {(fieldErrors.last_name || fieldErrors.lastName) && (
                      <p className="text-xs text-red-500 mt-1 font-light">
                        {fieldErrors.last_name || fieldErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">
                  Email Address
                </label>
                <input
                  value={form.email}
                  onChange={setField("email")}
                  required
                  type="email"
                  placeholder="hello@example.com"
                  className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-500 mt-1 font-light">{fieldErrors.email}</p>
                )}
              </div>

              {tab === "register" && (
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">
                    Phone Number
                  </label>
                  <input
                    value={form.phone}
                    onChange={setField("phone")}
                    placeholder="+91 98765 43210"
                    className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
                  />
                  {(fieldErrors.phone || fieldErrors.phone_number) && (
                    <p className="text-xs text-red-500 mt-1 font-light">
                      {fieldErrors.phone || fieldErrors.phone_number}
                    </p>
                  )}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e]">
                    Password
                  </label>
                  {tab === "signin" && (
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="text-[10px] text-[#d4145a] tracking-wide hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    value={form.password}
                    onChange={setField("password")}
                    required
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6e6e6e] hover:text-[#d4145a] text-[10px] tracking-wide"
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-red-500 mt-1 font-light">{fieldErrors.password}</p>
                )}
              </div>

              {tab === "register" && (
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">
                    Confirm Password
                  </label>
                  <input
                    value={form.confirm}
                    onChange={setField("confirm")}
                    required
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-[#ececec] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#c0c0c0] focus:outline-none focus:border-[#d4145a] transition-colors bg-white"
                  />
                  {(fieldErrors.confirm || fieldErrors.confirm_password) && (
                    <p className="text-xs text-red-500 mt-1 font-light">
                      {fieldErrors.confirm || fieldErrors.confirm_password}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a1a1a] text-white py-3.5 text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-[#d4145a] transition-colors duration-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Please wait..."
                  : tab === "signin"
                  ? "Sign In to My Account"
                  : "Create My Account"}
              </button>

              {tab === "register" && (
                <p className="text-[10px] text-[#6e6e6e] text-center leading-relaxed font-light">
                  By creating an account, you agree to our{" "}
                  <a href="/terms-and-conditions" className="text-[#d4145a] hover:underline">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy-policy" className="text-[#d4145a] hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              )}

              <div className="relative flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-[#ececec]" />
                <span className="text-[10px] tracking-wide text-[#6e6e6e]">or</span>
                <div className="flex-1 h-px bg-[#ececec]" />
              </div>

              <button
                type="button"
                onClick={() => handleTabChange(tab === "signin" ? "register" : "signin")}
                disabled={loading}
                className="w-full border border-[#ececec] text-[#1a1a1a] py-3 text-[10px] tracking-[0.2em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tab === "signin" ? "New here? Create Account" : "Already have an account? Sign In"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-[10px] text-[#6e6e6e] mt-6 tracking-wide">
          <button onClick={onBack} className="hover:text-[#d4145a] transition-colors">
            ← Back to Shopping
          </button>
        </p>
      </div>
    </div>
  );
}
