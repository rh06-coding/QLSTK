const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Không có token xác thực" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });
  }
}

function checkRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Yêu cầu xác thực" });
    }

    if (!allowedRoles.includes(req.user.TenVaiTro)) {
      return res.status(403).json({ success: false, message: "Bạn không có quyền truy cập chức năng này" });
    }

    next();
  };
}

module.exports = { verifyToken, checkRole };
