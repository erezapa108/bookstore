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

    // cek price: harus ada dan berupa angka, dan harus lebih dari 0
    if (price === undefined || price === null || isNaN(price) || Number(price) <= 0) {
        return res.status(400).json({
            message: "Harga wajib diisi dengan angka lebih dari 0!",
        });
    }

    // cek stock: harus ada dan harus berupa angka, dan tidak boleh negatif
    if (stock === undefined || stock === null || isNaN(stock) || Number(stock) < 0) {
        return res.status(400).json({
            message: "Stock wajib diisi dengan angka, dan tidak boleh negatif",
        })
    }

    next();
};

module.exports = validateBook;