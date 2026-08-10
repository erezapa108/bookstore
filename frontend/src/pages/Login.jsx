import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmiting(true);

    try {
      const response = await loginUser({ email: email.trim(), password });
      const { token, user } = response.data;

      login(token, user);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/shop");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal, coba lagi");
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sesuai");
      return;
    }

    setIsSubmiting(true);

    try {
      const response = await registerUser({ name, email, password });
      setSuccess(response.data.message || "Registrasi berhasil");
      setMode("login");
      setName("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Registrasi gagal");
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <div style={{ maxWidth: "960px", margin: "24px auto", padding: "24px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          alignItems: "center",
          background: "linear-gradient(135deg, #F8F4EA 0%, #FFFFFF 100%)",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "0 16px 45px rgba(47, 111, 94, 0.12)",
        }}
      >
        <div>
          <p style={{ margin: 0, color: "#2F6F5E", fontWeight: 700 }}>Bookzone.id</p>
          <h1 style={{ margin: "8px 0", color: "#2F6F5E" }}>Mulai pengalaman membaca yang lebih nyaman</h1>
          <p style={{ color: "#3D3A34", lineHeight: 1.6 }}>
            Temukan buku favorit, simpan wishlist, dan nikmati belanja buku yang modern dan cepat.
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "24px",
            border: "1px solid #E8DFCC",
          }}
        >
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "999px",
                border: mode === "login" ? "1px solid #2F6F5E" : "1px solid #DDD6C4",
                background: mode === "login" ? "#2F6F5E" : "#fff",
                color: mode === "login" ? "#fff" : "#2F6F5E",
                cursor: "pointer",
              }}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
                setSuccess("");
              }}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "999px",
                border: mode === "register" ? "1px solid #2F6F5E" : "1px solid #DDD6C4",
                background: mode === "register" ? "#2F6F5E" : "#fff",
                color: mode === "register" ? "#fff" : "#2F6F5E",
                cursor: "pointer",
              }}
            >
              Daftar
            </button>
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit}>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
              {error && <p style={errorStyle}>{error}</p>}
              {success && <p style={successStyle}>{success}</p>}
              <button type="submit" disabled={isSubmiting} style={buttonStyle}>
                {isSubmiting ? "Memproses..." : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <input type="text" placeholder="Nama lengkap" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
              <input type="password" placeholder="Konfirmasi password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={inputStyle} />
              {error && <p style={errorStyle}>{error}</p>}
              {success && <p style={successStyle}>{success}</p>}
              <button type="submit" disabled={isSubmiting} style={buttonStyle}>
                {isSubmiting ? "Memproses..." : "Daftar"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: "12px",
  boxSizing: "border-box",
  borderRadius: "10px",
  border: "1px solid #DDD6C4",
  fontSize: "14px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "4px",
  boxSizing: "border-box",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#2F6F5E",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
};

const errorStyle = {
  color: "#C1533E",
  fontSize: "14px",
  marginBottom: "10px",
};

const successStyle = {
  color: "#2F6F5E",
  fontSize: "14px",
  marginBottom: "10px",
};

export default Login;
