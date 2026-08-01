import { useState, useEffect } from "react";
import { ShoppingBag, TrendingUp, Package, Star, Bell, Trash2, RefreshCw } from "lucide-react";
import { notificationService } from "../../services/notification.service";

const typeIcon = (t?: string) => {
  const type = (t || "").toLowerCase();
  if (type === "order")   return <ShoppingBag size={14} strokeWidth={1.5} className="text-blue-600" />;
  if (type === "payment") return <TrendingUp  size={14} strokeWidth={1.5} className="text-green-600" />;
  if (type === "return")  return <Package     size={14} strokeWidth={1.5} className="text-red-500" />;
  if (type === "review")  return <Star        size={14} strokeWidth={1.5} className="text-amber-500" />;
  return <Bell size={14} strokeWidth={1.5} className="text-[#d4145a]" />;
};

const typeBg = (t?: string) => {
  const type = (t || "").toLowerCase();
  if (type === "order")   return "bg-blue-50";
  if (type === "payment") return "bg-green-50";
  if (type === "return")  return "bg-red-50";
  if (type === "review")  return "bg-amber-50";
  return "bg-[#fce8ef]";
};

export default function SellerNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"all" | "unread">("all");

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationService.getNotifications({ limit: 50 });
      const resData = (res?.data || res) as any;
      if (Array.isArray(resData)) {
        setNotifications(resData);
      } else if (resData && Array.isArray(resData.notifications)) {
        setNotifications(resData.notifications);
      } else if (resData && Array.isArray(resData.items)) {
        setNotifications(resData.items);
      } else {
        setNotifications([]);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load notifications.");
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
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1, read: true })));
    } catch (err: any) {
      alert(err?.message || "Failed to mark all notifications as read.");
    }
  };

  const handleMarkOneRead = async (n: any) => {
    if (n.is_read || n.read) return;
    try {
      await notificationService.markAsRead(n.id);
      setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, is_read: 1, read: true } : item));
    } catch {
      // quiet fail
    }
  };

  const handleDelete = async (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err: any) {
      alert(err?.message || "Failed to delete notification.");
    }
  };

  const displayed = tab === "unread" ? notifications.filter(n => !n.is_read && !n.read) : notifications;
  const unreadCount = notifications.filter(n => !n.is_read && !n.read).length;

  return (
    <div className="font-['Jost',sans-serif]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Transactional & System</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Notifications</h2>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline font-semibold">
            Mark All Read
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-xs mb-5 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchNotifications} className="flex items-center gap-1 text-[10px] tracking-[0.1em] uppercase font-semibold underline">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-5 bg-white border border-[#ececec] p-1 w-fit">
        {(["all", "unread"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-[10px] tracking-[0.12em] uppercase font-semibold transition-colors ${
              tab === t ? "bg-[#d4145a] text-white" : "text-[#6e6e6e] hover:text-[#1a1a1a]"
            }`}
          >
            {t === "all" ? `All (${notifications.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-white border border-[#ececec] animate-pulse" />
          ))
        ) : displayed.length > 0 ? (
          displayed.map(n => {
            const isRead = Boolean(n.is_read || n.read);
            const title = n.title || n.subject || "Seller Notification";
            const body = n.message || n.body || "";
            const notifType = n.type || n.category || "system";

            return (
              <div
                key={n.id}
                onClick={() => handleMarkOneRead(n)}
                className={`flex items-start gap-4 p-4 border border-[#ececec] cursor-pointer transition-colors ${!isRead ? "bg-[#fdf5f8] border-l-2 border-l-[#d4145a]" : "bg-white hover:bg-[#faf7f4]"}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${typeBg(notifType)}`}>
                  {typeIcon(notifType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${!isRead ? "text-[#1a1a1a]" : "text-[#6e6e6e]"}`}>{title}</p>
                    <span className="text-[9px] text-[#9e9e9e] tracking-wide flex-shrink-0">
                      {n.created_at ? new Date(n.created_at).toLocaleString() : n.time || "Recent"}
                    </span>
                  </div>
                  <p className="text-xs text-[#9e9e9e] font-light mt-0.5 line-clamp-2">{body}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {!isRead && <span className="w-2 h-2 bg-[#d4145a] rounded-full" />}
                  <button
                    onClick={(e) => handleDelete(n.id, e)}
                    className="p-1 text-[#9e9e9e] hover:text-red-500 transition-colors"
                    title="Delete Notification"
                  >
                    <Trash2 size={13} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white border border-[#ececec] py-16 text-center">
            <Bell size={32} strokeWidth={1} className="text-[#ececec] mx-auto mb-3" />
            <p className="text-xs text-[#9e9e9e] tracking-wide">No {tab === "unread" ? "unread" : ""} notifications found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
