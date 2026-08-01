import { useState, useEffect } from "react";
import { Trash2, Star, RefreshCw, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { reviewService } from "../../services/review.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | number | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await reviewService.getReviews({ limit: 50 });
      const rawData = response.data || response;
      const itemsList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];
      setReviews(itemsList);
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load product reviews.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApproveStatus = async (id: string | number, status: string) => {
    setActionLoading(id);
    try {
      await reviewService.approveReview(id, status);
      toast.success(`Review status set to ${status}.`);
      fetchReviews();
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to update review status."));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteReview = async (id: string | number) => {
    setActionLoading(id);
    try {
      await reviewService.deleteReview(id);
      toast.success("Review record deleted.");
      fetchReviews();
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to delete review."));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Product Reviews</h2>
        </div>
        <button
          onClick={fetchReviews}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#ececec] text-xs text-[#6e6e6e] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-[#ececec] p-12 text-center animate-pulse">
          <p className="text-xs text-[#9e9e9e] uppercase tracking-widest">Loading reviews data…</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-12 text-center">
          <p className="text-sm text-red-600 font-light mb-4">{error}</p>
          <button onClick={fetchReviews} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry Loading
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => {
            const customerName = r.customer_name || `${r.first_name || ""} ${r.last_name || ""}`.trim() || r.user_name || r.email || "Customer";
            const productName = r.product_name || r.product || `Product #${r.product_id || ""}`;
            const rating = r.rating || 5;
            const title = r.title || "";
            const text = r.review || r.review_text || r.comment || r.text || "No review content provided.";
            const date = r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
            const status = r.status || "approved";

            const isBusy = actionLoading === r.id;

            return (
              <div key={r.id} className="bg-white border border-[#ececec] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-[#1a1a1a]">{customerName}</p>
                      <span className={`text-[9px] tracking-wider uppercase px-2 py-0.5 font-semibold ${status === "approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : status === "rejected" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                        {status}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#6e6e6e] tracking-wide">{productName} · {date}</p>

                    <div className="flex items-center gap-0.5 mt-1.5 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={11} className={s <= rating ? "fill-amber-400 text-amber-400" : "text-[#ececec]"} />
                      ))}
                    </div>

                    {title && <p className="text-xs font-bold text-[#1a1a1a] mb-1">{title}</p>}
                    <p className="text-xs text-[#6e6e6e] font-light leading-relaxed">{text}</p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {status !== "approved" && (
                      <button
                        disabled={isBusy}
                        onClick={() => handleApproveStatus(r.id, "approved")}
                        className="px-2.5 py-1.5 bg-emerald-600 text-white text-[10px] uppercase font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1"
                        title="Approve Review"
                      >
                        {isBusy ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                        Approve
                      </button>
                    )}
                    {status !== "rejected" && (
                      <button
                        disabled={isBusy}
                        onClick={() => handleApproveStatus(r.id, "rejected")}
                        className="px-2.5 py-1.5 bg-amber-600 text-white text-[10px] uppercase font-semibold hover:bg-amber-700 transition-colors flex items-center gap-1"
                        title="Reject Review"
                      >
                        {isBusy ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                        Reject
                      </button>
                    )}
                    <button
                      disabled={isBusy}
                      onClick={() => handleDeleteReview(r.id)}
                      className="p-2 text-[#6e6e6e] hover:text-red-500 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {reviews.length === 0 && <div className="bg-white border border-[#ececec] py-16 text-center text-xs text-[#9e9e9e]">No product reviews found.</div>}
        </div>
      )}
    </div>
  );
}
