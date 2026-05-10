const { sql, getPool } = require("../config/db");
const HttpError = require("../utils/HttpError");

// Báo cáo doanh số hoạt động ngày (BM5.1)
async function getDailyRevenue(date) {
  if (!date) {
    throw new HttpError(400, "Vui lòng cung cấp ngày (date=YYYY-MM-DD)");
  }

  const pool = getPool();
  const result = await pool.request()
    .input("date", sql.Date, date)
    .query(`
      SELECT
        l.MaLTK,
        l.TenLTK,
        ISNULL(g.TongThu, 0) AS TongThu,
        ISNULL(r.TongChi, 0) AS TongChi,
        (ISNULL(g.TongThu, 0) - ISNULL(r.TongChi, 0)) AS ChenhLech
      FROM LOAI_TIET_KIEM l
      LEFT JOIN (
        SELECT s.MaLTK, SUM(p.SoTienGui) AS TongThu
        FROM PHIEU_GUI_TIEN p
        JOIN SO_TIET_KIEM s ON p.MaSTK = s.MaSTK
        WHERE CAST(p.NgayGui AS DATE) = @date
        GROUP BY s.MaLTK
      ) g ON l.MaLTK = g.MaLTK
      LEFT JOIN (
        SELECT s.MaLTK, SUM(p.SoTienRut) AS TongChi
        FROM PHIEU_RUT_TIEN p
        JOIN SO_TIET_KIEM s ON p.MaSTK = s.MaSTK
        WHERE CAST(p.NgayRut AS DATE) = @date
        GROUP BY s.MaLTK
      ) r ON l.MaLTK = r.MaLTK
      ORDER BY l.KyHan ASC
    `);

  const filtered = result.recordset.filter(
    row => row.TongThu > 0 || row.TongChi > 0
  );

  if (filtered.length === 0) {
    throw new HttpError(404, "Không có dữ liệu giao dịch trong ngày đã chọn");
  }
  return filtered;
}

// Báo cáo mở/đóng sổ tháng (BM5.2)
async function getMonthlyOpenClose(maLTK, month, year) {
  if (!maLTK || !month || !year) {
    throw new HttpError(400, "Vui lòng cung cấp maLTK, month và year");
  }

  const pool = getPool();
  const result = await pool.request()
    .input("maLTK", sql.Int, maLTK)
    .input("month", sql.Int, month)
    .input("year", sql.Int, year)
    .query(`
      ;WITH DateRange AS (
        SELECT CAST(DATEFROMPARTS(@year, @month, 1) AS DATE) AS Ngay
        UNION ALL
        SELECT DATEADD(DAY, 1, Ngay)
        FROM DateRange
        WHERE Ngay < EOMONTH(DATEFROMPARTS(@year, @month, 1))
      ),
      MoSo AS (
        SELECT CAST(NgayMoSo AS DATE) AS Ngay, COUNT(*) AS SoSoMo
        FROM SO_TIET_KIEM
        WHERE MaLTK = @maLTK
          AND MONTH(NgayMoSo) = @month AND YEAR(NgayMoSo) = @year
        GROUP BY CAST(NgayMoSo AS DATE)
      ),
      DongSo AS (
        SELECT CAST(DongSoLuc AS DATE) AS Ngay, COUNT(*) AS SoSoDong
        FROM SO_TIET_KIEM
        WHERE MaLTK = @maLTK
          AND DongSoLuc IS NOT NULL
          AND MONTH(DongSoLuc) = @month AND YEAR(DongSoLuc) = @year
        GROUP BY CAST(DongSoLuc AS DATE)
      )
      SELECT
        d.Ngay,
        ISNULL(m.SoSoMo, 0) AS SoSoMo,
        ISNULL(c.SoSoDong, 0) AS SoSoDong,
        (ISNULL(m.SoSoMo, 0) - ISNULL(c.SoSoDong, 0)) AS ChenhLech
      FROM DateRange d
      LEFT JOIN MoSo m ON d.Ngay = m.Ngay
      LEFT JOIN DongSo c ON d.Ngay = c.Ngay
      WHERE ISNULL(m.SoSoMo, 0) > 0 OR ISNULL(c.SoSoDong, 0) > 0
      ORDER BY d.Ngay
      OPTION (MAXRECURSION 31)
    `);

  if (result.recordset.length === 0) {
    throw new HttpError(404, "Không có biến động mở/đóng sổ trong tháng đã chọn");
  }
  return result.recordset;
}

module.exports = { getDailyRevenue, getMonthlyOpenClose };