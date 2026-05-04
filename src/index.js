require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const { connectDB, closeDB } = require("./config/db");
const healthRouter = require("./routes/health");
const authRouter = require("./routes/auth");
const regulationsRouter = require("./routes/regulations");
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

//securitystuff
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
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
app.use("/api", regulationsRouter);

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
