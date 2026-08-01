import { Navigate, Outlet } from "react-router";
import { useAuth, Role } from "../context/AuthContext";

interface Props {
  role: Role;
}

export default function RoleRoute({ role }: Props) {
  const { user, role: userRole, isAuthenticated, loading } = useAuth();

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

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace />;
  }

  const currentRole = userRole || user?.role;

  if (currentRole !== role) {
    if (currentRole === "admin") return <Navigate to="/admin" replace />;
    if (currentRole === "seller") return <Navigate to="/seller" replace />;
    if (currentRole === "customer") return <Navigate to="/customer" replace />;
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
