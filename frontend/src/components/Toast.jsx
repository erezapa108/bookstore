import { useEffect } from "react";

// Memberi warna berbeda pada alert
const typeStyles = {
    success: { backgroundColor: "#16a34a" },
    error: { backgroundColor: "#dc2626" }
};

function Toast({ message, type = "success", onClose }) {
  // Memberikan timer menutup toast otomatis selama 3 detik
  // menyinkronkan komponen dengan API browser (setTimeout),
  // bukan menghitung ulang state dari state lain seperti kasus filteredBooks dulu.
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    // cleanup: kalau toast di-unmount lebih cepat (misal muncul toast baru
    // sebelum 3 detik habis), timer lama dibatalkan supaya tidak nutup toast yang salah
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
    style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        padding: "12px 20px",
        borderRadius: "8px",
        color: "white",
        fontSize: "14px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        zIndex: "1000",
        ...typeStyles[type],
    }}
    >
        {message}
    </div>
  );
}

export default Toast