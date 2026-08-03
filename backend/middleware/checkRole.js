const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
      // req.user hanya ada jika verifyToken sudah jalan di route
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Anda tidak memiliki akses untuk aksi ini."});
      }
      next();
    };   
};

module.exports = checkRole;