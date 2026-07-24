import { useNavigate } from "react-router";
import AuthPage from "../components/AuthPage";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <AuthPage
      onBack={() => {
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate("/");
        }
      }}
    />
  );
}
