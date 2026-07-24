import { useNavigate } from "react-router";
import DashboardPage from "../dashboard/DashboardPage";
import { useAuth } from "../context/AuthContext";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <DashboardPage
      onLogout={() => { logout(); navigate("/"); }}
    />
  );
}
