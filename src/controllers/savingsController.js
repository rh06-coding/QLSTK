const savingsService = require("../services/savingsService");
const asyncHandler = require("../utils/asyncHandler");

const getByCustomer = asyncHandler(async (req, res) => {
  const MaKH = parseInt(req.params.maKH, 10);
  const data = await savingsService.getSavingsByCustomerId(MaKH);
  return res.status(200).json({ success: true, data });
});

const search = asyncHandler(async (req, res) => {
  const data = await savingsService.searchSavings(req.query);
  return res.status(200).json({ success: true, data });
});

const open = asyncHandler(async (req, res) => {
  const result = await savingsService.openSavings(req.body);
  return res.status(201).json({
    success: true,
    message: "Sổ tiết kiệm đã được tạo thành công",
    data: result,
  });
});

const deposit = asyncHandler(async (req, res) => {
  const MaSTK = parseInt(req.params.maSTK, 10);
  const result = await savingsService.depositMoney(MaSTK, req.body);
  return res.status(201).json({
    success: true,
    message: "Phiếu gửi tiền đã được tạo thành công",
    data: result,
  });
});

const withdraw = asyncHandler(async (req, res) => {
  const MaSTK = parseInt(req.params.maSTK, 10);
  const result = await savingsService.withdrawMoney(MaSTK, req.body);
  return res.status(201).json({
    success: true,
    message: "Phiếu rút tiền đã được tạo thành công",
    data: result,
  });
});

module.exports = { getByCustomer, search, open, deposit, withdraw };
