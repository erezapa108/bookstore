import { useState, useEffect } from "react";

function ScrollToTopButton() {
  // Menentukan apakah tombol harus terlihat atau tidak
  const [visible, setVisible] = useState(false);

  // Ini KEBALIKAN dari kasus filteredBooks yang kita bahas dulu --
  // di sini useEffect memang tempat yang TEPAT, karena tujuannya
  // menyinkronkan komponen React dengan "sistem eksternal":
  // event scroll dari browser, bukan derived state dari state lain.
  useEffect(() => {
    const handleScroll = () => {
      // munculkan tombol kalau user sudah scroll lebih dari 300px
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    // cleanup: WAJIB dilepas saat komponen unmount.
    // Kalau tidak, setiap kali komponen ini dipasang ulang (misal pindah
    // halaman lalu balik lagi), listener lama menumpuk terus tanpa
    // pernah dibersihkan -- inilah salah satu bentuk memory leak paling umum di React.
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // dependency kosong: listener cukup dipasang sekali saat komponen pertama muncul

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Kalau belum perlu terlihat, jangan render apa pun sama sekali
  // (bukan cuma disembunyikan lewat CSS display:none, tapi memang tidak ada di DOM)
  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Kembali ke atas"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        backgroundColor: "#2F6F5E",
        color: "white",
        border: "none",
        fontSize: "20px",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(61,58,52,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      ↑
    </button>
  );
}

export default ScrollToTopButton;
