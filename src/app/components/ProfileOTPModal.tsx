import { useState, useEffect } from "react";
import { X, ShieldCheck, RefreshCw, Mail, Phone, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth, getRoleFromId } from "../context/AuthContext";
import { extractErrorMessage } from "../utils/errorExtractor";

interface ProfileOTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIdentifier: string;
  initialType: "verify_email" | "verify_phone";
  onSuccess: () => void;
}

export default function ProfileOTPModal({
  isOpen,
  onClose,
  initialIdentifier,
  initialType,
  onSuccess,
}: ProfileOTPModalProps) {
  const { sendOTP, verifyOTP, saveAuthSession } = useAuth();

  const [otpType, setOtpType] = useState<"verify_email" | "verify_phone">(initialType);
  const [identifier, setIdentifier] = useState<string>(initialIdentifier);
  const [otp, setOtp] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(60);
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setOtpType(initialType);
      setIdentifier(initialIdentifier);
      setOtp("");
      setCountdown(60);
      setErrorMsg("");
    }
  }, [isOpen, initialIdentifier, initialType]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isOpen && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, countdown]);

  if (!isOpen) return null;

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(val);
    if (errorMsg) setErrorMsg("");
  };

  const handleResendOTP = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setErrorMsg("");

    try {
      await sendOTP(identifier, otpType);
      toast.success(`A new verification OTP code has been sent to ${identifier}`);
      setCountdown(60);
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to resend OTP code.");
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrorMsg("Please enter a valid 6-digit OTP code.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await verifyOTP(identifier, otp, otpType);
      const resData = res?.data || res;

      // Check if second verification step is required (e.g., both email and phone were updated)
      if (resData?.requires_verification) {
        setOtp("");
        if (resData.verify_phone) {
          setOtpType("verify_phone");
          setIdentifier(resData.identifier || identifier);
          toast.success(resData.message || "Email verified! An OTP code has been sent to your mobile number.");
        } else if (resData.verify_email) {
          setOtpType("verify_email");
          setIdentifier(resData.identifier || identifier);
          toast.success(resData.message || "Phone verified! An OTP code has been sent to your email address.");
        }
        setCountdown(60);
        return;
      }

      // Verification complete: Update session tokens if returned
      const accessToken =
        resData?.access_token || resData?.accessToken || resData?.tokens?.access_token || res?.access_token;
      const refreshToken =
        resData?.refresh_token || resData?.refreshToken || resData?.tokens?.refresh_token || res?.refresh_token;
      const userObj = resData?.user || resData?.user_info || res?.user;

      if (accessToken || userObj) {
        const roleIdNum = resData?.role_id || userObj?.role_id || 3;
        saveAuthSession({
          accessToken,
          refreshToken,
          user: userObj,
          roleId: roleIdNum,
          role: getRoleFromId(roleIdNum),
        });
      }

      toast.success(resData?.message || "Profile updated & contact verified successfully!");
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Verification failed. Please check the OTP code.");
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const isEmail = otpType === "verify_email";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-[#ececec] shadow-2xl max-w-md w-full p-6 md:p-8 relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4145a]" />

        {/* Mandatory Lock Badge */}
        <div className="absolute top-3.5 right-4 flex items-center gap-1.5 text-[10px] tracking-wider uppercase font-semibold text-[#d4145a] bg-[#fce8ef] px-2.5 py-1 rounded-full">
          <ShieldCheck size={13} /> Mandatory
        </div>

        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#fce8ef] flex items-center justify-center text-[#d4145a] mb-4">
            {isEmail ? <Mail size={26} /> : <Phone size={26} />}
          </div>

          <span className="text-[10px] tracking-[0.25em] uppercase text-[#d4145a] font-semibold mb-1">
            Verification Required
          </span>
          <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#1a1a1a]">
            {isEmail ? "Verify Email Address" : "Verify Phone Number"}
          </h3>
          <p className="text-xs text-[#6e6e6e] font-light mt-2 max-w-xs leading-relaxed">
            Enter the 6-digit OTP code sent to{" "}
            <span className="font-semibold text-[#1a1a1a] block mt-0.5">{identifier}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs tracking-wide rounded text-center">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2 text-center">
              Enter 6-Digit OTP Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
              placeholder="••••••"
              autoFocus
              className="w-full text-center tracking-[0.6em] font-mono text-2xl py-3 border border-[#ececec] focus:outline-none focus:border-[#d4145a] transition-colors bg-[#faf9f8] text-[#1a1a1a]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-3.5 bg-[#1a1a1a] hover:bg-[#d4145a] text-white text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Verifying...
              </>
            ) : (
              <>
                <ShieldCheck size={16} /> Verify & Update Profile <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Resend Section */}
        <div className="mt-6 pt-5 border-t border-[#ececec] text-center">
          <p className="text-xs text-[#6e6e6e]">
            Didn't receive the code?{" "}
            {countdown > 0 ? (
              <span className="font-semibold text-[#1a1a1a]">Resend in {countdown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resending}
                className="text-[#d4145a] font-semibold hover:underline transition-colors disabled:opacity-50"
              >
                {resending ? "Resending..." : "Resend OTP"}
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
