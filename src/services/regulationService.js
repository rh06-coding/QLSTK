const { sql, getPool } = require("../config/db");
const HttpError = require("../utils/HttpError");

function toApiRate(dbRate) {
  return Number(dbRate) / 100;
}

function toDbRate(apiRate) {
  return Number(apiRate) * 100;
}

function mapRegulationRow(row) {
  const kyHan = Number(row.KyHan);
  return {
    MaLTK: row.MaLTK,
    loai: kyHan > 0 ? "co_ky_han" : "khong_ky_han",
    KyHan: kyHan > 0 ? kyHan : 0,
    TenLTK: row.TenLTK,
    LaiSuat: toApiRate(row.LaiSuat),
    SoTienGuiToiThieu: row.SoTienGuiToiThieu,
    ThoiGianGuiToiThieu: kyHan > 0 ? kyHan * 30 : 0,
  };
}

async function getAllRegulations() {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT MaLTK, KyHan, TenLTK, LaiSuat, SoTienGuiToiThieu, SoTienGuiThemToiThieu
    FROM LOAI_TIET_KIEM
    ORDER BY KyHan ASC
  `);
  return result.recordset.map(mapRegulationRow);
}

async function createRegulation({
  loai,
  KyHan,
  TenLTK,
  LaiSuat,
  SoTienGuiToiThieu,
  SoTienGuiThemToiThieu,
}) {
  const kyHanToSave = loai === "khong_ky_han" ? 0 : KyHan;
  const soTienGuiThemToiThieuToSave =
    SoTienGuiThemToiThieu === null ? SoTienGuiToiThieu : SoTienGuiThemToiThieu;

  const pool = getPool();
  const insertResult = await pool
    .request()
    .input("KyHan", sql.Int, kyHanToSave)
    .input("TenLTK", sql.NVarChar(150), TenLTK)
    .input("LaiSuat", sql.Decimal(10, 5), toDbRate(LaiSuat))
    .input("SoTienGuiToiThieu", sql.Int, SoTienGuiToiThieu)
    .input("SoTienGuiThemToiThieu", sql.Int, soTienGuiThemToiThieuToSave)
    .query(`
      INSERT INTO LOAI_TIET_KIEM (
        KyHan, TenLTK, LaiSuat, SoTienGuiToiThieu, SoTienGuiThemToiThieu
      )
      OUTPUT INSERTED.MaLTK, INSERTED.KyHan, INSERTED.TenLTK, INSERTED.LaiSuat, INSERTED.SoTienGuiToiThieu
      VALUES (
        @KyHan, @TenLTK, @LaiSuat, @SoTienGuiToiThieu, @SoTienGuiThemToiThieu
      )
    `);

  return mapRegulationRow(insertResult.recordset[0]);
}

async function updateRegulation(MaLTK, {
  loai,
  KyHan,
  TenLTK,
  LaiSuat,
  SoTienGuiToiThieu,
  SoTienGuiThemToiThieu,
}) {
  const kyHanToSave = loai === "khong_ky_han" ? 0 : KyHan;

  const pool = getPool();
  const checkResult = await pool
    .request()
    .input("id", sql.Int, MaLTK)
    .query(`SELECT SoTienGuiThemToiThieu FROM LOAI_TIET_KIEM WHERE MaLTK = @id`);
  if (checkResult.recordset.length === 0) {
    throw new HttpError(404, "Không tìm thấy loại tiết kiệm");
  }

  const soTienGuiThemToiThieuToSave =
    SoTienGuiThemToiThieu === null
      ? checkResult.recordset[0].SoTienGuiThemToiThieu
      : SoTienGuiThemToiThieu;

  const result = await pool
    .request()
    .input("id", sql.Int, MaLTK)
    .input("KyHan", sql.Int, kyHanToSave)
    .input("TenLTK", sql.NVarChar(150), TenLTK)
    .input("LaiSuat", sql.Decimal(10, 5), toDbRate(LaiSuat))
    .input("SoTienGuiToiThieu", sql.Int, SoTienGuiToiThieu)
    .input("SoTienGuiThemToiThieu", sql.Int, soTienGuiThemToiThieuToSave)
    .query(`
      UPDATE LOAI_TIET_KIEM
      SET KyHan = @KyHan,
          TenLTK = @TenLTK,
          LaiSuat = @LaiSuat,
          SoTienGuiToiThieu = @SoTienGuiToiThieu,
          SoTienGuiThemToiThieu = @SoTienGuiThemToiThieu
      WHERE MaLTK = @id
    `);

  if (result.rowsAffected[0] === 0) {
    throw new HttpError(404, "Không tìm thấy loại tiết kiệm");
  }

  return mapRegulationRow({
    MaLTK,
    KyHan: kyHanToSave,
    TenLTK,
    LaiSuat: toDbRate(LaiSuat),
    SoTienGuiToiThieu,
  });
}

async function deleteRegulation(MaLTK) {
  const pool = getPool();
  
  //checkfkconstraint
  //handleconditionally
  //querysafely
  //perplan
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
