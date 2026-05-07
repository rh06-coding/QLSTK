const reportService = require("../services/reportService");

async function dailyRevenue(req, res, next) {
  try {
    const { date } = req.query;
    const data = await reportService.getDailyRevenue(date);
    return res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
}

async function monthlyOpenClose(req, res, next) {
  try {
    const { maLTK, month, year } = req.query;
    const data = await reportService.getMonthlyOpenClose(
      parseInt(maLTK), parseInt(month), parseInt(year)
    );
    return res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
}

module.exports = { dailyRevenue, monthlyOpenClose };