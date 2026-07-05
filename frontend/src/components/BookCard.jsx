import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "10px",
      }}
    >
      <h3>{book.title}</h3>
      <p>Penulis: {book.author}</p>
      <p>Harga: Rp {book.price}</p>
      <p>Stok: {book.stock}</p>

      <Link
        to={`/edit-book/${book.id}`}
        style={{
          padding: "5px 10px",
          backgroundColor: "#007bff",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
        }}
      >
        Edit Buku
      </Link>
    </div>
  );
};

export default BookCard;