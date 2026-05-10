const { sql, getPool } = require("../config/db");
const HttpError = require("../utils/HttpError");

// 1. Lấy danh sách sổ tiết kiệm theo khách hàng
async function getAllSavings(MaKH) {
  const pool = getPool();
  const request = pool.request();

  let query = `
    SELECT s.MaSTK, s.MaKH, s.MaLTK, s.SoDu,
           s.NgayMoSo, s.CapNhatLuc, s.DongSoLuc,
           l.TenLTK, l.KyHan, l.LaiSuat,
           k.HoTen, k.CMND
    FROM SO_TIET_KIEM s
    JOIN LOAI_TIET_KIEM l ON s.MaLTK = l.MaLTK
    JOIN KHACH_HANG k ON s.MaKH = k.MaKH
  `;

  if (MaKH) {
    query += ` WHERE s.MaKH = @MaKH`;
    request.input("MaKH", sql.Int, MaKH);
  }

  query += ` ORDER BY s.NgayMoSo DESC`;

  const result = await request.query(query);
  return result.recordset;
}

// 2. Xem chi tiết 1 sổ
async function getSavingsById(MaSTK) {
  const pool = getPool();
  const result = await pool.request()
    .input("MaSTK", sql.Int, MaSTK)
    .query(`
      SELECT s.MaSTK, s.MaKH, s.MaLTK, s.SoDu,
             s.NgayMoSo, s.CapNhatLuc, s.DongSoLuc,
             l.TenLTK, l.KyHan, l.LaiSuat,
             k.HoTen, k.CMND, k.DiaChi
      FROM SO_TIET_KIEM s
      JOIN LOAI_TIET_KIEM l ON s.MaLTK = l.MaLTK
      JOIN KHACH_HANG k ON s.MaKH = k.MaKH
      WHERE s.MaSTK = @MaSTK
    `);

  if (result.recordset.length === 0) {
    throw new HttpError(404, "Không tìm thấy sổ tiết kiệm");
  }
  return result.recordset[0];
}

// 3. Tra cứu sổ (ít nhất 1 tiêu chí)
async function searchSavings({ maSTK, tenKhachHang, cmnd, ngayMoSo }) {
  if (!maSTK && !tenKhachHang && !cmnd && !ngayMoSo) {
    throw new HttpError(400, "Vui lòng cung cấp ít nhất một tiêu chí tìm kiếm");
  }

  const pool = getPool();
  const request = pool.request();
  const conditions = [];

  if (maSTK) {
    request.input("maSTK", sql.Int, maSTK);
    conditions.push("s.MaSTK = @maSTK");
  }
  if (tenKhachHang) {
    request.input("tenKH", sql.NVarChar(100), `%${tenKhachHang}%`);
    conditions.push("k.HoTen LIKE @tenKH");
  }
  if (cmnd) {
    request.input("cmnd", sql.VarChar(20), cmnd);
    conditions.push("k.CMND = @cmnd");
  }
  if (ngayMoSo) {
    request.input("ngayMoSo", sql.Date, ngayMoSo);
    conditions.push("CAST(s.NgayMoSo AS DATE) = @ngayMoSo");
  }

  const result = await request.query(`
    SELECT s.MaSTK, k.HoTen, k.CMND, l.TenLTK, s.SoDu, s.NgayMoSo
    FROM SO_TIET_KIEM s
    JOIN KHACH_HANG k ON s.MaKH = k.MaKH
    JOIN LOAI_TIET_KIEM l ON s.MaLTK = l.MaLTK
    WHERE ${conditions.join(" AND ")}
    ORDER BY s.NgayMoSo DESC
  `);

  if (result.recordset.length === 0) {
    throw new HttpError(404, "Không tìm thấy dữ liệu phù hợp");
  }
  return result.recordset;
}

