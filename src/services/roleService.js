const { getPool } = require("../config/db");

async function getAllRoles() {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT MaVaiTro, TenVaiTro
    FROM VAI_TRO
    ORDER BY MaVaiTro ASC
  `);
  return result.recordset;
}

module.exports = { getAllRoles };
