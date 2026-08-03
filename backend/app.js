const express = require("express");
const cors = require("cors");

require("./config/db");

const bookRoutes = require("./routes/bookRoutes");

const authRoutes = require("./routes/authRoutes")


const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);
app.use(express.json());
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Backend Bookstore Sedang Berjalan");
});

module.exports = app;