const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sql, getPool } = require("../config/db");

const INVALID_CREDENTIALS_MESSAGE = "Sai tên đăng nhập hoặc mật khẩu";
const MISSING_CREDENTIALS_MESSAGE = "Vui lòng cung cấp đầy đủ username và password";

class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

function validateLoginPayload(body) {
  const { username, password } = body || {};

  if (!username || !password) {
    throw new HttpError(400, MISSING_CREDENTIALS_MESSAGE);
  }

  return { username, password };
}

async function findUserByUsername(username) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("username", sql.VarChar(50), username)
    .query(`
      SELECT
        nd.MaNguoiDung,
        nd.TenDangNhap,
        nd.MatKhau,
        nd.MaVaiTro,
        nd.MaKH,
        vt.TenVaiTro
      FROM NGUOI_DUNG nd
      LEFT JOIN VAI_TRO vt ON nd.MaVaiTro = vt.MaVaiTro
      WHERE nd.TenDangNhap = @username
    `);

  return result.recordset[0] || null;
}

async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

function buildTokenPayload(userRecord) {
  return {
    MaNguoiDung: userRecord.MaNguoiDung,
    MaVaiTro: userRecord.MaVaiTro,
    TenVaiTro: userRecord.TenVaiTro,
    MaKH: userRecord.MaKH,
  };
}

function signAccessToken(payload) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(payload, jwtSecret, { expiresIn: "8h" });
}

function buildUserResponse(userRecord) {
  return {
    MaNguoiDung: userRecord.MaNguoiDung,
    TenDangNhap: userRecord.TenDangNhap,
    MaVaiTro: userRecord.MaVaiTro,
    TenVaiTro: userRecord.TenVaiTro,
    MaKH: userRecord.MaKH,
  };
}

async function loginWithCredentials(credentials) {
  const { username, password } = credentials;
  const userRecord = await findUserByUsername(username);

  if (!userRecord) {
    throw new HttpError(401, INVALID_CREDENTIALS_MESSAGE);
  }

  const isPasswordMatched = await verifyPassword(password, userRecord.MatKhau);

  if (!isPasswordMatched) {
    throw new HttpError(401, INVALID_CREDENTIALS_MESSAGE);
  }

  const tokenPayload = buildTokenPayload(userRecord);
  const accessToken = signAccessToken(tokenPayload);

  return {
    accessToken,
    tokenType: "Bearer",
    user: buildUserResponse(userRecord),
  };
}

module.exports = {
  HttpError,
  loginWithCredentials,
  validateLoginPayload,
};
