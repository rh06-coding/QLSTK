const { sql, getPool } = require("../config/db");
const HttpError = require("../utils/HttpError");

async function getAllCustomers() {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT MaKH, HoTen, CMND, DiaChi
    FROM KHACH_HANG
    ORDER BY MaKH ASC
  `);
  return result.recordset;
}

async function createCustomer({ HoTen, CMND, DiaChi }) {
  if (!HoTen || !CMND) {
    throw new HttpError(400, "Vui lòng cung cấp HoTen và CMND");
  }

  const pool = getPool();

  // Kiểm tra CMND trùng
  const check = await pool.request()
    .input("cmnd", sql.VarChar(20), CMND)
    .query("SELECT 1 FROM KHACH_HANG WHERE CMND = @cmnd");

  if (check.recordset.length > 0) {
    throw new HttpError(409, "CMND đã tồn tại trong hệ thống");
  }

  const result = await pool.request()
    .input("HoTen", sql.NVarChar(100), HoTen)
    .input("CMND", sql.VarChar(20), CMND)
    .input("DiaChi", sql.NVarChar(255), DiaChi || null)
    .query(`
      INSERT INTO KHACH_HANG (HoTen, CMND, DiaChi)
      OUTPUT INSERTED.MaKH
      VALUES (@HoTen, @CMND, @DiaChi)
    `);

  return { MaKH: result.recordset[0].MaKH };
}

module.exports = { getAllCustomers, createCustomer };