const express = require("express");
const router = express.Router();

// PERBAIKAN MUTLAK: Ubah menjadi "middleware" (tanpa huruf s) agar sesuai folder Anda
const validateBook = require("../middleware/validateBook");
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");

const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", verifyToken, checkRole("admin"), validateBook, createBook);
router.put("/:id", verifyToken, checkRole("admin"), validateBook, updateBook);
router.delete("/:id", verifyToken, checkRole("admin"), deleteBook);

module.exports = router;