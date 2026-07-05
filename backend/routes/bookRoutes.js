const express = require("express");
const router = express.Router();

// PERBAIKAN MUTLAK: Ubah menjadi "middleware" (tanpa huruf s) agar sesuai folder Anda
const validateBook = require("../middleware/validateBook");

const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", validateBook, createBook);
router.put("/:id", validateBook, updateBook);
router.delete("/:id", deleteBook);

module.exports = router;