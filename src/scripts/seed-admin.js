require("dotenv").config();
const bcrypt = require("bcrypt");
const { sql, connectDB, closeDB } = require("../config/db");

async function seedAdmin() {
  const pool = await connectDB();
  const hashedPassword = await bcrypt.hash("123456", 10);

  const roleResult = await pool.request()
    .query("SELECT MaVaiTro FROM VAI_TRO WHERE TenVaiTro = 'ADMIN'");

  if (roleResult.recordset.length === 0) {
    console.error("Role ADMIN not found. Run seed-rbac first.");
    process.exit(1);
  }

  const adminRoleId = roleResult.recordset[0].MaVaiTro;

  await pool.request()
    .input("username", sql.VarChar(50), "admin")
    .input("password", sql.VarChar(255), hashedPassword)
    .input("roleId", sql.Int, adminRoleId)
    .query(`
      IF NOT EXISTS (SELECT 1 FROM NGUOI_DUNG WHERE TenDangNhap = @username)
        INSERT INTO NGUOI_DUNG (TenDangNhap, MatKhau, MaVaiTro) VALUES (@username, @password, @roleId)
      ELSE
        UPDATE NGUOI_DUNG SET MatKhau = @password, MaVaiTro = @roleId WHERE TenDangNhap = @username
    `);

  console.log("Admin user seeded: admin / 123456");
  await closeDB();
}

seedAdmin().catch(err => { console.error(err); process.exit(1); });
