import { useState, useEffect } from "react";
import { getBooks, createBook, updateBook, deleteBook } from "../api/bookApi";
import BookForm from "../components/BookForm";
import BookList from "../components/BookList";

// Membuat Function Home
function Home() {
  const [books, setBooks] = useState([]);

  // editingBook menyimpan objek buku yang sedang di edit.
  // - null                 -> mode "Tambah buku"
  // - { id, ... }          -> mode "Edit/Simpan Perubahan"
  // Home tidak perlu tahu detail input form satu-satu,
  // cukup buku mana yang sedang di edit
  const [editingBook, setEditingBook] = useState(null);

  const fetchBooks = async () => {
    const response = await getBooks();
    setBooks(response.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch data saat mount, aman karena setState di dalam fetchBooks terjadi setelah await
    fetchBooks();
  }, []);

  // Dipanggil saat tombol "Edit Buku" BookList ditekan
  // Home cukup simpan buku yang dipilih ke editingBook
  // Pengisian input form akan ditangani oleh useEffect
  // Karena editingBook dikirim sebagai prop ke sana
  const handleEditClick = (book) => {
    setEditingBook(book);
  };

  // Dipanggil BookForm saat form di-submit.
  // formData = data terbaru dari input (dikirim balik lewat prop onSubmit).
  const handleFormSubmit = async (formData) => {
    try {
      if (editingBook !== null) {
        // Mode edit -> PUT ke backend pakai id buku yang sedang di edit
        await updateBook(editingBook.id, formData);
        alert("Buku Berhasil Diperbarui")
      } else {
        // Mode tambah -> POST buku baru
        await createBook(formData);
        alert("Buku Berhasil Ditambahkan")
      }
      // reset mode edit karena editing jadi null
      // useEffect di BookForm otomatis mengosongkan formnya
      // dan tombol otomatis kembali menjadi tambah buku
      setEditingBook(null);
      await fetchBooks(); //refresh data buku dari backend
    }
    catch(error) {
      alert(error.response?.data?.message || "Terjadi kesalahan pada sistem.")
    }
  };

  const handleDelete = async (id) => {
    // konfirmasi dulu karena aksi ini tidak dapat dibatalkan
    const confirmDelete = window.confirm("Apakah anda yakin ingin menghapus buku ini?");
    if (!confirmDelete) return;

    try {
      await deleteBook(id);
      await fetchBooks();

      // jika buku yang sedang diedit ternyata yang dihapus,
      // form harus direset agar tidak submit ke id yang sudah tidak ada
      if (editingBook !== null && editingBook.id === id) {
        setEditingBook(null);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menghapus buku");
    };
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Bookstore</h1>
      <p>Total Buku: {books.length}</p>

      {/* editingBook dikirim sebagai prop supaya BookForm tahu:
          1) data apa yang harus mengisi input (lewat useEffect di BookForm)
          2) teks tombol apa yang harus ditampilkan */}
      <BookForm editingBook={editingBook} onSubmit={handleFormSubmit} />

      <hr />
      <h2>Daftar Koleksi</h2>
      <BookList books={books} onEdit={handleEditClick} onDelete={handleDelete} />
    </div>
  );
}

export default Home;
