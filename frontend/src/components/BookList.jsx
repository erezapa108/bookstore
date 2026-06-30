// Membuat komponen Book List
function BookList({ books }) {
    if (books.length === 0) {
        return (
            <p>Belum ada data buku.</p>
        ); //kalau tidak ada daftar buku
    }

    // Jika ada data
    return (
        <div>
            { 
            books.map((book) => (
                <div
                key={book.id}
                style={{
                    border: "1px solid #ccc",
                    padding: "16px",
                    marginBottom: "12px"
                }}
                >
                    <h2>{book.title}</h2>

                    <p>
                        Penulis : 
                        {" "}
                        {book.author}
                    </p>

                    <p>
                        Harga : 
                        {" "}
                        Rp{book.price}
                    </p>
                </div>
            ))
             }
        </div>
    );
}

export default BookList;