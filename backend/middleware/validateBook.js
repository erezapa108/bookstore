const validateBook = (req, res, next) => {
    const {
        title,
        author,
        price,
        stock
    } = req.body;

    if (!title) {
        return res.status(400).json({
            message: "Title tidak boleh kosong",
        });
    }

    if (!author) {
        return res.status(400).json({
            message: "Nama author wajib diisi",
        });
    }

    if (price <= 0) {
        return res.status(400).json({
            message: "Harga tidak boleh kurang dari 0",
        });
    }

    if (stock < 0) {
        return res.status(400).json({
            message: "Jumlah stock tidak boleh negatif",
        });
    }

    next();
};

module.exports = validateBook;