import { useState, useEffect } from "react";
import { Star, Edit2, Trash2, ThumbsUp, RefreshCw } from "lucide-react";
import { reviewService } from "../services/review.service";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../utils/errorExtractor";
import { toast } from "sonner";

export default function MyReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editForm, setEditForm] = useState({ title: "", body: "", rating: 5 });
  const [saving, setSaving] = useState(false);

  const fetchMyReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await reviewService.getMyReviews({ user_id: user?.id });
      const resData = response?.data || response;
      const itemsList = Array.isArray(resData)
        ? resData
        : Array.isArray(resData?.items)
        ? resData.items
        : Array.isArray(resData?.data)
        ? resData.data
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
    fetchMyReviews();
  }, []);

  const startEdit = (r: any) => {
    const revId = r.id || r.review_id;
    setEditingId(revId);
    setEditForm({
      title: r.title || r.review_title || "",
      body: r.body || r.comment || r.review_text || "",
      rating: r.rating || 5,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      await reviewService.updateReview(editingId, {
        rating: editForm.rating,
        title: editForm.title,
        comment: editForm.body,
        review_text: editForm.body,
      });

      toast.success("Review updated successfully!");
      setEditingId(null);
      fetchMyReviews();
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to update review."));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReview = async (id: string | number) => {
    try {
      await reviewService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => (r.id || r.review_id) !== id));
      toast.success("Review deleted.");
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to delete review."));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Feedback</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">My Reviews</h2>
        <p className="text-sm text-[#6e6e6e] font-light mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""} written</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white border border-[#ececec] p-6 h-40 bg-slate-50" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-16 text-center">
          <p className="text-sm text-red-600 font-light mb-4">{error}</p>
          <button onClick={fetchMyReviews} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry Loading
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white border border-[#ececec] p-16 text-center">
          <Star size={48} className="text-[#ececec] mx-auto mb-4" strokeWidth={1} />
          <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a]">No reviews yet</p>
          <p className="text-sm text-[#6e6e6e] font-light mt-1">Share your experience with products you've purchased.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => {
            const revId = r.id || r.review_id;
            const productName = r.product_name || r.product || "Product Item";
            const productImg = r.product_image || r.thumbnail || r.productImg || "https://images.unsplash.com/photo-1652473291442-7a2e034a00d1?w=100&h=120&fit=crop";
            const revDate = r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : r.date || "Recently";
            const ratingVal = r.rating || 5;
            const titleVal = r.title || r.review_title || "";
            const bodyVal = r.comment || r.body || r.review_text || "";
            const helpfulCount = r.helpful_count || r.helpful || 0;

            const isEditingThis = editingId === revId;

            return (
              <div key={revId} className="bg-white border border-[#ececec] p-6">
                {isEditingThis ? (
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start pb-4 border-b border-[#ececec]">
                      <img src={productImg} alt={productName} className="w-14 h-16 object-cover bg-[#faf7f4] flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-[#1a1a1a]">{productName}</p>
                        <p className="text-[10px] text-[#6e6e6e] tracking-wide mt-0.5">{revDate}</p>
                      </div>
                    </div>
                    {/* Rating */}
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Your Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button key={s} type="button" onClick={() => setEditForm((f) => ({ ...f, rating: s }))} className="transition-colors">
                            <Star size={20} className={s <= editForm.rating ? "fill-[#d4145a] text-[#d4145a]" : "text-[#ececec]"} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Review Title</label>
                      <input value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} className="w-full border border-[#ececec] px-4 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Review</label>
                      <textarea value={editForm.body} onChange={(e) => setEditForm((f) => ({ ...f, body: e.target.value }))} rows={3} className="w-full border border-[#ececec] px-4 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white resize-none" />
                    </div>
                    <div className="flex gap-3">
                      <button disabled={saving} onClick={saveEdit} className="px-6 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors disabled:opacity-50 flex items-center gap-2">
                        {saving ? <RefreshCw size={12} className="animate-spin" /> : null} Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-6 py-2.5 border border-[#ececec] text-[#6e6e6e] text-[10px] tracking-[0.2em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-4 items-start mb-4 pb-4 border-b border-[#ececec]">
                      <img src={productImg} alt={productName} className="w-14 h-16 object-cover bg-[#faf7f4] flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#1a1a1a]">{productName}</p>
                        <p className="text-[10px] text-[#6e6e6e] tracking-wide mt-0.5">{revDate}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(r)} className="text-[#6e6e6e] hover:text-[#d4145a] transition-colors"><Edit2 size={15} /></button>
                        <button onClick={() => handleDeleteReview(revId)} className="text-[#6e6e6e] hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={13} className={s <= ratingVal ? "fill-[#d4145a] text-[#d4145a]" : "text-[#ececec]"} />)}
                    </div>
                    {titleVal && <p className="text-sm font-semibold text-[#1a1a1a] mb-1">{titleVal}</p>}
                    <p className="text-sm text-[#6e6e6e] font-light leading-relaxed">{bodyVal}</p>
                    {helpfulCount > 0 && (
                      <div className="flex items-center gap-2 mt-3">
                        <ThumbsUp size={12} className="text-[#9e9e9e]" />
                        <span className="text-[10px] text-[#9e9e9e] tracking-wide">{helpfulCount} people found this helpful</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
