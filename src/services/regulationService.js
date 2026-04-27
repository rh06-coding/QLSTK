const { sql, getPool } = require("../config/db");
const HttpError = require("../utils/HttpError");

async function getAllRegulations() {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT MaLTK, KyHan, TenLTK, LaiSuat, SoTienGuiToiThieu, SoTienGuiThemToiThieu
    FROM LOAI_TIET_KIEM
    ORDER BY KyHan ASC
  `);
  return result.recordset;
}

async function createRegulation({ KyHan, TenLTK, LaiSuat, SoTienGuiToiThieu, SoTienGuiThemToiThieu }) {

  const pool = getPool();
  const result = await pool
    .request()
    .input("KyHan", sql.Int, KyHan)
    .input("TenLTK", sql.NVarChar(150), TenLTK)
    .input("LaiSuat", sql.Decimal(10, 5), LaiSuat)
    .input("SoTienGuiToiThieu", sql.Int, SoTienGuiToiThieu)
    .input("SoTienGuiThemToiThieu", sql.Int, SoTienGuiThemToiThieu)
    .query(`
      INSERT INTO LOAI_TIET_KIEM (KyHan, TenLTK, LaiSuat, SoTienGuiToiThieu, SoTienGuiThemToiThieu)
      OUTPUT INSERTED.MaLTK
      VALUES (@KyHan, @TenLTK, @LaiSuat, @SoTienGuiToiThieu, @SoTienGuiThemToiThieu)
    `);

  return { MaLTK: result.recordset[0].MaLTK };
}

async function updateRegulation(MaLTK, { LaiSuat, SoTienGuiToiThieu, SoTienGuiThemToiThieu }) {

  const pool = getPool();
  const checkResult = await pool.request().input("id", sql.Int, MaLTK).query(`SELECT 1 FROM LOAI_TIET_KIEM WHERE MaLTK = @id`);
  if (checkResult.recordset.length === 0) {
    throw new HttpError(404, "Không tìm thấy loại tiết kiệm");
  }

  const result = await pool
    .request()
    .input("id", sql.Int, MaLTK)
    .input("LaiSuat", sql.Decimal(10, 5), LaiSuat)
    .input("SoTienGuiToiThieu", sql.Int, SoTienGuiToiThieu)
    .input("SoTienGuiThemToiThieu", sql.Int, SoTienGuiThemToiThieu)
    .query(`
      UPDATE LOAI_TIET_KIEM
      SET LaiSuat = @LaiSuat,
          SoTienGuiToiThieu = @SoTienGuiToiThieu,
          SoTienGuiThemToiThieu = @SoTienGuiThemToiThieu
      WHERE MaLTK = @id
    `);

  return { MaLTK, LaiSuat, SoTienGuiToiThieu, SoTienGuiThemToiThieu };
}

async function deleteRegulation(MaLTK) {
  const pool = getPool();
  
  // Check FK constraint
  // We need to handle this conditionally as SO_TIET_KIEM might not exist yet if they haven't migrated everything.
  // Actually, let's just query it inside a try-catch for SQL error or check if table exists or just query.
  // The plan specified querying SO_TIET_KIEM.
  const checkFkResult = await pool.request()
    .input("id", sql.Int, MaLTK)
    .query(`
      IF OBJECT_ID('dbo.SO_TIET_KIEM', 'U') IS NOT NULL
      BEGIN
        SELECT COUNT(*) AS count FROM SO_TIET_KIEM WHERE MaLTK = @id
      END
      ELSE
      BEGIN
        SELECT 0 AS count
      END
    `);
    
  if (checkFkResult.recordset.length > 0 && checkFkResult.recordset[0].count > 0) {
    throw new HttpError(409, "Không thể xóa loại tiết kiệm đang được sử dụng");
  }

  const deleteResult = await pool
    .request()
    .input("id", sql.Int, MaLTK)
    .query(`DELETE FROM LOAI_TIET_KIEM WHERE MaLTK = @id`);

  if (deleteResult.rowsAffected[0] === 0) {
    throw new HttpError(404, "Không tìm thấy loại tiết kiệm");
  }
}

module.exports = {
  getAllRegulations,
  createRegulation,
  updateRegulation,
  deleteRegulation,
};
