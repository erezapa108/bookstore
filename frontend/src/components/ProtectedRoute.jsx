import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// allowedRoles kosong/undefined = cukup login, role apa saja boleh masuk
function ProtectedRoute({ allowedRoles, children }) {
  const { user, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return <p style={{ textAlign: "center", padding: "40px" }}>Memuat...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Login tapi role tidak diizinkan -> lempar ke halaman sesuai role-nya
    return <Navigate to={user.role === "admin" ? "/" : "/shop"} replace />;
  }

  return children ?? <Outlet />;
}

export default ProtectedRoute;
