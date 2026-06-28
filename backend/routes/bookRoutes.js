const express = require("express");
const router = express.Router();

const validateBook = require(
    "../middleware/validateBook"
);

const {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
} = require("../controllers/bookController");

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post(
    "/",
    validateBook,
    createBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

module.exports = router;