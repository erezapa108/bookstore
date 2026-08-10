import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000, // 10 detik — kalau backend tidak respons, request gagal, bukan menggantung selamanya
});

// Otomatis pasang token ke setiap request, tidak perlu manual lagi
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Kalau backend bilang token invalid/expired, bersihkan sesi dan
// beri tahu AuthContext lewat custom event (lihat AuthContext di bawah)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  },
);

export const registerUser = (userData) => {
  return api.post("/auth/register", userData);
};

export const loginUser = (credentials) => {
  return api.post("/auth/login", credentials);
};

export const getMe = () => {
  return api.get("/auth/me"); // token sudah otomatis dipasang interceptor
};

export default api; // dipakai fitur lain (books, cart, dll) yang butuh auth
