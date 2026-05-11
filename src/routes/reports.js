const express = require("express");
const { dailyRevenue, monthlyOpenClose } = require("../controllers/reportController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/reports/daily-revenue", verifyToken, checkRole(["STAFF"]), dailyRevenue);
router.get("/reports/monthly-open-close", verifyToken, checkRole(["STAFF"]), monthlyOpenClose);

module.exports = router;
