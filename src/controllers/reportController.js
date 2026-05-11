const reportService = require("../services/reportService");
const asyncHandler = require("../utils/asyncHandler");

const dailyRevenue = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const data = await reportService.getDailyRevenue(date);
  return res.status(200).json({ success: true, data });
});

const monthlyOpenClose = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const data = await reportService.getMonthlyOpenClose(parseInt(month, 10), parseInt(year, 10));
  return res.status(200).json({ success: true, data });
});

module.exports = { dailyRevenue, monthlyOpenClose };
