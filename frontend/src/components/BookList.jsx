function BookList({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return <p>Tidak ada data buku.</p>;
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
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
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
              style={{ margin: "0 0 8px", fontSize: "17px", color: "#111827" }}
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
                  color: "#111827",
                }}
              >
                Rp {Number(book.price).toLocaleString("id-ID")}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: book.stock > 0 ? "#16a34a" : "#dc2626",
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
                  backgroundColor: "#A5AF79",
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
                  backgroundColor: "#dc2626",
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
