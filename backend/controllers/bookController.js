const db = require("../config/db");

const getAllBooks = (req, res) => {
    const query = "SELECT * FROM books";

    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
        res.status(200).json(results);
    });
};

// GET BOOK BY ID
const getBookById = (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM books WHERE id = ?";

    db.query(query, [id], (error, results) => {
        if(error) {
            return res.status(500).json({
                message: error.message,
            });
        }

        if(results.length === 0) {
            return res.status(404).json({
                message: "Maaf, Buku tidak ditemukan",
            });
        }

        res.status(200).json(results[0]);
    });
};

// CREATE BOOK
const createBook = (req, res) => {
    const { title, author, price, stock } = req.body;
    const query = "INSERT INTO books (title, author, price, stock) VALUES (?, ?, ?, ?)";

    db.query(query, [title, author, price, stock], (error, results) => {
        if (error) {
            return res.status(500).json({
                message: error.message,
            });
        }

        res.status(200).json({
            message: "Buku berhasil ditambahkan"
        });
    });
};

// UPDATE BOOKS
const updateBook = (req, res) => {
    const { id } = req.params;
    const { title, author, price, stock } = req.body;

    const query = `
    UPDATE books
    SET title = ?, author = ?, price = ?, stock = ?
    WHERE id = ?
    `;

    db.query(query, [title, author, price, stock, id], (error, results) => {
        if(error) {
            return res.status(500).json({
                message: error.status,
            });
        }

        res.status(200).json({
            message: "Buku berhasil diperbarui"
        });
    });
};

// DELETE BOOKS
const deleteBook = (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM books WHERE id = ?";

    db.query(query, [id], (error, results) => {
        if(error) {
            return res.status(500).json({
                message: error.message
            });
        }

        res.status(200).json({
            message: "Buku telah berhasil dihapus"
        });
    });
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};