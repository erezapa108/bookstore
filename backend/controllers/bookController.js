// PERBAIKAN: Memanggil bookModel dengan require (CommonJS) yang benar
const bookModel = require("../models/bookModel");

// GET ALL BOOKS
const getAllBooks = (req, res) => {
  bookModel.findAllBooks((error, results) => {
    if (error) return res.status(500).json({ message: error.message });
    return res.status(200).json(results);
  });
};

// GET BOOK BY ID
const getBookById = (req, res) => {
  const { id } = req.params;
  bookModel.findBookById(id, (error, results) => {
    if (error) return res.status(500).json({ message: error.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    return res.status(200).json(results);
  });
};

// CREATE BOOK
const createBook = (req, res) => {
    // PERBAIKAN: Ubah bookModel.createBook menjadi bookModel.addBook sesuai nama di model Anda
    bookModel.addBook(req.body, (error, results) => {
        if (error) return res.status(500).json({ message: error.message });
        return res.status(201).json({ message: "Buku berhasil ditambahkan" });
    });
};


// UPDATE BOOK
const updateBook = (req, res) => {
  const { id } = req.params;
  bookModel.updateBook(id, req.body, (error, results) => {
    if (error) return res.status(500).json({ message: error.message });
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    return res.status(200).json({ message: "Buku berhasil diperbarui" });
  });
};

// DELETE BOOK
const deleteBook = (req, res) => {
  const { id } = req.params;
  bookModel.deleteBook(id, (error, results) => {
    if (error) return res.status(500).json({ message: error.message });
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    return res.status(200).json({ message: "Buku berhasil dihapus" });
  });
};

// EKSPOR COMMONJS
module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};