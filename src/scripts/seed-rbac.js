require("dotenv").config();
const { sql, connectDB, closeDB } = require("../config/db");

const migrateRbacSql = `
IF OBJECT_ID(N'dbo.VAI_TRO', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.VAI_TRO (
    MaVaiTro INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    TenVaiTro VARCHAR(50) NOT NULL
  );
END;

IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = N'UX_VAI_TRO_TenVaiTro'
    AND object_id = OBJECT_ID(N'dbo.VAI_TRO')
)
BEGIN
  CREATE UNIQUE INDEX UX_VAI_TRO_TenVaiTro ON dbo.VAI_TRO(TenVaiTro);
END;

IF OBJECT_ID(N'dbo.CHUC_NANG', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.CHUC_NANG (
    MaChucNang INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    TenChucNang NVARCHAR(100) NOT NULL,
    URL VARCHAR(255) NOT NULL,
    Method VARCHAR(10) NOT NULL
  );
END;

IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = N'UX_CHUC_NANG_URL_Method'
    AND object_id = OBJECT_ID(N'dbo.CHUC_NANG')
)
BEGIN
  CREATE UNIQUE INDEX UX_CHUC_NANG_URL_Method ON dbo.CHUC_NANG(URL, Method);
END;

IF OBJECT_ID(N'dbo.PHAN_QUYEN', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.PHAN_QUYEN (
    MaVaiTro INT NOT NULL,
    MaChucNang INT NOT NULL,
    CONSTRAINT PK_PHAN_QUYEN PRIMARY KEY (MaVaiTro, MaChucNang),
    CONSTRAINT FK_PQ_VAITRO FOREIGN KEY (MaVaiTro) REFERENCES dbo.VAI_TRO(MaVaiTro),
    CONSTRAINT FK_PQ_CHUCNANG FOREIGN KEY (MaChucNang) REFERENCES dbo.CHUC_NANG(MaChucNang)
  );
END;
`;

