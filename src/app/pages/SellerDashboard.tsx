import { useNavigate } from "react-router";
import SellerDashboardPage from "../dashboard/seller/SellerDashboardPage";
import { useAuth } from "../context/AuthContext";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <SellerDashboardPage
      onLogout={() => { logout(); navigate("/"); }}
    />
  );
}
