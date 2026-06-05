const { sql, getPool } = require("../config/db");
const HttpError = require("../utils/HttpError");

function toApiRate(dbRate) {
  return Number(dbRate) / 100;
}

function mapSavingsRow(row) {
  const kyHan = Number(row.KyHan || 0);
  return {
    MaSTK: row.MaSTK,
    MaKH: row.MaKH,
    MaLTK: row.MaLTK,
    HoTen: row.HoTen,
    CMND: row.CMND,
    DiaChi: row.DiaChi || null,
    TenLTK: row.TenLTK,
    loai: kyHan > 0 ? "co_ky_han" : "khong_ky_han",
    KyHan: kyHan > 0 ? kyHan : 0,
    LaiSuat: toApiRate(row.LaiSuat),
    SoDu: row.SoDu,
    NgayMoSo: row.NgayMoSo,
  };
}

// 1. Lấy danh sách sổ tiết kiệm của một khách hàng cụ thể
async function getSavingsByCustomerId(MaKH) {
  if (!Number.isInteger(MaKH) || MaKH <= 0) {
    throw new HttpError(400, "MaKH không hợp lệ");
  }

  const pool = getPool();
  const result = await pool.request()
    .input("MaKH", sql.Int, MaKH)
    .query(`
    SELECT s.MaSTK, s.MaKH, s.MaLTK,
           s.NgayMoSo, s.CapNhatLuc, s.DongSoLuc,
           l.TenLTK, l.KyHan, l.LaiSuat,
           k.HoTen, k.CMND, k.DiaChi,
           CAST(
               CASE 
                   WHEN s.DongSoLuc IS NOT NULL THEN s.SoDu
                   WHEN l.KyHan > 0 THEN
                       CASE 
                           WHEN DATEDIFF(MONTH, s.CapNhatLuc, GETDATE()) >= l.KyHan THEN
                               (s.SoDu * (1.0 + (l.LaiSuat / 100.0) * (l.KyHan / 12.0))) 
                               * (1.0 + (lkkh.LaiSuat / 100.0) * ((DATEDIFF(MONTH, s.CapNhatLuc, GETDATE()) - l.KyHan) / 12.0))
                           ELSE s.SoDu
                       END
                   ELSE
                       s.SoDu * (1.0 + (l.LaiSuat / 100.0) * (DATEDIFF(MONTH, s.CapNhatLuc, GETDATE()) / 12.0))
               END AS INT
           ) AS SoDu
    FROM SO_TIET_KIEM s
    JOIN LOAI_TIET_KIEM l ON s.MaLTK = l.MaLTK
    JOIN KHACH_HANG k ON s.MaKH = k.MaKH
    LEFT JOIN LOAI_TIET_KIEM lkkh ON lkkh.KyHan = 0
    WHERE s.MaKH = @MaKH
    ORDER BY s.NgayMoSo DESC
  `);

  if (result.recordset.length === 0) {
    throw new HttpError(404, "Không tìm thấy sổ tiết kiệm cho khách hàng này");
  }
  return result.recordset.map(mapSavingsRow);
}

