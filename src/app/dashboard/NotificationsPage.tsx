import { useState, useEffect } from "react";
import { Bell, ShoppingBag, Tag, User, Heart, Trash2, Check, RefreshCw } from "lucide-react";
import { notificationService } from "../services/notification.service";
import { extractErrorMessage } from "../utils/errorExtractor";
import { toast } from "sonner";

const typeIcon = (type: string) => {
  const t = (type || "").toLowerCase();
  if (t.includes("order")) return <ShoppingBag size={16} strokeWidth={1.5} className="text-blue-600" />;
  if (t.includes("offer") || t.includes("promo")) return <Tag size={16} strokeWidth={1.5} className="text-[#d4145a]" />;
  if (t.includes("account") || t.includes("profile")) return <User size={16} strokeWidth={1.5} className="text-amber-600" />;
  return <Heart size={16} strokeWidth={1.5} className="text-emerald-600" />;
};

const typeBg = (type: string) => {
  const t = (type || "").toLowerCase();
  if (t.includes("order")) return "bg-blue-50";
  if (t.includes("offer") || t.includes("promo")) return "bg-[#fce8ef]";
  if (t.includes("account") || t.includes("profile")) return "bg-amber-50";
  return "bg-emerald-50";
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.getNotifications({ limit: 50 });
      const data = response.data || response.items || response;
      if (Array.isArray(data)) {
        setNotifications(data);
      } else {
        setNotifications([]);
      }
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to load notifications.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((x) => ({ ...x, is_read: true, read: true })));
      toast.success("All notifications marked as read.");
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to mark notifications as read."));
    }
  };

  const handleMarkRead = async (id: string | number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((x) => ((x.id || x.notification_id) === id ? { ...x, is_read: true, read: true } : x)));
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to mark notification as read."));
    }
  };

  const handleDeleteOne = async (id: string | number) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((x) => (x.id || x.notification_id) !== id));
      toast.success("Notification deleted.");
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to delete notification."));
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read && !n.read).length;

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Updates</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Notifications</h2>
          {unreadCount > 0 && <p className="text-sm text-[#6e6e6e] font-light mt-1">{unreadCount} unread notification{unreadCount > 1 ? "s" : ""}</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline transition-colors">
            <Check size={12} /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white border border-[#ececec] p-4 bg-slate-50" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-16 text-center">
          <p className="text-sm text-red-600 font-light mb-4">{error}</p>
          <button onClick={fetchNotifications} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry Loading
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white border border-[#ececec] p-16 text-center">
          <Bell size={48} className="text-[#ececec] mx-auto mb-4" strokeWidth={1} />
          <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a]">All caught up!</p>
          <p className="text-sm text-[#6e6e6e] font-light mt-1">No notifications at the moment.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const notifId = n.id || n.notification_id;
            const isRead = Boolean(n.is_read || n.read);
            const nType = n.type || n.category || "order";
            const title = n.title || n.subject || "System Notification";
            const message = n.message || n.body || n.content || "";
            const notifTime = n.created_at
              ? new Date(n.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
              : n.time || "Recently";

            return (
              <div
                key={notifId}
                className={`flex gap-4 p-4 border border-[#ececec] transition-colors ${isRead ? "bg-white" : "bg-[#fdf9f5] border-[#f0e8d8]"}`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center ${typeBg(nType)}`}>
                  {typeIcon(nType)}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium text-[#1a1a1a] ${!isRead ? "font-semibold" : ""}`}>{title}</p>
                    {!isRead && <span className="w-2 h-2 rounded-full bg-[#d4145a] flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-[#6e6e6e] font-light mt-0.5 leading-relaxed">{message}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[10px] text-[#9e9e9e] tracking-wide">{notifTime}</span>
                    {!isRead && (
                      <button onClick={() => handleMarkRead(notifId)} className="text-[10px] tracking-wide text-[#d4145a] hover:underline">
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
                {/* Delete */}
                <button onClick={() => handleDeleteOne(notifId)} className="flex-shrink-0 text-[#ececec] hover:text-[#d4145a] transition-colors mt-0.5">
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
