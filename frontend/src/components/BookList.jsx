function BookList({ books, onEdit }) {
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
              display: "inline-block",
              marginTop: "10px",
              padding: "6px 12px",
              backgroundColor: "#827148",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            Edit Buku
          </button>
        </div>
      ))}
    </div>
  );
}

export default BookList;