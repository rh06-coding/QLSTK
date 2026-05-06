const regulationService = require("../services/regulationService");
const asyncHandler = require("../utils/asyncHandler");
const { validateRegulationPayload, validateUpdateRegulationPayload, validateId } = require("../utils/validators");

const getAll = asyncHandler(async (req, res) => {
  const data = await regulationService.getAllRegulations();
  return res.status(200).json({ success: true, data });
});

const create = asyncHandler(async (req, res) => {
  const payload = validateRegulationPayload(req.body);
  const result = await regulationService.createRegulation(payload);
  return res.status(201).json({
    success: true,
    message: "Tạo loại tiết kiệm thành công",
    data: result,
  });
});

const update = asyncHandler(async (req, res) => {
  const id = validateId(req.params.id);
  const payload = validateUpdateRegulationPayload(req.body);
  const data = await regulationService.updateRegulation(id, payload);
  return res.status(200).json({
    success: true,
    message: "Cập nhật loại tiết kiệm thành công",
    data,
  });
});

const remove = asyncHandler(async (req, res) => {
  const id = validateId(req.params.id);
  await regulationService.deleteRegulation(id);
  return res.status(200).json({
    success: true,
    message: "Xóa loại tiết kiệm thành công",
  });
});

module.exports = {
  getAll,
  create,
  update,
  remove,
};
