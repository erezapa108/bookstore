import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        backgroundColor: "#827148",
        color: "white",
        marginBottom: "20px",
      }}
    >
      {/* Logo / Judul Aplikasi */}
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          📚 Bookstore App
        </Link>
      </div>

      {/* Menu Navigasi */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link
          to="/"
          style={{ color: "white", textDecoration: "none", fontSize: "16px" }}
        >
          Home
        </Link>
        <Link
          to="/about"
          style={{ color: "white", textDecoration: "none", fontSize: "16px" }}
        >
          About
        </Link>
        <Link
          to="/login"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "16px",
            backgroundColor: "#A5AF79",
            padding: "1px 10px",
            borderRadius: "4px",
          }}
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