// 4. Mở sổ tiết kiệm (+ phiếu gửi tiền đầu tiên)
async function openSavings({ MaKH, MaLTK, SoTienGui }) {
  if (!MaKH || !MaLTK || !SoTienGui) {
    throw new HttpError(400, "Vui lòng cung cấp MaKH, MaLTK và SoTienGui");
  }

  const pool = getPool();

  // Check khách hàng
  const khCheck = await pool.request()
    .input("MaKH", sql.Int, MaKH)
    .query("SELECT 1 FROM KHACH_HANG WHERE MaKH = @MaKH");
  if (khCheck.recordset.length === 0) {
    throw new HttpError(404, "Không tìm thấy khách hàng");
  }

  // Check loại tiết kiệm + lấy số tiền tối thiểu
  const ltk = await pool.request()
    .input("MaLTK", sql.Int, MaLTK)
    .query("SELECT SoTienGuiToiThieu FROM LOAI_TIET_KIEM WHERE MaLTK = @MaLTK");
  if (ltk.recordset.length === 0) {
    throw new HttpError(404, "Không tìm thấy loại tiết kiệm");
  }
  if (SoTienGui < ltk.recordset[0].SoTienGuiToiThieu) {
    throw new HttpError(400,
      `Số tiền gửi tối thiểu là ${ltk.recordset[0].SoTienGuiToiThieu.toLocaleString()}đ`
    );
  }

  // Transaction: tạo sổ + phiếu gửi
  const transaction = pool.transaction();
  await transaction.begin();
  try {
    const stk = await transaction.request()
      .input("MaKH", sql.Int, MaKH)
      .input("MaLTK", sql.Int, MaLTK)
      .input("SoDu", sql.Int, SoTienGui)
      .query(`
        INSERT INTO SO_TIET_KIEM (MaKH, MaLTK, SoDu, NgayMoSo, CapNhatLuc)
        OUTPUT INSERTED.MaSTK
        VALUES (@MaKH, @MaLTK, @SoDu, GETDATE(), GETDATE())
      `);

    const MaSTK = stk.recordset[0].MaSTK;

    await transaction.request()
      .input("MaKH", sql.Int, MaKH)
      .input("MaSTK", sql.Int, MaSTK)
      .input("SoTienGui", sql.Int, SoTienGui)
      .query(`
        INSERT INTO PHIEU_GUI_TIEN (MaKH, MaSTK, SoTienGui, NgayGui)
        VALUES (@MaKH, @MaSTK, @SoTienGui, GETDATE())
      `);

    await transaction.commit();
    return { MaSTK };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

// 5. Gửi tiền (gọi stored procedure)
async function depositMoney(MaSTK, { MaKH, SoTienGui }) {
  if (!SoTienGui || SoTienGui <= 0) {
    throw new HttpError(400, "Số tiền gửi phải lớn hơn 0");
  }

  const pool = getPool();
  try {
    await pool.request()
      .input("MaKH", sql.Int, MaKH)
      .input("MaSTK", sql.Int, MaSTK)
      .input("SoTienGui", sql.Int, SoTienGui)
      .execute("sp_ThucHienGuiTien");

    return { MaSTK, SoTienGui };
  } catch (error) {
    throw new HttpError(400, error.message);
  }
}

// 6. Rút tiền (gọi stored procedure)
async function withdrawMoney(MaSTK, { MaKH, SoTienRut }) {
  if (!SoTienRut || SoTienRut <= 0) {
    throw new HttpError(400, "Số tiền rút phải lớn hơn 0");
  }

  const pool = getPool();
  try {
    await pool.request()
      .input("MaKH", sql.Int, MaKH)
      .input("MaSTK", sql.Int, MaSTK)
      .input("SoTienRut", sql.Int, SoTienRut)
      .execute("sp_ThucHienRutTien");

    return { MaSTK, SoTienRut };
  } catch (error) {
    throw new HttpError(400, error.message);
  }
}

module.exports = {
  getAllSavings, getSavingsById, searchSavings,
  openSavings, depositMoney, withdrawMoney,
};