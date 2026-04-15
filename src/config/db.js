const sql = require("mssql");

const rawServer = process.env.DB_SERVER || process.env.DB_HOST || "";
const serverParts = rawServer.split("\\");
const serverHost = serverParts[0];
const instanceName = process.env.DB_INSTANCE || serverParts[1];

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || process.env.DB_PASS,
  server: serverHost,
  database: process.env.DB_NAME,
  port: instanceName ? undefined : Number(process.env.DB_PORT || 1433),
  options: {
    instanceName,
    encrypt: (process.env.DB_ENCRYPT || "false").toLowerCase() === "true",
    trustServerCertificate:
      (process.env.DB_TRUST_SERVER_CERT || "true").toLowerCase() === "true",
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool;
let connectingPromise;

async function connectDB() {
  if (pool && pool.connected) {
    return pool;
  }

  if (connectingPromise) {
    return connectingPromise;
  }

  connectingPromise = sql
    .connect(dbConfig)
    .then((connectedPool) => {
      pool = connectedPool;
      return pool;
    })
    .finally(() => {
      connectingPromise = null;
    });
  return connectingPromise;
}

async function closeDB() {
  if (!pool) return;

  await pool.close();
  pool = null;

  if (sql.connected) {
    await sql.close();
  }

  connectingPromise = null;
}

async function checkDBHealth() {
  const activePool = await connectDB();
  await activePool.request().query("SELECT 1 AS ok");
  return pool;
}

function getPool() {
  if (!pool) {
    throw new Error("Database pool không được khởi tạo. Vui lòng gọi connectDB() trước.");
  }
  return pool;
}

module.exports = {
  sql,
  connectDB,
  closeDB,
  checkDBHealth,
  getPool,
};
