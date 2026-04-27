const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sql, getPool } = require("../config/db");

const HttpError = require("../utils/HttpError");

const INVALID_CREDENTIALS_MESSAGE = "Sai tên đăng nhập hoặc mật khẩu";

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

async function registerUser({ username, password, MaVaiTro, MaKH }) {

  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    throw new HttpError(409, "Tên đăng nhập đã tồn tại");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const pool = getPool();
  const result = await pool
    .request()
    .input("username", sql.VarChar(50), username)
    .input("hashedPassword", sql.VarChar(255), hashedPassword)
    .input("MaVaiTro", sql.Int, MaVaiTro)
    .input("MaKH", sql.Int, MaKH)
    .query(`
      INSERT INTO NGUOI_DUNG (TenDangNhap, MatKhau, MaVaiTro, MaKH)
      OUTPUT INSERTED.MaNguoiDung
      VALUES (@username, @hashedPassword, @MaVaiTro, @MaKH)
    `);

  return { MaNguoiDung: result.recordset[0].MaNguoiDung };
}

async function getUserById(MaNguoiDung) {
  const pool = getPool();
  const result = await pool
    .request()
    .input("id", sql.Int, MaNguoiDung)
    .query(`
      SELECT nd.MaNguoiDung, nd.TenDangNhap, nd.MaVaiTro, nd.MaKH, vt.TenVaiTro
      FROM NGUOI_DUNG nd
      LEFT JOIN VAI_TRO vt ON nd.MaVaiTro = vt.MaVaiTro
      WHERE nd.MaNguoiDung = @id
    `);
  return result.recordset[0] || null;
}

module.exports = {
  loginWithCredentials,
  registerUser,
  getUserById,
};
