const savingsService = require("../services/savingsService");
const asyncHandler = require("../utils/asyncHandler");

const getAll = asyncHandler(async (req, res) => {
  let data;

  if (req.user.TenVaiTro === "ADMIN") {
    data = await savingsService.getAllSavings(); 
  } else {
    const MaKH = req.user.MaKH;
    data = await savingsService.getAllSavings(MaKH);
  }

  return res.status(200).json({ success: true, data });
});

const getById = asyncHandler(async (req, res) => {
  const data = await savingsService.getSavingsById(req.params.maSTK);
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
  const MaSTK = parseInt(req.params.maSTK);
  const result = await savingsService.depositMoney(MaSTK, req.body);
  return res.status(201).json({
    success: true,
    message: "Phiếu gửi tiền đã được tạo thành công",
    data: result,
  });
});

const withdraw = asyncHandler(async (req, res) => {
  const MaSTK = parseInt(req.params.maSTK);
  const result = await savingsService.withdrawMoney(MaSTK, req.body);
  return res.status(201).json({
    success: true,
    message: "Phiếu rút tiền đã được tạo thành công",
    data: result,
  });
});

module.exports = { getAll, getById, search, open, deposit, withdraw };