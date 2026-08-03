const db = require("../config/db");

const findUserByEmail = (email, callback) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], callback);
};

const createUser = (userData, callback) => {
    const { name, email, password_hash, role } = userData;
    const query = "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)";
    db.query(query, [name, email, password_hash, role], callback);
};

module.exports = {
    findUserByEmail,
    createUser,
}