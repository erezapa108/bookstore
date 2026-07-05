import { useState, useEffect } from "react";
import { getBooks, createBook } from "../api/bookApi";
import BookList from "../components/BookList";

// membuat halaman utama Home.jsx
function Home() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // PERBAIKAN 2: Fungsi fetch data dimasukkan ke dalam useEffect agar lolos sensor ESLint
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks();
        setBooks(response.data);
      } catch (error) {
        console.error("Gagal memuat buku:", error);
      }
    };

    fetchBooks();
  }, []); // Array kosong memastikan fungsi hanya berjalan 1 kali saat halaman dibuka

  // Fungsi untuk menangani tambah buku baru
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await createBook({ title, author, price, stock });
      alert("Buku baru berhasil ditambahkan!");
      setTitle("");
      setAuthor("");
      setPrice("");
      setStock(""); // Reset form

      // Mengambil ulang data buku terbaru setelah berhasil menambah data
      const response = await getBooks();
      setBooks(response.data);
    } catch (error) {
    // PERBAIKAN: Menampilkan pesan error asli yang dikirim oleh backend Axios Anda
    alert(error.response?.data?.message || "Terjadi kesalahan pada sistem.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Bookstore</h1>
      <p>Total Buku: {books.length}</p>

      {/* Form Tambah Buku Mandiri */}
      <form
        onSubmit={handleAddBook}
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "6px",
          marginBottom: "30px",
          maxWidth: "400px",
        }}
      >
        <h3>Tambah Buku Baru</h3>
        <input
          type="text"
          placeholder="Judul Buku"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <br />
        <input
          type="text"
          placeholder="Penulis"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <br />
        <input
          type="number"
          placeholder="Harga"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <br />
        <input
          type="number"
          placeholder="Stok"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "15px", padding: "8px" }}
        />
        <br />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Tambah Buku
        </button>
      </form>

      <hr />
      <h2>Daftar Koleksi</h2>
      <BookList books={books} />
    </div>
  );
}

export default Home;
