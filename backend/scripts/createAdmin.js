require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../config/db")

const name = process.env.ADMIN_NAME;
const email = process.env.ADMIN_EMAIL;
const plainPassword = process.env.ADMIN_PASSWORD;

bcrypt.hash(plainPassword, 10, (error, hash) => {
    if (error) throw error;

    const query =
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')";
      db.query(query, [name, email, hash], (dbError, result) => {
        if (dbError) throw dbError;
        console.log("Admin berhasil dibuat dengan id", result.insertId);
        process.exit(0);
      });
});