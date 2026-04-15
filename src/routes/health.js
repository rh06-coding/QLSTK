const express = require("express");
const { checkDBHealth } = require("../config/db");

const router = express.Router();

router.get("/health", async (req, res) => {
  try {
    await checkDBHealth();
    res.status(200).json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      message: error.message,
    });
  }
});

module.exports = router;