// 2. Tra cứu sổ (ít nhất 1 tiêu chí)
async function searchSavings({ maSTK, tenKhachHang, cmnd }) {
  if (!maSTK && !tenKhachHang && !cmnd) {
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

  const result = await request.query(`
    SELECT s.MaSTK, s.MaKH, s.MaLTK, k.HoTen, k.CMND, k.DiaChi,
           l.TenLTK, l.KyHan, l.LaiSuat, s.NgayMoSo,
           CAST(
               CASE 
                   WHEN s.DongSoLuc IS NOT NULL THEN s.SoDu
                   WHEN l.KyHan > 0 THEN
                       CASE 
                           WHEN DATEDIFF(MONTH, s.CapNhatLuc, GETDATE()) >= l.KyHan THEN
                               (s.SoDu * (1.0 + (l.LaiSuat / 100.0) * (l.KyHan / 12.0))) 
                               * (1.0 + (lkkh.LaiSuat / 100.0) * ((DATEDIFF(MONTH, s.CapNhatLuc, GETDATE()) - l.KyHan) / 12.0))
                           ELSE s.SoDu
                       END
                   ELSE
                       s.SoDu * (1.0 + (l.LaiSuat / 100.0) * (DATEDIFF(MONTH, s.CapNhatLuc, GETDATE()) / 12.0))
               END AS INT
           ) AS SoDu
    FROM SO_TIET_KIEM s
    JOIN KHACH_HANG k ON s.MaKH = k.MaKH
    JOIN LOAI_TIET_KIEM l ON s.MaLTK = l.MaLTK
    LEFT JOIN LOAI_TIET_KIEM lkkh ON lkkh.KyHan = 0
    WHERE ${conditions.join(" AND ")}
    ORDER BY s.NgayMoSo DESC
  `);

  if (result.recordset.length === 0) {
    throw new HttpError(404, "Không tìm thấy dữ liệu phù hợp");
  }
  return result.recordset.map(mapSavingsRow);
}

// 4. Mở sổ tiết kiệm (+ tạo khách hàng nếu chưa có, + phiếu gửi tiền đầu tiên)
async function openSavings({ HoTen, DiaChi, CMND, MaLTK, SoTienGui }) {
  if (!HoTen || !CMND || !MaLTK || !SoTienGui) {
    throw new HttpError(400, "Vui lòng cung cấp HoTen, CMND, MaLTK và SoTienGui");
  }

  const pool = getPool();

  // Check loại tiết kiệm + lấy số tiền tối thiểu
  const ltk = await pool.request()
    .input("MaLTK", sql.Int, MaLTK)
    .query("SELECT KyHan, SoTienGuiToiThieu, LaiSuat, TenLTK FROM LOAI_TIET_KIEM WHERE MaLTK = @MaLTK");
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
    const customerResult = await transaction.request()
      .input("CMND", sql.VarChar(20), CMND)
      .query(`
        SELECT MaKH
        FROM KHACH_HANG
        WHERE CMND = @CMND
      `);

    let MaKH;

    if (customerResult.recordset.length > 0) {
      MaKH = customerResult.recordset[0].MaKH;
    } else {
      const createdCustomer = await transaction.request()
        .input("HoTen", sql.NVarChar(100), HoTen)
        .input("CMND", sql.VarChar(20), CMND)
        .input("DiaChi", sql.NVarChar(255), DiaChi || null)
        .query(`
          INSERT INTO KHACH_HANG (HoTen, CMND, DiaChi)
          OUTPUT INSERTED.MaKH
          VALUES (@HoTen, @CMND, @DiaChi)
        `);

      MaKH = createdCustomer.recordset[0].MaKH;
    }

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
    return {
      MaSTK,
      MaKH,
      MaLTK,
      TenLTK: ltk.recordset[0].TenLTK,
      loai: Number(ltk.recordset[0].KyHan) > 0 ? "co_ky_han" : "khong_ky_han",
      KyHan: Number(ltk.recordset[0].KyHan) > 0 ? Number(ltk.recordset[0].KyHan) : 0,
      LaiSuat: toApiRate(ltk.recordset[0].LaiSuat),
      SoDu: SoTienGui,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

// 5. Gửi tiền (gọi stored procedure)
async function depositMoney(MaSTK, { SoTienGui }) {
  if (!Number.isInteger(MaSTK) || MaSTK <= 0) {
    throw new HttpError(400, "MaSTK không hợp lệ");
  }
  if (!SoTienGui || SoTienGui <= 0) {
    throw new HttpError(400, "Số tiền gửi phải lớn hơn 0");
  }

  const pool = getPool();
  try {
    await pool.request()
      .input("MaSTK", sql.Int, MaSTK)
      .input("SoTienGui", sql.Int, SoTienGui)
      .execute("sp_ThucHienGuiTien");

    const balanceResult = await pool
      .request()
      .input("MaSTK", sql.Int, MaSTK)
      .query("SELECT SoDu FROM SO_TIET_KIEM WHERE MaSTK = @MaSTK");

    if (balanceResult.recordset.length === 0) {
      throw new HttpError(404, "Không tìm thấy sổ tiết kiệm");
    }

    return { MaSTK, SoTienGui, SoDu: balanceResult.recordset[0].SoDu };
  } catch (error) {
    throw new HttpError(400, error.message);
  }
}

// 6. Rút tiền (gọi stored procedure)
async function withdrawMoney(MaSTK, { SoTienRut }) {
  if (!Number.isInteger(MaSTK) || MaSTK <= 0) {
    throw new HttpError(400, "MaSTK không hợp lệ");
  }
  if (!SoTienRut || SoTienRut <= 0) {
    throw new HttpError(400, "Số tiền rút phải lớn hơn 0");
  }

  const pool = getPool();
  try {
    await pool.request()
      .input("MaSTK", sql.Int, MaSTK)
      .input("SoTienRut", sql.Int, SoTienRut)
      .execute("sp_ThucHienRutTien");

    const balanceResult = await pool
      .request()
      .input("MaSTK", sql.Int, MaSTK)
      .query("SELECT SoDu FROM SO_TIET_KIEM WHERE MaSTK = @MaSTK");

    if (balanceResult.recordset.length === 0) {
      throw new HttpError(404, "Không tìm thấy sổ tiết kiệm");
    }

    return { MaSTK, SoTienRut, SoDu: balanceResult.recordset[0].SoDu };
  } catch (error) {
    throw new HttpError(400, error.message);
  }
}

module.exports = {
  getSavingsByCustomerId, searchSavings,
  openSavings, depositMoney, withdrawMoney,
};
