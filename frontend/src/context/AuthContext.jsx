import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextInstance";
import { getMe } from "../api/authApi";

function safeParseUser() {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Data user di localStorage rusak, membersihkan sesi:", error);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(safeParseUser);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkStoredToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const response = await getMe();
        const userData = response.data.user;
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      } catch (error) {
        console.error("Gagal verifikasi token: ", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkStoredToken();

    // Dengarkan sinyal dari interceptor axios saat token invalid/expired
    const handleUnauthorized = () => setUser(null);
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("whislistIds");
    setUser(null);
  };

  const updateProfile = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateProfile, isCheckingAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}
