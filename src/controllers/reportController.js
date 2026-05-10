const reportService = require("../services/reportService");
const asyncHandler = require("../utils/asyncHandler");

const dailyRevenue = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const data = await reportService.getDailyRevenue(date);
  return res.status(200).json({ success: true, data });
});

const monthlyOpenClose = asyncHandler(async (req, res) => {
  const { maLTK, month, year } = req.query;
  const data = await reportService.getMonthlyOpenClose(
    parseInt(maLTK), parseInt(month), parseInt(year)
  );
  return res.status(200).json({ success: true, data });
});

module.exports = { dailyRevenue, monthlyOpenClose };