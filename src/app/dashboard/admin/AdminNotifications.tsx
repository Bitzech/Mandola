import { useState, useEffect } from "react";
import { Bell, ShoppingBag, Store, RotateCcw, TrendingUp, Package, RefreshCw } from "lucide-react";
import { notificationService } from "../../services/notification.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";

const typeIcon = (t: string) => {
  const lower = (t || "").toLowerCase();
  if (lower.includes("order"))   return <ShoppingBag size={13} strokeWidth={1.5} className="text-blue-600" />;
  if (lower.includes("seller"))  return <Store       size={13} strokeWidth={1.5} className="text-purple-600" />;
  if (lower.includes("return"))  return <RotateCcw   size={13} strokeWidth={1.5} className="text-red-500" />;
  if (lower.includes("payment")) return <TrendingUp  size={13} strokeWidth={1.5} className="text-green-600" />;
  if (lower.includes("product")) return <Package     size={13} strokeWidth={1.5} className="text-amber-500" />;
  return <Bell size={13} strokeWidth={1.5} className="text-[#d4145a]" />;
};

const typeBg = (t: string) => {
  const lower = (t || "").toLowerCase();
  if (lower.includes("order"))   return "bg-blue-50";
  if (lower.includes("seller"))  return "bg-purple-50";
  if (lower.includes("return"))  return "bg-red-50";
  if (lower.includes("payment")) return "bg-green-50";
  if (lower.includes("product")) return "bg-amber-50";
  return "bg-[#fce8ef]";
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"all" | "unread">("all");

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await notificationService.getNotifications({ limit: 50 });
      const rawData = response.data || response;
      const itemsList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];
      setNotifications(itemsList);
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

  const markAll = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, read: true })));
      toast.success("All notifications marked as read.");
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to mark notifications as read."));
    }
  };

  const markOne = async (id: string | number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true, read: true } : n)));
    } catch {
      // Ignore individual read errors
    }
  };

  const unreadCount = notifications.filter((n) => !(n.is_read || n.read)).length;
  const displayed = tab === "unread" ? notifications.filter((n) => !(n.is_read || n.read)) : notifications;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Admin</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Notifications</h2>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAll} className="text-[10px] tracking-[0.15em] uppercase text-[#d4145a] hover:underline font-semibold">
            Mark All Read
          </button>
        )}
      </div>

      <div className="flex gap-1 mb-5 bg-white border border-[#ececec] p-1 w-fit">
        {(["all", "unread"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-[10px] tracking-[0.12em] uppercase font-semibold transition-colors ${tab === t ? "bg-[#d4145a] text-white" : "text-[#6e6e6e] hover:text-[#1a1a1a]"}`}
          >
            {t === "all" ? `All (${notifications.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white border border-[#ececec] p-12 text-center animate-pulse">
          <p className="text-xs text-[#9e9e9e] uppercase tracking-widest">Loading notifications…</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-12 text-center">
          <p className="text-sm text-red-600 font-light mb-4">{error}</p>
          <button onClick={fetchNotifications} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry Loading
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map((n) => {
            const isRead = Boolean(n.is_read || n.read);
            const notifType = n.notification_type || n.type || "general";
            const title = n.title || n.subject || "Notification";
            const message = n.message || n.body || "";
            const timeStr = n.created_at ? new Date(n.created_at).toLocaleDateString() : n.time || "Recently";

            return (
              <div
                key={n.id}
                onClick={() => markOne(n.id)}
                className={`flex items-start gap-4 p-4 border border-[#ececec] cursor-pointer transition-colors ${!isRead ? "bg-[#fdf5f8] border-l-2 border-l-[#d4145a]" : "bg-white hover:bg-[#faf7f4]"}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${typeBg(notifType)}`}>{typeIcon(notifType)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${!isRead ? "text-[#1a1a1a]" : "text-[#6e6e6e]"}`}>{title}</p>
                    <span className="text-[9px] text-[#9e9e9e] flex-shrink-0">{timeStr}</span>
                  </div>
                  <p className="text-xs text-[#9e9e9e] font-light mt-0.5">{message}</p>
                </div>
                {!isRead && <span className="w-2 h-2 bg-[#d4145a] rounded-full flex-shrink-0 mt-1.5" />}
              </div>
            );
          })}
          {displayed.length === 0 && (
            <div className="bg-white border border-[#ececec] py-16 text-center">
              <Bell size={32} strokeWidth={1} className="text-[#ececec] mx-auto mb-3" />
              <p className="text-xs text-[#9e9e9e]">No notifications found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
