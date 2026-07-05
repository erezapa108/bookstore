const db = require("../config/db");

// Ambil semua buku dari database
const findAllBooks = (callback) => {
    const query = "SELECT * FROM books";

    db.query(query, callback);
};

// Cari buku berdasarkan ID
const findBookById = (id, callback) => {
    const query = "SELECT * FROM books WHERE id = ?";

    db.query(query, [id], callback);
};

// Tambah buku baru ke database
// PERBAIKAN: Pastikan parameter pertama bernama bookData agar bisa dibaca oleh kode di dalamnya
const addBook = (bookData, callback) => {
    const { title, author, price, stock } = bookData;
    
    const query = "INSERT INTO books (title, author, price, stock) VALUES (?, ?, ?, ?)";
    
    db.query(query, [title, author, price, stock], callback);
};

const updateBook = (id, bookData, callback) => {
  const { title, author, price, stock } = bookData;

  // PERBAIKAN: Memastikan tanda koma diletakkan dengan benar di antara kolom
  const query = `
        UPDATE books
        SET title = ?, author = ?, price = ?, stock = ?
        WHERE id = ?
    `;

  db.query(query, [title, author, price, stock, id], callback);
};

module.exports = {
    findAllBooks,
    findBookById,
    addBook,
    updateBook
}