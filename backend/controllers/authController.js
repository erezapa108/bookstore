const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

/* REGISTER ACCOUNT */

const register = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Nama, email, dan password wajib diisi" });
    }
    // mengidentifikasi atau cek apakah email sudah terdaftar
    userModel.findUserByEmail(email, (error, results) => {
        if (error) return res.status(500).json({ message: error.message });
        if (results.length > 0) {
            return res.status(400).json({ message: "Email sudah terdaftar" });
        }

        // Hash password sebelum disimpan -- tidak pernah simpan password asli
        bcrypt.hash(password, 10, (hashError, password_hash) => {
            if (hashError) return res.status(500).json({ message: hashError.message });
            /* "role" sengaja di hardcore "user"
            untuk mencegah siapapun mendaftar sebagai admin melalui endpoint publik. */
            userModel.createUser({ name, email, password_hash, role: "user" }, (createError) => {
                if (createError) return res.status(500).json({ message: createError.message });
                return res.status(201).json({ message: "Registrasi Berhasil" });
            });
        });
    });
};

/* LOGIN ACCOUNT */
const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email dan password wajib di isi"});
    }

    userModel.findUserByEmail(email, (error, results) => {
        if (error) return res.status(500).json({ message: error.message });
        if (results.length === 0) {
            /* Pesan sengaja generik bukan "email tidak ditemukan"
            Jika pesannya berbeda, user bisa menebak email yang terdaftar
            hanya dengan mencoba login berulang kali */
            return res.status(401).json({ message: "Email atau password salah"});
        }
        const user = results[0];

        bcrypt.compare(password, user.password_hash, (compareError, isMatch) => {
            if (compareError) return res.status(500).json({ message: compareError.message });
            if (!isMatch) {
                return res.status(401).json({ message: "Email atau password salah" }); // pesan sama seperti di atas
            }
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "8h" }
            );

            return res.status(200).json({
                message: "Login berhasil",
                token,
                user: { id: user.id, name: user.name, email: user.email, role: user.role },
            });
        });
    });
};

const getMe = (req, res) => {
    try {
        const userData = req.user; // req.user sudah diisi oleh middleware verifyToken

        return res.status(200).json({ 
            success: true,
            user: userData,
         });
    } catch (error) {
        return res.status(500).json({message: "Terjadi kesalahan saat mengambil data user", error: error.message});
    }
}

module.exports = {register, login, getMe };