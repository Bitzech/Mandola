import { useState, useEffect } from "react";
import { Search, Eye, Ban, CheckCircle, RefreshCw } from "lucide-react";
import { adminService } from "../../services/admin.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { limit: 50 };
      if (search.trim()) params.search = search.trim();
      const response: any = await adminService.getUsers(params);
      const rawData = response.data || response;
      const itemsList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];
      setUsers(itemsList);
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to fetch users list.");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleToggleStatus = async (userId: string | number, currentStatus: string) => {
    const nextStatus = currentStatus.toLowerCase() === "blocked" ? "active" : "blocked";
    setUpdatingId(userId);
    try {
      await adminService.updateUserStatus(userId, nextStatus);
      toast.success(`User status updated to ${nextStatus}.`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
      );
    } catch (err: any) {
      toast.error(extractErrorMessage(err, "Failed to update user status."));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Users</h2>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e9e9e]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email…"
            className="w-full border border-[#ececec] pl-8 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#d4145a] bg-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-[#ececec] p-12 text-center animate-pulse">
          <p className="text-xs text-[#9e9e9e] uppercase tracking-widest">Loading users data…</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-[#ececec] p-12 text-center">
          <p className="text-sm text-red-600 font-light mb-4">{error}</p>
          <button onClick={fetchUsers} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#d4145a] flex items-center gap-2 mx-auto">
            <RefreshCw size={13} /> Retry Loading
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#ececec] overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#ececec]">
                {["User", "Email", "Phone", "Joined", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.15em] uppercase text-[#9e9e9e] font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const fullName = `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.name || u.email || "Customer";
                const userStatus = (u.status || (u.is_blocked ? "blocked" : "active")).toLowerCase();
                const isBlocked = userStatus === "blocked";
                const isUpdating = updatingId === u.id;

                return (
                  <tr key={u.id} className="border-b border-[#ececec] hover:bg-[#faf7f4] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#fce8ef] text-[#d4145a] flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-medium text-[#1a1a1a]">{fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#6e6e6e]">{u.email || "—"}</td>
                    <td className="px-4 py-3 text-xs text-[#6e6e6e]">{u.phone || u.phone_number || "—"}</td>
                    <td className="px-4 py-3 text-xs text-[#6e6e6e]">{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] tracking-[0.08em] uppercase px-2 py-1 font-semibold ${isBlocked ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
                        {isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleStatus(u.id, userStatus)}
                          disabled={isUpdating}
                          className={`p-1.5 transition-colors ${isBlocked ? "text-[#6e6e6e] hover:text-green-600" : "text-[#6e6e6e] hover:text-amber-500"}`}
                          title={isBlocked ? "Unblock User" : "Block User"}
                        >
                          {isUpdating ? <RefreshCw size={13} className="animate-spin" /> : isBlocked ? <CheckCircle size={13} strokeWidth={1.5} /> : <Ban size={13} strokeWidth={1.5} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {users.length === 0 && <div className="py-12 text-center text-xs text-[#9e9e9e]">No users matching filter criteria found.</div>}
        </div>
      )}
    </div>
  );
}
