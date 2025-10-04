import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authUser";

export default function ProtectedRoute() {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}
