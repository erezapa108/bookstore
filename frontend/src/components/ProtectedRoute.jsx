import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// allowedRoles: array role yang boleh akses router admin/user
function ProtectedRoute({ children, allowedRoles }) {
    const { user, isCheckingAuth } = useAuth();

    if (isCheckingAuth) {
        return <p style={{ textAlign: "center", padding: "40px" }}>Memuat...</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to={user.role === "admin" ? "/" : "/shop"} replace />;
    }

    return children;
}

export default ProtectedRoute;
