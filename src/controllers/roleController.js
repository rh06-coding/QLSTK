const asyncHandler = require("../utils/asyncHandler");
const roleService = require("../services/roleService");

const getAll = asyncHandler(async (req, res) => {
  const data = await roleService.getAllRoles();
  return res.status(200).json({ success: true, data });
});

module.exports = { getAll };
