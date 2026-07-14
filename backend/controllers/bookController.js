// PERBAIKAN: Memanggil bookModel dengan require (CommonJS) yang benar
const bookModel = require("../models/bookModel");

// GET ALL BOOKS
const getAllBooks = (req, res) => {
  // Ambil page & limit dari query URL, contoh: /api/books?page=2&limit=10
  // Kalau tidak dikirim sama sekali, default ke page 1, limit 10.
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || ""; // default string kosong kalau tidak dikirim

  // Guard rail: cegah page/limit bernilai aneh (negatif, 0, atau kelewat besar)
  if (page < 1) page = 1;
  if (limit < 1) limit = 15;
  if (limit > 100) limit = 30; // batas atas, supaya tidak ada yang minta 1 juta baris sekaligus

  // Hitung total dulu, baru ambil datanya -- 2 query terpisah tapi berurutan,
  // karena totalPages baru bisa dihitung setelah tahu total data
  bookModel.countAllBooks(search, (countError, countResults) => {
    if (countError)
      return res.status(500).json({ message: countError.message });

    const total = countResults[0].total;
    const totalPages = Math.ceil(total / limit);

    bookModel.findAllBooks(page, limit, search, (error, results) => {
      if (error) return res.status(500).json({ message: error.message });

      return res.status(200).json({
        data: results,
        pagination: { page, limit, total, totalPages },
      });
    });
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