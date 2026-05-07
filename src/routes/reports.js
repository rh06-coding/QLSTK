const express = require("express");
const { dailyRevenue, monthlyOpenClose } = require("../controllers/reportController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/reports/daily-revenue", verifyToken, dailyRevenue);
router.get("/reports/monthly-open-close", verifyToken, monthlyOpenClose);

module.exports = router;