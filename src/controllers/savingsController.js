const savingsService = require("../services/savingsService");

async function getAll(req, res, next) {
  try {
    let data;

    if (req.user.TenVaiTro === "ADMIN") {
      // 👑 Admin thấy tất cả
      data = await savingsService.getAllSavings(); 
    } else {
      // 👤 User thường
      const MaKH = req.user.MaKH;
      data = await savingsService.getAllSavings(MaKH);
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const data = await savingsService.getSavingsById(req.params.maSTK);
    return res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
}

async function search(req, res, next) {
  try {
    const data = await savingsService.searchSavings(req.query);
    return res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
}

async function open(req, res, next) {
  try {
    const result = await savingsService.openSavings(req.body);
    return res.status(201).json({
      success: true,
      message: "Sổ tiết kiệm đã được tạo thành công",
      data: result,
    });
  } catch (error) { next(error); }
}

async function deposit(req, res, next) {
  try {
    const MaSTK = parseInt(req.params.maSTK);
    const result = await savingsService.depositMoney(MaSTK, req.body);
    return res.status(201).json({
      success: true,
      message: "Phiếu gửi tiền đã được tạo thành công",
      data: result,
    });
  } catch (error) { next(error); }
}

async function withdraw(req, res, next) {
  try {
    const MaSTK = parseInt(req.params.maSTK);
    const result = await savingsService.withdrawMoney(MaSTK, req.body);
    return res.status(201).json({
      success: true,
      message: "Phiếu rút tiền đã được tạo thành công",
      data: result,
    });
  } catch (error) { next(error); }
}

module.exports = { getAll, getById, search, open, deposit, withdraw };