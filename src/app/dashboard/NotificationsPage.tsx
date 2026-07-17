import { useState } from "react";
import { Bell, ShoppingBag, Tag, User, Heart, Trash2, Check } from "lucide-react";
import { MOCK_NOTIFICATIONS, type Notification } from "./dashboardData";

const typeIcon = (type: Notification["type"]) => {
  if (type === "order")   return <ShoppingBag size={16} strokeWidth={1.5} className="text-blue-600" />;
  if (type === "offer")   return <Tag         size={16} strokeWidth={1.5} className="text-[#d4145a]" />;
  if (type === "account") return <User        size={16} strokeWidth={1.5} className="text-amber-600" />;
  return <Heart size={16} strokeWidth={1.5} className="text-emerald-600" />;
};

const typeBg = (type: Notification["type"]) => {
  if (type === "order")   return "bg-blue-50";
  if (type === "offer")   return "bg-[#fce8ef]";
  if (type === "account") return "bg-amber-50";
  return "bg-emerald-50";
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));
  const deleteOne = (id: string) => setNotifications(n => n.filter(x => x.id !== id));
  const markRead = (id: string) => setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Updates</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Notifications</h2>
          {unread > 0 && <p className="text-sm text-[#6e6e6e] font-light mt-1">{unread} unread notification{unread > 1 ? "s" : ""}</p>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline transition-colors">
            <Check size={12} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border border-[#ececec] p-16 text-center">
          <Bell size={48} className="text-[#ececec] mx-auto mb-4" strokeWidth={1} />
          <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a]">All caught up!</p>
          <p className="text-sm text-[#6e6e6e] font-light mt-1">No notifications at the moment.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`flex gap-4 p-4 border border-[#ececec] transition-colors ${n.read ? "bg-white" : "bg-[#fdf9f5] border-[#f0e8d8]"}`}
            >
              {/* Icon */}
              <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center ${typeBg(n.type)}`}>
                {typeIcon(n.type)}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-medium text-[#1a1a1a] ${!n.read ? "font-semibold" : ""}`}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-[#d4145a] flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-[#6e6e6e] font-light mt-0.5 leading-relaxed">{n.message}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[10px] text-[#9e9e9e] tracking-wide">{n.time}</span>
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} className="text-[10px] tracking-wide text-[#d4145a] hover:underline">
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
              {/* Delete */}
              <button onClick={() => deleteOne(n.id)} className="flex-shrink-0 text-[#ececec] hover:text-[#d4145a] transition-colors mt-0.5">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
