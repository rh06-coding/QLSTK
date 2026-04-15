require("dotenv").config();
const express = require("express");
const { connectDB, closeDB } = require("./config/db");
const healthRouter = require("./routes/health");
const authRouter = require("./routes/auth");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());
app.use("/api", healthRouter);
app.use("/api", authRouter);

app.get("/", (req, res) => {
  res.json({
    service: "QuanLySoTietKiem API",
    status: "running",
  });
});

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
