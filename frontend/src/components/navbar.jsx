import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 30px",
        backgroundColor: "#F5F1E8",
        borderBottom: "1px solid #DDD6C4",
        marginBottom: "24px",
      }}
    >
      <div style={{ fontSize: "19px", fontWeight: 700, color: "#2F6F5E" }}>
        <Link to="/" style={{ color: "#2F6F5E", textDecoration: "none" }}>
          📚 Bookstore
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
        
        <Link
          to="/about"
          style={{ color: "#3D3A34", textDecoration: "none", fontSize: "15px" }}
        >
          About
        </Link>

        {user ? (
          // Sudah login -- tampilkan info singkat + tombol Logout
          <>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>
              {user.role === "admin" ? "Admin" : "User"}
            </span>
            <button
              onClick={handleLogout}
              style={{
                color: "white",
                backgroundColor: "#C1533E",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          // Belum login -- tampilkan tombol Login seperti sebelumnya
          <Link
            to="/login"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "14px",
              backgroundColor: "#2F6F5E",
              padding: "8px 16px",
              borderRadius: "6px",
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
