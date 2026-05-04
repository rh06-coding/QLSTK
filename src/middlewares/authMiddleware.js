const jwt = require("jsonwebtoken");
const HttpError = require("../utils/HttpError");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new HttpError(401, "Không có token xác thực"));
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return next(new Error("JWT_SECRET is not configured"));
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new HttpError(401, "Token đã hết hạn"));
    }
    return next(new HttpError(401, "Token không hợp lệ"));
  }
}

function checkRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new HttpError(401, "Yêu cầu xác thực"));
    }

    if (!allowedRoles.includes(req.user.TenVaiTro)) {
      return next(new HttpError(403, "Bạn không có quyền truy cập chức năng này"));
    }

    next();
  };
}

module.exports = { verifyToken, checkRole };
