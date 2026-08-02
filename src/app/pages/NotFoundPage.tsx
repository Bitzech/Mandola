import { useNavigate } from "react-router";
import { ArrowLeft, Search } from "lucide-react";

interface NotFoundProps {
  title?: string;
  description?: string;
}

export default function NotFoundPage({
  title = "Page Not Found",
  description = "The page you're looking for doesn't exist or has been moved. Let's get you back to something beautiful."
}: NotFoundProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-white">
      <div className="text-center max-w-md">
        <p className="font-['Playfair_Display'] text-[120px] leading-none font-bold text-[#ececec] select-none">
          404
        </p>
        <h1 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] -mt-4 mb-3">
          {title}
        </h1>
        <p className="text-sm text-[#6e6e6e] leading-relaxed mb-8 font-light">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#1a1a1a] text-[10px] tracking-[0.2em] uppercase font-semibold text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all"
          >
            <ArrowLeft size={14} />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#d4145a] text-white text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#a00e42] transition-all"
          >
            <Search size={14} />
            Browse Collections
          </button>
        </div>
      </div>
    </div>
  );
}
