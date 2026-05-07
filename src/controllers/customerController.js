const customerService = require("../services/customerService");

async function getAll(req, res, next) {
  try {
    const data = await customerService.getAllCustomers();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const result = await customerService.createCustomer(req.body);
    return res.status(201).json({
      success: true,
      message: "Tạo khách hàng thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, create };