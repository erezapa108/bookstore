function BookList({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return <p>Belum ada data buku.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      {books.map((book) => (
        <div
          key={book.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "6px",
          }}
        >
          <h3>{book.title}</h3>
          <p>Penulis: {book.author}</p>
          <p>Harga: Rp {book.price}</p>
          <p>Stok: {book.stock}</p>
          <button
            onClick={() => onEdit(book)}
            style={{
              backgroundColor: "#827148",
              color: "white",
            }}
          >
            Edit Buku
          </button>

          <button
            onClick={() => onDelete(book.id)}
            style={{ backgroundColor: "#827148", color: "white", marginLeft: "8px" }}
          >
            Hapus
          </button>
        </div>
      ))}
    </div>
  );
}

export default BookList;