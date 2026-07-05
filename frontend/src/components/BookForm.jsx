const BookForm = ({ book, onChange, onSubmit, buttonText }) => {
  return (
    <form onSubmit={onSubmit}>

      {/* Judul form dinamis mengikuti teks tombol agar rapi */}
      <h3 style={{ marginBottom: "15px" }}>
        {buttonText === "Simpan Perubahan"
          ? "Ubah Data Buku"
          : "Tambah Buku Baru"}
      </h3>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Judul Buku:
        </label>
        <input
          type="text"
          name="title"
          placeholder="Masukkan Judul Buku"
          value={book?.title || ""}
          onChange={onChange}
          required
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Penulis:
        </label>
        <input
          type="text"
          name="author"
          placeholder="Masukkan nama penulis"
          value={book?.author || ""}
          onChange={onChange}
          required
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Harga Buku:
        </label>
        <input
          type="number"
          name="price"
          placeholder="Masukkan Harga Buku"
          value={book?.price || ""}
          onChange={onChange}
          required
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Stok:</label>
        <input
          type="number"
          name="stock"
          placeholder="Masukkan Jumlah Stok"
          value={book?.stock || ""}
          onChange={onChange}
          required
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
      </div>

      {/* Teks tombol ini akan berubah otomatis menjadi "Simpan Perubahan" */}
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {buttonText}
      </button>
    </form>
  );
};

export default BookForm;