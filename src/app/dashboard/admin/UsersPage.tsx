import { useState, useEffect } from "react";
import { Search, Ban, CheckCircle, RefreshCw, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { adminService } from "../../services/admin.service";
import { extractErrorMessage } from "../../utils/errorExtractor";
import { toast } from "sonner";

const ROLE_OPTIONS = [
  { label: "All Roles", value: "" },
  { label: "Customers", value: "3" },
  { label: "Sellers", value: "2" },
  { label: "Admins", value: "1" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, limit };
      if (search.trim()) params.search = search.trim();
      if (roleFilter) params.role = roleFilter;

      const response: any = await adminService.getUsers(params);
      const rawData = response.data || response;

      const itemsList = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];

      const pagination = rawData?.pagination || response?.pagination;
      const total = pagination?.total ?? itemsList.length;
      const pages = pagination?.totalPages ?? Math.max(1, Math.ceil(total / limit));

      setUsers(itemsList);
      setTotalUsers(total);
      setTotalPages(pages);
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
  }, [search, roleFilter, page]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleRoleChange = (val: string) => {
    setRoleFilter(val);
    setPage(1);
  };

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

  const getRoleBadge = (roleId: number | string) => {
    const rid = Number(roleId);
    if (rid === 1) return <span className="text-[9px] tracking-[0.08em] uppercase px-2 py-0.5 font-semibold bg-purple-50 text-purple-700">Admin</span>;
    if (rid === 2) return <span className="text-[9px] tracking-[0.08em] uppercase px-2 py-0.5 font-semibold bg-blue-50 text-blue-700">Seller</span>;
    return <span className="text-[9px] tracking-[0.08em] uppercase px-2 py-0.5 font-semibold bg-gray-100 text-gray-700">Customer</span>;
  };

  return (
    <div>
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4145a] font-semibold">Manage</span>
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#1a1a1a] mt-1">Users</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Role Filter */}
          <div className="relative w-full sm:w-44">
            <select
              value={roleFilter}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full border border-[#ececec] px-3 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#d4145a] bg-white cursor-pointer"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9e9e9e]" />
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search users by name or email…"
              className="w-full border border-[#ececec] pl-8 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#d4145a] bg-white"
            />
          </div>
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
        <div className="space-y-4">
          <div className="bg-white border border-[#ececec] overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[#ececec]">
                  {["User", "Role", "Email", "Phone", "Joined", "Status", "Actions"].map((h) => (
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
                      <td className="px-4 py-3 text-xs">{getRoleBadge(u.role_id)}</td>
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

            {users.length === 0 && (
              <div className="py-12 text-center text-xs text-[#9e9e9e]">
                No users matching filter criteria found.
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-[#ececec] px-4 py-3">
              <p className="text-xs text-[#6e6e6e]">
                Showing <span className="font-semibold text-[#1a1a1a]">{users.length}</span> of <span className="font-semibold text-[#1a1a1a]">{totalUsers}</span> users
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 border border-[#ececec] text-[#1a1a1a] disabled:opacity-30 hover:border-[#d4145a] transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs text-[#6e6e6e] font-medium px-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 border border-[#ececec] text-[#1a1a1a] disabled:opacity-30 hover:border-[#d4145a] transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
