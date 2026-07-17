import { useState } from "react";
import { Bell, ShoppingBag, Store, RotateCcw, TrendingUp, Package } from "lucide-react";
import { ADMIN_NOTIFICATIONS } from "./adminData";

const typeIcon = (t: string) => {
  if (t === "order")   return <ShoppingBag size={13} strokeWidth={1.5} className="text-blue-600" />;
  if (t === "seller")  return <Store       size={13} strokeWidth={1.5} className="text-purple-600" />;
  if (t === "return")  return <RotateCcw   size={13} strokeWidth={1.5} className="text-red-500" />;
  if (t === "payment") return <TrendingUp  size={13} strokeWidth={1.5} className="text-green-600" />;
  if (t === "product") return <Package     size={13} strokeWidth={1.5} className="text-amber-500" />;
  return <Bell size={13} strokeWidth={1.5} className="text-[#d4145a]" />;
};
const typeBg = (t: string) => {
  if (t === "order")   return "bg-blue-50";
  if (t === "seller")  return "bg-purple-50";
  if (t === "return")  return "bg-red-50";
  if (t === "payment") return "bg-green-50";
  if (t === "product") return "bg-amber-50";
  return "bg-[#fce8ef]";
};

export default function AdminNotifications() {
  const [notifs, setNotifs] = useState(ADMIN_NOTIFICATIONS.map(n => ({ ...n })));
  const [tab, setTab] = useState<"all" | "unread">("all");

  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markOne = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const displayed = tab === "unread" ? notifs.filter(n => !n.read) : notifs;
  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Admin</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Notifications</h2>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAll} className="text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline font-semibold">Mark All Read</button>
        )}
      </div>

      <div className="flex gap-1 mb-5 bg-white border border-[#ececec] p-1 w-fit">
        {(["all", "unread"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 text-[10px] tracking-[0.12em] uppercase font-semibold transition-colors ${tab === t ? "bg-[#d4145a] text-white" : "text-[#6e6e6e] hover:text-[#1a1a1a]"}`}>
            {t === "all" ? `All (${notifs.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {displayed.map(n => (
          <div key={n.id} onClick={() => markOne(n.id)} className={`flex items-start gap-4 p-4 border border-[#ececec] cursor-pointer transition-colors ${!n.read ? "bg-[#fdf5f8] border-l-2 border-l-[#d4145a]" : "bg-white hover:bg-[#faf7f4]"}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${typeBg(n.type)}`}>{typeIcon(n.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-semibold ${!n.read ? "text-[#1a1a1a]" : "text-[#6e6e6e]"}`}>{n.title}</p>
                <span className="text-[9px] text-[#9e9e9e] flex-shrink-0">{n.time}</span>
              </div>
              <p className="text-xs text-[#9e9e9e] font-light mt-0.5">{n.body}</p>
            </div>
            {!n.read && <span className="w-2 h-2 bg-[#d4145a] rounded-full flex-shrink-0 mt-1.5" />}
          </div>
        ))}
        {displayed.length === 0 && (
          <div className="bg-white border border-[#ececec] py-16 text-center">
            <Bell size={32} strokeWidth={1} className="text-[#ececec] mx-auto mb-3" />
            <p className="text-xs text-[#9e9e9e]">No unread notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
}
