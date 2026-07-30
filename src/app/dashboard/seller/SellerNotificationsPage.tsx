import { useState, useEffect } from "react";
import { ShoppingBag, TrendingUp, Package, Star, Bell, RefreshCw, Loader2 } from "lucide-react";
import { notificationService, NotificationItem } from "../../services/notification.service";
import { toast } from "sonner";

const typeIcon = (t: string) => {
  const typeStr = String(t || "").toLowerCase();
  if (typeStr.includes("order"))   return <ShoppingBag size={14} strokeWidth={1.5} className="text-blue-600" />;
  if (typeStr.includes("payment")) return <TrendingUp  size={14} strokeWidth={1.5} className="text-green-600" />;
  if (typeStr.includes("shipment") || typeStr.includes("return"))  return <Package size={14} strokeWidth={1.5} className="text-purple-600" />;
  if (typeStr.includes("review") || typeStr.includes("promo"))  return <Star size={14} strokeWidth={1.5} className="text-amber-500" />;
  return <Bell size={14} strokeWidth={1.5} className="text-[#d4145a]" />;
};

const typeBg = (t: string) => {
  const typeStr = String(t || "").toLowerCase();
  if (typeStr.includes("order"))   return "bg-blue-50";
  if (typeStr.includes("payment")) return "bg-green-50";
  if (typeStr.includes("shipment") || typeStr.includes("return"))  return "bg-purple-50";
  if (typeStr.includes("review") || typeStr.includes("promo"))  return "bg-amber-50";
  return "bg-[#fce8ef]";
};

export default function SellerNotificationsPage() {
  const [notifs, setNotifs] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "unread">("all");

  const fetchSellerNotifications = async () => {
    setLoading(true);
    try {
      const res: any = await notificationService.getNotifications({ limit: 50 });
      const rawData = res?.data || res;
      const itemsList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];
      setNotifs(itemsList);
    } catch (err) {
      console.error("[SellerNotificationsPage] Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerNotifications();
  }, []);

  const markAll = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifs(prev => prev.map(n => ({ ...n, is_read: 1 })));
      toast.success("All notifications marked as read.");
    } catch (err) {
      toast.error("Failed to mark notifications as read.");
    }
  };

  const markOne = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const displayed = tab === "unread" ? notifs.filter(n => !Boolean(n.is_read)) : notifs;
  const unreadCount = notifs.filter(n => !Boolean(n.is_read)).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Updates</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Notifications</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSellerNotifications}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#ececec] text-xs text-[#6e6e6e] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          {unreadCount > 0 && (
            <button onClick={markAll} className="text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline font-semibold">
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-white border border-[#ececec] p-1 w-fit">
        {(["all", "unread"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-[10px] tracking-[0.12em] uppercase font-semibold transition-colors ${
              tab === t ? "bg-[#d4145a] text-white" : "text-[#6e6e6e] hover:text-[#1a1a1a]"
            }`}
          >
            {t === "all" ? `All (${notifs.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white border border-[#ececec] py-20 flex flex-col items-center justify-center text-[#9e9e9e]">
          <Loader2 size={32} className="animate-spin text-[#d4145a] mb-3" />
          <p className="text-xs tracking-[0.2em] uppercase">Loading Notifications…</p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map(n => {
            const isRead = Boolean(n.is_read);
            const timeStr = n.created_at ? new Date(n.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Recently";
            const nType = n.notification_type || "system";

            return (
              <div
                key={n.id}
                onClick={() => !isRead && markOne(n.id)}
                className={`flex items-start gap-4 p-4 border border-[#ececec] cursor-pointer transition-colors ${!isRead ? "bg-[#fdf5f8] border-l-2 border-l-[#d4145a]" : "bg-white hover:bg-[#faf7f4]"}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${typeBg(nType)}`}>
                  {typeIcon(nType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${!isRead ? "text-[#1a1a1a]" : "text-[#6e6e6e]"}`}>{n.title}</p>
                    <span className="text-[9px] text-[#9e9e9e] tracking-wide flex-shrink-0">{timeStr}</span>
                  </div>
                  <p className="text-xs text-[#6e6e6e] font-light mt-0.5 leading-relaxed">{n.message}</p>
                </div>
                {!isRead && <span className="w-2 h-2 bg-[#d4145a] rounded-full flex-shrink-0 mt-1.5" />}
              </div>
            );
          })}
          {displayed.length === 0 && (
            <div className="bg-white border border-[#ececec] py-16 text-center">
              <Bell size={32} strokeWidth={1} className="text-[#ececec] mx-auto mb-3" />
              <p className="text-xs text-[#9e9e9e] tracking-wide">No unread notifications.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
