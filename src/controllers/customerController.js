const customerService = require("../services/customerService");
const asyncHandler = require("../utils/asyncHandler");

const getAll = asyncHandler(async (req, res) => {
  const data = await customerService.getAllCustomers();
  return res.status(200).json({ success: true, data });
});

const create = asyncHandler(async (req, res) => {
  const result = await customerService.createCustomer(req.body);
  return res.status(201).json({
    success: true,
    message: "Tạo khách hàng thành công",
    data: result,
  });
});

module.exports = { getAll, create };