const seedRbacSql = `
MERGE dbo.VAI_TRO AS target
USING (VALUES
  ('ADMIN'),
  ('NHAN_VIEN'),
  ('KHACH_HANG')
) AS source (TenVaiTro)
ON target.TenVaiTro = source.TenVaiTro
WHEN NOT MATCHED THEN
  INSERT (TenVaiTro) VALUES (source.TenVaiTro);

MERGE dbo.CHUC_NANG AS target
USING (VALUES
  (N'Health Check', '/api/health', 'GET'),
  (N'Dang nhap', '/api/auth/login', 'POST'),
  (N'Dang ky', '/api/auth/register', 'POST'),
  (N'Dang xuat', '/api/auth/logout', 'POST'),
  (N'Thong tin ca nhan', '/api/auth/me', 'GET'),
  (N'Xem danh sach loai tiet kiem', '/api/regulations', 'GET'),
  (N'Them loai tiet kiem', '/api/regulations', 'POST'),
  (N'Cap nhat loai tiet kiem', '/api/regulations/:id', 'PUT'),
  (N'Xoa loai tiet kiem', '/api/regulations/:id', 'DELETE'),
  (N'Tao so tiet kiem', '/api/savings', 'POST'),
  (N'Xem chi tiet so tiet kiem', '/api/savings/:id', 'GET'),
  (N'Gui tien vao so', '/api/savings/:id/deposit', 'POST'),
  (N'Rut tien khoi so', '/api/savings/:id/withdraw', 'POST')
) AS source (TenChucNang, URL, Method)
ON target.URL = source.URL AND target.Method = source.Method
WHEN NOT MATCHED THEN
  INSERT (TenChucNang, URL, Method)
  VALUES (source.TenChucNang, source.URL, source.Method)
WHEN MATCHED THEN
  UPDATE SET target.TenChucNang = source.TenChucNang;

;WITH RoleFunctionMatrix AS (
  SELECT 'ADMIN' AS TenVaiTro, '/api/health' AS URL, 'GET' AS Method UNION ALL
  SELECT 'ADMIN', '/api/auth/login', 'POST' UNION ALL
  SELECT 'ADMIN', '/api/auth/register', 'POST' UNION ALL
  SELECT 'ADMIN', '/api/auth/logout', 'POST' UNION ALL
  SELECT 'ADMIN', '/api/auth/me', 'GET' UNION ALL
  SELECT 'ADMIN', '/api/regulations', 'GET' UNION ALL
  SELECT 'ADMIN', '/api/regulations', 'POST' UNION ALL
  SELECT 'ADMIN', '/api/regulations/:id', 'PUT' UNION ALL
  SELECT 'ADMIN', '/api/regulations/:id', 'DELETE' UNION ALL
  SELECT 'ADMIN', '/api/savings', 'POST' UNION ALL
  SELECT 'ADMIN', '/api/savings/:id', 'GET' UNION ALL
  SELECT 'ADMIN', '/api/savings/:id/deposit', 'POST' UNION ALL
  SELECT 'ADMIN', '/api/savings/:id/withdraw', 'POST' UNION ALL

  SELECT 'NHAN_VIEN', '/api/health', 'GET' UNION ALL
  SELECT 'NHAN_VIEN', '/api/auth/login', 'POST' UNION ALL
  SELECT 'NHAN_VIEN', '/api/auth/logout', 'POST' UNION ALL
  SELECT 'NHAN_VIEN', '/api/auth/me', 'GET' UNION ALL
  SELECT 'NHAN_VIEN', '/api/regulations', 'GET' UNION ALL
  SELECT 'NHAN_VIEN', '/api/savings', 'POST' UNION ALL
  SELECT 'NHAN_VIEN', '/api/savings/:id', 'GET' UNION ALL
  SELECT 'NHAN_VIEN', '/api/savings/:id/deposit', 'POST' UNION ALL
  SELECT 'NHAN_VIEN', '/api/savings/:id/withdraw', 'POST' UNION ALL

  SELECT 'KHACH_HANG', '/api/health', 'GET' UNION ALL
  SELECT 'KHACH_HANG', '/api/auth/logout', 'POST' UNION ALL
  SELECT 'KHACH_HANG', '/api/auth/me', 'GET' UNION ALL
  SELECT 'KHACH_HANG', '/api/savings/:id', 'GET' UNION ALL
  SELECT 'KHACH_HANG', '/api/savings/:id/deposit', 'POST' UNION ALL
  SELECT 'KHACH_HANG', '/api/savings/:id/withdraw', 'POST'
)
INSERT INTO dbo.PHAN_QUYEN (MaVaiTro, MaChucNang)
SELECT DISTINCT v.MaVaiTro, c.MaChucNang
FROM RoleFunctionMatrix m
JOIN dbo.VAI_TRO v ON v.TenVaiTro = m.TenVaiTro
JOIN dbo.CHUC_NANG c ON c.URL = m.URL AND c.Method = m.Method
WHERE NOT EXISTS (
  SELECT 1
  FROM dbo.PHAN_QUYEN p
  WHERE p.MaVaiTro = v.MaVaiTro
    AND p.MaChucNang = c.MaChucNang
);
`;

async function migrateAndSeedRbac() {
  const pool = await connectDB();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const txRequest = new sql.Request(transaction);
    await txRequest.batch(migrateRbacSql);
    await txRequest.batch(seedRbacSql);

    await transaction.commit();

    const summaryRequest = pool.request();
    const summaryResult = await summaryRequest.query(`
      SELECT
        (SELECT COUNT(*) FROM dbo.VAI_TRO) AS roleCount,
        (SELECT COUNT(*) FROM dbo.CHUC_NANG) AS functionCount,
        (SELECT COUNT(*) FROM dbo.PHAN_QUYEN) AS permissionCount;
    `);

    const summary = summaryResult.recordset[0];
    console.log("RBAC migrate/seed completed.");
    console.log(`VAI_TRO: ${summary.roleCount}`);
    console.log(`CHUC_NANG: ${summary.functionCount}`);
    console.log(`PHAN_QUYEN: ${summary.permissionCount}`);
  } catch (error) {
    if (transaction._aborted !== true) {
      await transaction.rollback();
    }

    console.error("RBAC migrate/seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

migrateAndSeedRbac();
