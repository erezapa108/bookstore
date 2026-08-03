import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";



function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmiting(true);

    try {
      const response = await loginUser({ email, password });
      const { token, user } = response.data;

      login(token, user);

      // Redirect sesuai role
      if (user.role === "admin") {
        navigate("/"); // Home khusus admin
      } else {
        navigate("/shop"); // user akan diarahkan ke halaman belanja
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login gagal, coba lagi");
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <div style={{ maxWidth: "360px", margin: "40px auto", padding: "24px" }}>
      <h1 style={{ color: "#2f6f5e" }}>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            boxSizing: "border-box",
            borderRadius: "6px",
            border: "1px solid #ddd6c4",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            boxSizing: "border-box",
            borderRadius: "6px",
            border: "1px solid #ddd6c4",
          }}
        />

        {error && <p style={{ color: "#c1533e", fontSize: "14px"}}>{error}</p>}

        <button
          type="submit"
          disabled={isSubmiting}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            boxSizing: "border-box",
            borderRadius: "6px",
            border: "1px solid #ddd6c4"
          }}
        >
          {isSubmiting ? "Memproses..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;