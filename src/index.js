require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const { connectDB, closeDB } = require("./config/db");
const healthRouter = require("./routes/health");
const authRouter = require("./routes/auth");
const rolesRouter = require("./routes/roles");
const regulationsRouter = require("./routes/regulations");
const savingsRouter = require("./routes/savings");
const reportsRouter = require("./routes/reports");
const errorHandler = require("./middlewares/errorHandler");

//checkenv
const REQUIRED_ENV = ["JWT_SECRET", "DB_USER", "DB_NAME"];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`Biến môi trường bắt buộc '${key}' chưa được cấu hình. Kiểm tra file .env`);
    process.exit(1);
  }
}

const app = express();
const port = Number(process.env.PORT || 3000);

const defaultCorsOrigins = [
  "https://cnpmbank.mhoang26ct.workers.dev",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
];

const allowedOrigins = (process.env.CORS_ORIGIN || defaultCorsOrigins.join(","))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

//securitystuff
app.use(helmet());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS Blocked for origin: ${origin}`);
      callback(new Error("Origin không được phép bởi CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

//limitbruteforce
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15mins
  max: 20, //max20reqs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút",
  },
});

//configbodylimit
app.use(express.json({ limit: "10kb" }));

//endpoints
app.use("/api", healthRouter);
app.use("/api/auth", authLimiter);
app.use("/api", authRouter);
app.use("/api", rolesRouter);
app.use("/api", regulationsRouter);
app.use("/api", savingsRouter);
app.use("/api", reportsRouter);

app.get("/", (req, res) => {
  res.json({
    service: "QuanLySoTietKiem API",
    status: "running",
  });
});

//handleerrors
app.use(errorHandler);

let server;

async function startServer() {
  await connectDB();
  console.log("SQL Server được kết nối.");

  server = app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
  });
}

async function shutdown(signal) {
  console.log(`${signal} được nhận, đang tắt server...`);

  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  await closeDB();
  console.log("SQL Server pool đã được đóng.");
  process.exit(0);
}

process.on("SIGINT", () => {
  shutdown("SIGINT").catch((error) => {
    console.error("Lỗi khi tắt server:", error.message);
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM").catch((error) => {
    console.error("Lỗi khi tắt server:", error.message);
    process.exit(1);
  });
});

startServer().catch((error) => {
  console.error("Lỗi khi khởi động server:", error.message);
  process.exit(1);
});
