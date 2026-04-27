const regulationService = require("../services/regulationService");
const { validateRegulationPayload, validateUpdateRegulationPayload, validateId } = require("../utils/validators");

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
    const payload = validateRegulationPayload(req.body);
    const result = await regulationService.createRegulation(payload);
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
    const id = validateId(req.params.id);
    const payload = validateUpdateRegulationPayload(req.body);
    const data = await regulationService.updateRegulation(id, payload);
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
    const id = validateId(req.params.id);
    await regulationService.deleteRegulation(id);
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
