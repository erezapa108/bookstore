import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookById, updateBook } from "../api/bookApi"; // Mengambil fungsi Axios Anda
import BookForm from "../components/BookForm";

const EditBook = () => {
  // 1. Ambil ID buku dari URL
  const { id } = useParams();
  const navigate = useNavigate();

  // 2. State untuk menampung data form input
  const [book, setBook] = useState({
    title: "",
    author: "",
    price: "",
    stock: "",
  });

  const [loading, setLoading] = useState(true);

  // 3. Ambil data lama buku saat halaman pertama dimuat
  useEffect(() => {
    const loadBook = async () => {
      try {
        const response = await getBookById(id);
        const data = response.data; // Axios otomatis membungkus data di properti .data

        // Antisipasi jika backend mengembalikan bentuk array atau objek langsung
        const bookData = Array.isArray(data) ? data[0] : data;

        setBook({
          title: bookData.title || "",
          author: bookData.author || "",
          price: bookData.price || "",
          stock: bookData.stock || "",
        });
        setLoading(false);
      } catch (err) {
        // Menangkap pesan error dari response backend Axios
        alert(err.response?.data?.message || "Gagal memuat data buku");
        navigate("/");
      }
    };

    loadBook();
  }, [id, navigate]);

  // 4. Tangani perubahan ketikan di form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({
      ...book,
      [name]: value,
    });
  };

  // 5. Tangani submit form untuk update data ke database via backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateBook(id, book);
      alert(response.data.message || "Buku berhasil diperbarui");
      navigate("/"); // Redirect kembali ke halaman utama jika sukses
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memperbarui data buku");
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Memuat data buku...</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto", padding: "0 15px" }}>
      <h2>Edit Detail Buku</h2>
      {/* Memanggil komponen form reusable */}
      <BookForm
        book={book}
        onChange={handleChange}
        onSubmit={handleSubmit}
        buttonText="Simpan Perubahan"
      />
    </div>
  );
};

// WAJIB DITAMBAHKAN AGAR ERROR DEFAULT EXPORT DI APP.JSX HILANG
export default EditBook;
