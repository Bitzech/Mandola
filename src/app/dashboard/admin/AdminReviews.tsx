import { useState } from "react";
import { Trash2, Star } from "lucide-react";
import { ADMIN_REVIEWS } from "./adminData";

export default function AdminReviews() {
  const [reviews, setReviews] = useState(ADMIN_REVIEWS.map(r => ({ ...r })));
  const [tab, setTab] = useState<"all" | "reported">("all");

  const del = (id: string) => setReviews(prev => prev.filter(r => r.id !== id));
  const displayed = tab === "reported" ? reviews.filter(r => r.reported) : reviews;

  return (
    <div>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Reviews</h2>
      </div>

      <div className="flex gap-1 mb-5 bg-white border border-[#ececec] p-1 w-fit">
        {(["all", "reported"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 text-[10px] tracking-[0.12em] uppercase font-semibold transition-colors ${tab === t ? "bg-[#d4145a] text-white" : "text-[#6e6e6e] hover:text-[#1a1a1a]"}`}>
            {t === "all" ? `All (${reviews.length})` : `Reported (${reviews.filter(r => r.reported).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {displayed.map(r => (
          <div key={r.id} className={`bg-white border p-5 ${r.reported ? "border-red-200" : "border-[#ececec]"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-[#1a1a1a]">{r.customer}</p>
                  {r.reported && <span className="text-[8px] tracking-wide uppercase bg-red-50 text-red-600 px-2 py-0.5 font-semibold">Reported</span>}
                </div>
                <p className="text-[10px] text-[#6e6e6e] tracking-wide">{r.product} · {r.seller} · {r.date}</p>
                <div className="flex items-center gap-0.5 mt-1.5 mb-2">
                  {[1,2,3,4,5].map(s => <Star key={s} size={11} className={s <= r.rating ? "fill-amber-400 text-amber-400" : "text-[#ececec]"} />)}
                </div>
                <p className="text-sm text-[#6e6e6e] font-light">{r.text}</p>
              </div>
              <button onClick={() => del(r.id)} className="p-2 text-[#6e6e6e] hover:text-red-500 transition-colors flex-shrink-0" title="Delete">
                <Trash2 size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}
        {displayed.length === 0 && <div className="bg-white border border-[#ececec] py-16 text-center text-xs text-[#9e9e9e]">No reviews found.</div>}
      </div>
    </div>
  );
}
