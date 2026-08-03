const  jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      console.log("DEBUG - authHeader:", authHeader); // sementara
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    const token = authHeader.split(" ")[1]; // ambil bagian setelah bearer

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            // kondisi gagal: token kadaluarsa, atau tidak valid
            if (error.name === "TokenExpiredError") {
                console.log("DEBUG - Token kadaluarsa:", error); // sementara
                return res.status(401).json({ message: "Token kadaluarsa" });
            }
            return res.status(401).json({ message: "Token tidak valid" });
        }

        // decoded berisi payload
        req.user = decoded;
        next();
    })
}

module.exports = verifyToken;
