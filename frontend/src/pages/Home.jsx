import { useState, useEffect } from "react";
import { getBooks, createBook, updateBook } from "../api/bookApi";
import BookForm from "../components/BookForm";
import BookList from "../components/BookList";

// Membuat Function Home
function Home() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    stock: "",
  });
  const [editingId, setEditingId] = useState(null); // null = mode tambah

  const fetchBooks = async () => {
    const response = await getBooks();
    setBooks(response.data);
  };

  useEffect(() => {
    (async () => {
      const response = await getBooks();
      setBooks(response.data);
    })();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditClick = (book) => {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      price: book.price,
      stock: book.stock,
    });
  };

  const resetForm = () => {
    setForm({ title: "", author: "", price: "", stock: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateBook(editingId, form);
        alert("Buku berhasil diperbarui!");
      } else {
        await createBook(form);
        alert("Buku baru berhasil ditambahkan!");
      }
      resetForm();
      await fetchBooks();
    } catch (error) {
      alert(error.response?.data?.message || "Terjadi kesalahan pada sistem.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Bookstore</h1>
      <p>Total Buku: {books.length}</p>

      <BookForm
        book={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        buttonText={editingId ? "Simpan Perubahan" : "Tambah Buku"}
      />

      <hr />
      <h2>Daftar Koleksi</h2>
      <BookList books={books} onEdit={handleEditClick} />
    </div>
  );
}

export default Home;
