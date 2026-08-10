import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/navbar";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ScrollToTopButton from "./components/ScrollToTopButton";
import AdminHome from "./components/RootRedirect";
import { useAuth } from "./hooks/useAuth";

function AuthRootRedirect() {
  const { user, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return <p style={{ textAlign: "center", padding: "40px" }}>Memuat...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user.role === "admin" ? "/admin" : "/shop"} replace />;
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<AuthRootRedirect />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/shop"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <Shop />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ScrollToTopButton />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
