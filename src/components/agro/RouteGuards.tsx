import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Role, useAuth } from "@/context/AuthContext";

export function RequireAuth({ allow }: { allow?: Role[] }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  if (allow && !allow.includes(user.role)) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
  }
  return <Outlet />;
}

export function RedirectIfAuthed() {
  const { user } = useAuth();
  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
  return <Outlet />;
}