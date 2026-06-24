const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "ezapa",
    password: "Eza-pa10",
    database: "tokobuku_db"
});

connection.connect((error) => {
    if (error) {
        console.log("Database tidak terhubung ke server");
        return;
    }

    console.log("Database berhasil terhubung ke server");
});

module.exports = connection;