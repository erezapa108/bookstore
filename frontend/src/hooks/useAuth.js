import { useContext } from "react";
import { AuthContext } from "../context/AuthContextInstance"; // Sesuaikan path ke file context Anda

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam komponen AuthProvider");
  }
  return context;
}
