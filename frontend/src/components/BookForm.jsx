import { useState, useEffect } from "react";

const emptyForm = { title: "", author: "", price: "", stock: "" };

// Style dipisah jadi object di luar komponen supaya tidak dibuat ulang
// setiap kali komponen re-render (sedikit lebih efisien, dan lebih rapi dibaca).
const styles = {
  input: {
    width: "100%",
    padding: "10px 12px",
    boxSizing: "border-box",
    border: "1px solid #DDD6C4",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#FBFAF6",
    color: "#3D3A34",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#3D3A34",
  },
  field: {
    marginBottom: "16px",
  },
};

function BookForm({ editingBook, resetKey,onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const isEditing = editingBook !== null; // dipakai berkali-kali, jadi disimpan sebagai variabel

  useEffect(() => {
    if (editingBook !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sinkronisasi form dengan prop editingBook
      setForm({
        title: editingBook.title,
        author: editingBook.author,
        price: editingBook.price,
        stock: editingBook.stock,
      });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset form saat mode tambah / setelah submit
      setForm(emptyForm);
    }
  }, [editingBook, resetKey]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    // Card pembungkus form.
    // borderColor berubah sesuai mode: abu-abu netral (tambah) vs oranye (edit),
    // supaya user sadar sedang dalam mode edit hanya dari melihat form-nya saja.
    <div
      style={{
        maxWidth: "420px",
        margin: "0 auto 24px",
        padding: "24px",
        borderRadius: "12px",
        border: `1px solid ${isEditing ? "#F0A868" : "#DDD6C4"}`,
        backgroundColor: isEditing ? "#FDF3E7" : "#ffffff",
        boxShadow: "0 1px 3px rgba(61,58,52,0.08)",
        transition: "background-color 0.2s ease, border-color 0.2s ease",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "18px", color: "#3D3A34" }}>
        {isEditing ? "Ubah Data Buku" : "Tambah Buku Baru"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label style={styles.label}>Judul Buku</label>
          <input
            type="text"
            name="title"
            placeholder="Masukkan judul buku"
            value={form.title}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Penulis</label>
          <input
            type="text"
            name="author"
            placeholder="Masukkan nama penulis"
            value={form.author}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Harga</label>
          <input
            type="number"
            name="price"
            placeholder="Masukkan harga buku"
            value={form.price}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={{ ...styles.field, marginBottom: "20px" }}>
          <label style={styles.label}>Stok</label>
          <input
            type="number"
            name="stock"
            placeholder="Masukkan jumlah stok"
            value={form.stock}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        {/* Warna tombol ikut berubah sesuai mode, senada dengan border card di atas */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: isEditing ? "#F0A868" : "#2F6F5E",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {isEditing ? "Simpan Perubahan" : "Tambah Buku"}
        </button>
      </form>
    </div>
  );
}

export default BookForm;
