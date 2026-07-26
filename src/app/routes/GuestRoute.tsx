import { Navigate, Outlet } from "react-router";
import { useAuth, getRoleFromId } from "../context/AuthContext";
import { STORAGE_KEYS } from "../constants/storageKeys";

export function getDashboardPathForRole(roleId?: number | string | null, roleName?: string | null): string {
  const rId = Number(roleId);
  const rStr = roleName ? String(roleName).toLowerCase() : "";

  if (rId === 1 || rStr === "admin") {
    return "/admin";
  }
  if (rId === 2 || rStr === "seller") {
    return "/seller";
  }
  return "/customer";
}

export default function GuestRoute() {
  const { isAuthenticated, user, roleId, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#d4145a] border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#9e9e9e]">Loading</p>
        </div>
      </div>
    );
  }

  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const isUserLogged = isAuthenticated || Boolean(user?.id) || Boolean(token);

  if (isUserLogged) {
    const activeRoleId = roleId || user?.role_id || 3;
    const activeRole = role || user?.role || getRoleFromId(activeRoleId);
    const targetPath = getDashboardPathForRole(activeRoleId, activeRole);
    return <Navigate to={targetPath} replace />;
  }

  return <Outlet />;
}
