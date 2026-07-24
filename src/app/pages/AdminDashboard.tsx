import { useNavigate } from "react-router";
import AdminDashboardPage from "../dashboard/admin/AdminDashboardPage";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <AdminDashboardPage
      onLogout={() => { logout(); navigate("/"); }}
    />
  );
}
