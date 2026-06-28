const db = require("../config/db");

const findAllBooks = (callback) => {
    const query = "SELECT * FROM books";

    db.query(query, callback);
};

// Ambil buku berdasarkan ID
const findBookById = (id, callback) => {
    const query = "SELECT * FROM books WHERE id = ?";

    db.query(query, [id], callback);
};

// Tambah buku
const createBook = (bookData, callback) => {
    const { title, author, price, stock } = bookData;

    const query = `
    INSERT INTO books
    (title, author, price, stock)
    VALUES(?, ?, ?, ?)
    `;

    db.query(
        query,
        [title, author, price, stock],
        callback
    );
};

module.exports = {
    findAllBooks,
    findBookById,
    createBook
};