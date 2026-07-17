import { useState } from "react";
import { Star, Edit2, Trash2, ThumbsUp } from "lucide-react";
import { MOCK_REVIEWS, type Review } from "./dashboardData";

export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", body: "", rating: 5 });

  const startEdit = (r: Review) => {
    setEditing(r.id);
    setEditForm({ title: r.title, body: r.body, rating: r.rating });
  };

  const saveEdit = () => {
    setReviews(prev => prev.map(r => r.id === editing ? { ...r, ...editForm } : r));
    setEditing(null);
  };

  const deleteReview = (id: string) => setReviews(prev => prev.filter(r => r.id !== id));

  return (
    <div>
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Feedback</span>
        <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">My Reviews</h2>
        <p className="text-sm text-[#6e6e6e] font-light mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""} written</p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white border border-[#ececec] p-16 text-center">
          <Star size={48} className="text-[#ececec] mx-auto mb-4" strokeWidth={1} />
          <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a]">No reviews yet</p>
          <p className="text-sm text-[#6e6e6e] font-light mt-1">Share your experience with products you've purchased.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="bg-white border border-[#ececec] p-6">
              {editing === r.id ? (
                <div className="space-y-4">
                  <div className="flex gap-4 items-start pb-4 border-b border-[#ececec]">
                    <img src={r.productImg} alt={r.product} className="w-14 h-16 object-cover bg-[#faf7f4] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-[#1a1a1a]">{r.product}</p>
                      <p className="text-[10px] text-[#6e6e6e] tracking-wide mt-0.5">{r.date}</p>
                    </div>
                  </div>
                  {/* Rating */}
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Your Rating</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setEditForm(f => ({ ...f, rating: s }))}
                          className="transition-colors">
                          <Star size={20} className={s <= editForm.rating ? "fill-[#d4145a] text-[#d4145a]" : "text-[#ececec]"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Review Title</label>
                    <input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full border border-[#ececec] px-4 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-[#6e6e6e] mb-2">Review</label>
                    <textarea value={editForm.body} onChange={e => setEditForm(f => ({ ...f, body: e.target.value }))} rows={3}
                      className="w-full border border-[#ececec] px-4 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white resize-none" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={saveEdit} className="px-6 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] transition-colors">Save</button>
                    <button onClick={() => setEditing(null)} className="px-6 py-2.5 border border-[#ececec] text-[#6e6e6e] text-[10px] tracking-[0.2em] uppercase hover:border-[#d4145a] hover:text-[#d4145a] transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex gap-4 items-start mb-4 pb-4 border-b border-[#ececec]">
                    <img src={r.productImg} alt={r.product} className="w-14 h-16 object-cover bg-[#faf7f4] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1a1a1a]">{r.product}</p>
                      <p className="text-[10px] text-[#6e6e6e] tracking-wide mt-0.5">{r.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(r)} className="text-[#6e6e6e] hover:text-[#d4145a] transition-colors"><Edit2 size={15} /></button>
                      <button onClick={() => deleteReview(r.id)} className="text-[#6e6e6e] hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[1,2,3,4,5].map(s => <Star key={s} size={13} className={s <= r.rating ? "fill-[#d4145a] text-[#d4145a]" : "text-[#ececec]"} />)}
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a1a] mb-1">{r.title}</p>
                  <p className="text-sm text-[#6e6e6e] font-light leading-relaxed">{r.body}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <ThumbsUp size={12} className="text-[#9e9e9e]" />
                    <span className="text-[10px] text-[#9e9e9e] tracking-wide">{r.helpful} people found this helpful</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
