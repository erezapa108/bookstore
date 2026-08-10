function BookList({ books, onEdit, onDelete, isLoading, hasError, onRetry, searchTerm, onResetSearch }) {

  if (isLoading) {
    return (
      <p style={{ textAlign: "center", color: "#3D3A34", paddin: "40px 0" }}>
        Memuat data buku...
      </p>
    )
  }

  if (hasError) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "#3D3A34" }}>
        <p style={{ fontSize: "40px", margin: "0" }}>⚠</p>
        <p style={{ fontWeight: "600", margin: "8px 0 4px" }}>
          Gagal memuat data buku
        </p>
        <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 16px" }}>
          Periksa koneksi internet anda, atau coba lagi.
        </p>
        <button
          onClick={onRetry}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2F6F5E",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (books.length === 0) {
    if (searchTerm) {
      return (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#3D3A34" }}>
          <p style={{ fontSize: "40px", margin: 0 }}>🔍</p>
          <p style={{ fontWeight: 600, margin: "8px 0 4px" }}>
            Tidak ada hasil untuk "{searchTerm}"
          </p>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 16px" }}>
            Coba kata kunci lain, atau lihat semua buku.
          </p>
          <button
            onClick={onResetSearch}
            style={{
              padding: "8px 16px",
              backgroundColor: "#2F6F5E",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Hapus Pencarian
          </button>
        </div>
      );
    }

    // Skenario 2: database memang belum ada buku sama sekali
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "#3D3A34" }}>
        <p style={{ fontSize: "40px", margin: 0 }}>📚</p>
        <p style={{ fontWeight: 600, margin: "8px 0 4px" }}>Belum ada buku</p>
        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          Tambahkan buku pertama Anda lewat form di atas.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "20px",
      }}
    >
      {books.map((book) => (
        <div
          key={book.id}
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 1px 4px rgba(61,58,52,0.1)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ height: "6px", backgroundColor: "#2F6F5E" }} />
          {/* Area cover buku.
              Sekarang: selalu tampil placeholder karena book.cover belum ada.
              Nanti: begitu field book.cover (URL gambar) tersedia dari backend,
              tinggal ganti isi div ini jadi <img src={book.cover} ... />
              tanpa perlu ubah bagian card lain sama sekali. */}
          <div
            style={{
              width: "100%",
              aspectRatio: "3 / 4", // rasio umum sampul buku (potret)
              backgroundColor: "#e8e4d8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "40px" }}>📖</span>
          </div>

          <div
            style={{
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            <h3
              style={{ margin: "0 0 8px", fontSize: "17px", color: "#3D3A34" }}
            >
              {book.title}
            </h3>
            <p
              style={{ margin: "0 0 4px", fontSize: "14px", color: "#6b7280" }}
            >
              {book.author}
            </p>

            <div style={{ marginTop: "auto", paddingTop: "12px" }}>
              <p
                style={{
                  margin: "0 0 2px",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#3D3A34",
                }}
              >
                Rp {Number(book.price).toLocaleString("id-ID")}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: book.stock > 0 ? "#2F6F5E" : "#C1533E",
                }}
              >
                Stok: {book.stock}
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
              <button
                onClick={() => onEdit(book)}
                style={{
                  flex: 1,
                  padding: "8px",
                  backgroundColor: "#8FAE9C",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(book.id)}
                style={{
                  flex: 1,
                  padding: "8px",
                  backgroundColor: "#C1533E",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BookList;
