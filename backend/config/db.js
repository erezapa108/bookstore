require("dotenv").config();

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((error) => {
  if (error) {
    console.log(
      "Database gagal terhubung ke server",
      error.code,
      "-",
      error.message,
    );
    return;
  }

  console.log("Database berhasil terhubung ke server");
});

module.exports = db;
