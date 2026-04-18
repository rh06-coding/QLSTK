const regulationService = require("../services/regulationService");

async function getAll(req, res, next) {
  try {
    const data = await regulationService.getAllRegulations();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const result = await regulationService.createRegulation(req.body);
    return res.status(201).json({
      success: true,
      message: "Tạo loại tiết kiệm thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const data = await regulationService.updateRegulation(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Cập nhật loại tiết kiệm thành công",
      data,
    });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await regulationService.deleteRegulation(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Xóa loại tiết kiệm thành công",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll,
  create,
  update,
  remove,
};
