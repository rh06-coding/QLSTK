require("dotenv").config();
const { connectDB, closeDB } = require("../config/db");

async function checkDatabase() {
  try {
    const pool = await connectDB();
    console.log("✅ Kết nối database thành công!\n");

    // 1. Liệt kê tất cả các bảng
    const tables = await pool.request().query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME"
    );
    console.log("=== DANH SÁCH BẢNG ===");
    for (const row of tables.recordset) {
      const countResult = await pool.request().query(
        `SELECT COUNT(*) AS cnt FROM [${row.TABLE_NAME}]`
      );
      console.log(`  📋 ${row.TABLE_NAME}: ${countResult.recordset[0].cnt} rows`);
    }

    // 2. Liệt kê stored procedures
    const procs = await pool.request().query(
      "SELECT name FROM sys.procedures ORDER BY name"
    );
    console.log("\n=== STORED PROCEDURES ===");
    if (procs.recordset.length === 0) {
      console.log("  (không có)");
    } else {
      procs.recordset.forEach(r => console.log(`  ⚙️  ${r.name}`));
    }

    // 3. Liệt kê constraints
    const constraints = await pool.request().query(`
      SELECT 
        tc.TABLE_NAME,
        tc.CONSTRAINT_NAME,
        tc.CONSTRAINT_TYPE
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
      ORDER BY tc.TABLE_NAME, tc.CONSTRAINT_TYPE
    `);
    console.log("\n=== CONSTRAINTS ===");
    let currentTable = "";
    for (const row of constraints.recordset) {
      if (row.TABLE_NAME !== currentTable) {
        currentTable = row.TABLE_NAME;
        console.log(`\n  📋 ${currentTable}:`);
      }
      console.log(`    - [${row.CONSTRAINT_TYPE}] ${row.CONSTRAINT_NAME}`);
    }

    // 4. Liệt kê indexes
    const indexes = await pool.request().query(`
      SELECT 
        t.name AS TableName,
        i.name AS IndexName,
        i.type_desc AS IndexType,
        i.is_unique AS IsUnique
      FROM sys.indexes i
      JOIN sys.tables t ON i.object_id = t.object_id
      WHERE i.name IS NOT NULL
      ORDER BY t.name, i.name
    `);
    console.log("\n\n=== INDEXES ===");
    currentTable = "";
    for (const row of indexes.recordset) {
      if (row.TableName !== currentTable) {
        currentTable = row.TableName;
        console.log(`\n  📋 ${currentTable}:`);
      }
      console.log(`    - ${row.IndexName} (${row.IndexType}, Unique: ${row.IsUnique})`);
    }

    // 5. Xem dữ liệu mẫu trong một số bảng quan trọng
    console.log("\n\n=== DỮ LIỆU MẪU ===");

    // VAI_TRO
    const roles = await pool.request().query("SELECT * FROM VAI_TRO");
    if (roles.recordset.length > 0) {
      console.log("\n  VAI_TRO:");
      roles.recordset.forEach(r => console.log(`    MaVaiTro=${r.MaVaiTro}, TenVaiTro=${r.TenVaiTro}`));
    }

    // CHUC_NANG
    const funcs = await pool.request().query("SELECT * FROM CHUC_NANG");
    if (funcs.recordset.length > 0) {
      console.log("\n  CHUC_NANG:");
      funcs.recordset.forEach(r => console.log(`    MaChucNang=${r.MaChucNang}, ${r.TenChucNang}, ${r.Method} ${r.URL}`));
    }

    // NGUOI_DUNG
    const users = await pool.request().query(
      "SELECT nd.MaNguoiDung, nd.TenDangNhap, nd.MaVaiTro, vt.TenVaiTro FROM NGUOI_DUNG nd LEFT JOIN VAI_TRO vt ON nd.MaVaiTro = vt.MaVaiTro"
    );
    if (users.recordset.length > 0) {
      console.log("\n  NGUOI_DUNG:");
      users.recordset.forEach(r => console.log(`    MaNguoiDung=${r.MaNguoiDung}, ${r.TenDangNhap}, VaiTro=${r.TenVaiTro}`));
    }

    // LOAI_TIET_KIEM
    const ltk = await pool.request().query("SELECT * FROM LOAI_TIET_KIEM");
    if (ltk.recordset.length > 0) {
      console.log("\n  LOAI_TIET_KIEM:");
      ltk.recordset.forEach(r => console.log(`    MaLTK=${r.MaLTK}, ${r.TenLTK}, KyHan=${r.KyHan}, LaiSuat=${r.LaiSuat}`));
    }

    console.log("\n\n✅ Kiểm tra hoàn tất!");
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
  } finally {
    await closeDB();
    process.exit(0);
  }
}

checkDatabase();
