import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextInstance";
import { getMe } from "../api/authApi";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, role } kalau sudah login, null kalau belum
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // true selagi cek token tersimpan

  // Saat aplikasi pertama kali dimuat (misal user refresh halaman),
  // cek apakah ada token tersimpan dan MASIH VALID sebelum menganggap user "belum login".
  useEffect(() => {
    const checkStoredToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const response = await getMe(token);
        setUser(response.data.user);
      } catch (error) {
        console.error("Gagal verifikasi token: ", error);
        // Token sudah tidak valid/kadaluarsa -- bersihkan supaya tidak dipakai lagi
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect -- cek token tersimpan saat aplikasi pertama dimuat
    checkStoredToken();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isCheckingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}