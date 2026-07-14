import { useState, useEffect, useRef } from "react";
import { getBooks, createBook, updateBook, deleteBook } from "../api/bookApi";
import BookForm from "../components/BookForm";
import BookList from "../components/BookList";
import Toast from "../components/Toast";

// Membuat Function Home
function Home() {
  const [books, setBooks] = useState([]);

  // editingBook menyimpan objek buku yang sedang di edit.
  // - null                 -> mode "Tambah buku"
  // - { id, ... }          -> mode "Edit/Simpan Perubahan"
  // Home tidak perlu tahu detail input form satu-satu,
  // cukup buku mana yang sedang di edit
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);
  const [formResetKey, setFormResetKey] = useState(0);

  // ref menunjuk ke halaman DOM pembungkus form, digunakan untuk scroll manual
  const formRef = useRef(null);

  // State baru untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // jumlah data per halaman, bisa dibuat dinamis nanti kalau perlu

  const fetchBooks = async (page = currentPage, search = searchTerm) => {
    const response = await getBooks(page, limit, search);
    setBooks(response.data.data);
    setCurrentPage(response.data.pagination.page);
    setTotalPages(response.data.pagination.totalPages);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch data saat mount, aman karena setState di dalam fetchBooks terjadi setelah await
    fetchBooks(1, "");
  }, []);

  // useEffect BARU: setiap searchTerm berubah, fetch ulang ke backend,
  // dan RESET ke halaman 1 -- karena hasil pencarian belum tentu sebanyak data asli,
  // kalau tetap di halaman 3 misalnya, bisa jadi halaman itu sudah tidak ada lagi
  // untuk hasil pencarian yang baru.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkronisasi hasil pencarian dari backend setiap searchTerm berubah
    fetchBooks(1, searchTerm);
  }, [searchTerm]);

  // Dipanggil saat tombol "Edit Buku" BookList ditekan
  // Home cukup simpan buku yang dipilih ke editingBook
  // Pengisian input form akan ditangani oleh useEffect
  // Karena editingBook dikirim sebagai prop ke sana
  const handleEditClick = (book) => {
    setEditingBook(book);

    // Scroll halaman ke posisi form, dengan animasi halus.
    // Ini aksi langsung (imperative), dijalankan sekali saat user klik,
    // BUKAN lewat useEffect -- karena ini bukan soal "sinkronisasi state",
    // tapi respons satu kali terhadap satu event klik.
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Dipanggil BookForm saat form di-submit.
  // formData = data terbaru dari input (dikirim balik lewat prop onSubmit).
  const handleFormSubmit = async (formData) => {
    try {
      if (editingBook !== null) {
        // Mode edit -> PUT ke backend pakai id buku yang sedang di edit
        await updateBook(editingBook.id, formData);
        setToast({ message: "Buku berhasil diperbarui.", type: "success" });
      } else {
        // Mode tambah -> POST buku baru
        await createBook(formData);
        setToast({ message: "Buku berhasil ditambahkan.", type: "success" });
      }
      // reset mode edit karena editing jadi null
      // useEffect di BookForm otomatis mengosongkan formnya
      // dan tombol otomatis kembali menjadi tambah buku
      setEditingBook(null);
      setFormResetKey((prev) => prev + 1);
      await fetchBooks(currentPage); //refresh data buku dari backend
    } catch (error) {
      setToast({
        message:
          error.response?.data?.message || "Terjadi kesalahan pada sistem",
        type: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    // konfirmasi dulu karena aksi ini tidak dapat dibatalkan
    const confirmDelete = window.confirm(
      "Apakah anda yakin ingin menghapus buku ini?",
    );
    if (!confirmDelete) return;

    try {
      await deleteBook(id);
      await fetchBooks(currentPage);
      setToast({ message: "Buku berhasil dihapus.", type: "success" });

      // jika buku yang sedang diedit ternyata yang dihapus,
      // form harus direset agar tidak submit ke id yang sudah tidak ada
      if (editingBook !== null && editingBook.id === id) {
        setEditingBook(null);
      }
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Gagal menghapus buku",
        type: "error",
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchBooks(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchBooks(currentPage - 1);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#2F6F5E" }}>Bookstore Admin</h1>
      <p style={{ color: "#3D3A34" }}>Total Buku: {books.length}</p>

      {/* editingBook dikirim sebagai prop supaya BookForm tahu:
          1) data apa yang harus mengisi input (lewat useEffect di BookForm)
          2) teks tombol apa yang harus ditampilkan */}
      <BookForm
        editingBook={editingBook}
        resetKey={formResetKey}
        onSubmit={handleFormSubmit}
      />

      <hr style={{ border: "none", borderTop: "1px solid #DDD6C4" }} />
      <h2 style={{ color: "#3D3A34" }}>Daftar Koleksi</h2>

      <input
        type="text"
        placeholder="Cari judul buku atau penulis..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "16px",
          boxSizing: "border-box",
          borderRadius: "6px",
          border: "1px solid #DDD6C4",
          backgroundColor: "#FBFAF6",
        }}
      />

      <BookList
        books={books}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />

      {/* Kontrol pagination, taruh di bawah BookList */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid #DDD6C4",
            backgroundColor: currentPage <= 1 ? "#f0f0f0" : "white",
            cursor: currentPage <= 1 ? "not-allowed" : "pointer",
          }}
        >
          ← Sebelumnya
        </button>

        <span style={{ fontSize: "14px", color: "#3D3A34" }}>
          Halaman {currentPage} dari {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid #DDD6C4",
            backgroundColor: currentPage >= totalPages ? "#f0f0f0" : "white",
            cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
          }}
        >
          Selanjutnya →
        </button>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Home;
