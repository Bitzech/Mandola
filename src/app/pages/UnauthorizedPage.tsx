import { useNavigate } from "react-router";
import { ShieldOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-white">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-[#fce8ef] rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldOff size={36} className="text-[#d4145a]" />
        </div>
        <h1 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-3">
          Access Denied
        </h1>
        <p className="text-sm text-[#6e6e6e] leading-relaxed mb-2 font-light">
          You don&apos;t have permission to view this page.
        </p>
        {user && (
          <p className="text-xs text-[#9e9e9e] mb-8">
            Signed in as <span className="font-semibold text-[#1a1a1a] capitalize">{user.role}</span>
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#1a1a1a] text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all"
          >
            <ArrowLeft size={14} />
            Go Back
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#d4145a] text-white text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#a00e42] transition-all"
          >
            Switch Account
          </button>
        </div>
      </div>
    </div>
  );
}
