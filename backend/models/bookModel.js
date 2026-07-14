const db = require("../config/db");

// Ambil semua buku dari database
const findAllBooks = (page, limit, search, callback) => {
  const offset = (page - 1) * limit;

  if (search) {
    const query =
      "SELECT * FROM books WHERE title LIKE ? OR author LIKE ? LIMIT ? OFFSET ?";
    const keyword = `%${search}%`;
    db.query(query, [keyword, keyword, limit, offset], callback);
  } else {
    const query = "SELECT * FROM books LIMIT ? OFFSET ?";
    db.query(query, [limit, offset], callback);
  }
};

const countAllBooks = (search, callback) => {
  if (search) {
    const query =
      "SELECT COUNT(*) AS total FROM books WHERE title LIKE ? OR author LIKE ?";
    const keyword = `%${search}%`;
    db.query(query, [keyword, keyword], callback);
  } else {
    const query = "SELECT COUNT(*) AS total FROM books";
    db.query(query, callback);
  }
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

// Fitur delete book menggunakan struktur yang sama seperti UPDATE BOOK menggunakan parameterized query
const deleteBook = (id, callback) => {
    const query = "DELETE FROM books WHERE id = ?";
    db.query(query, [id], callback);
};

module.exports = {
    findAllBooks,
    countAllBooks, //menambahkan countAllBooks di module export
    findBookById,
    addBook,
    updateBook,
    deleteBook, //semula tidak ada deleteBook di dalam export, tambahkan deleteBook
}