// Mengimport hook useState dari React
import { useState } from "react";

// hook useEffect
import { useEffect } from "react";

// import function get Book
import { getBooks } from "../api/bookApi";

// import BookList
import BookList from "../components/BookList";

// import BookForm
import BookForm from "../components/BookForm";

// Membuat komponen Home
function Home() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        getBooks()

        .then((response) => {
            setBooks(response.data);
        })

        .catch((error) => {
            console.error(error);
        });
    }, []);

    return (
        <div>
            <h1>Bookstore</h1>

            <p>Total Buku : {books.length}</p>

            <BookForm />

            <BookList books={books} />
        </div>
    );
}

export default Home;