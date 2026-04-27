const HttpError = require("./HttpError");

function validateLoginPayload(body) {
  const { username, password } = body || {};
  if (!username || !password) {
    throw new HttpError(400, "Vui lòng cung cấp đầy đủ username và password");
  }
  return { username, password };
}

function validateRegisterPayload(body) {
  const { username, password, MaVaiTro, MaKH } = body || {};
  if (!username || !password || !MaVaiTro) {
    throw new HttpError(400, "Vui lòng cung cấp đầy đủ username, password và MaVaiTro");
  }
  
  if (typeof username !== 'string' || typeof password !== 'string') {
    throw new HttpError(400, "Username và password phải là chuỗi");
  }
  
  return { username, password, MaVaiTro, MaKH };
}

function validateRegulationPayload(body) {
  const { KyHan, TenLTK, LaiSuat, SoTienGuiToiThieu, SoTienGuiThemToiThieu } = body || {};
  if (KyHan === undefined || !TenLTK || LaiSuat === undefined || SoTienGuiToiThieu === undefined || SoTienGuiThemToiThieu === undefined) {
    throw new HttpError(400, "Vui lòng cung cấp đầy đủ thông tin loại tiết kiệm");
  }
  if (KyHan < 0 || LaiSuat <= 0 || SoTienGuiToiThieu < 0 || SoTienGuiThemToiThieu < 0) {
    throw new HttpError(400, "Thông tin loại tiết kiệm không hợp lệ (số âm hoặc lãi suất <= 0)");
  }
  return { KyHan, TenLTK, LaiSuat, SoTienGuiToiThieu, SoTienGuiThemToiThieu };
}

function validateUpdateRegulationPayload(body) {
  const { LaiSuat, SoTienGuiToiThieu, SoTienGuiThemToiThieu } = body || {};
  if (LaiSuat === undefined || SoTienGuiToiThieu === undefined || SoTienGuiThemToiThieu === undefined) {
    throw new HttpError(400, "Vui lòng cung cấp đầy đủ LaiSuat, SoTienGuiToiThieu, SoTienGuiThemToiThieu");
  }
  if (LaiSuat <= 0 || SoTienGuiToiThieu < 0 || SoTienGuiThemToiThieu < 0) {
    throw new HttpError(400, "Thông tin loại tiết kiệm không hợp lệ (số âm hoặc lãi suất <= 0)");
  }
  return { LaiSuat, SoTienGuiToiThieu, SoTienGuiThemToiThieu };
}

function validateId(id) {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId) || parsedId <= 0) {
    throw new HttpError(400, "ID không hợp lệ");
  }
  return parsedId;
}

module.exports = {
  validateLoginPayload,
  validateRegisterPayload,
  validateRegulationPayload,
  validateUpdateRegulationPayload,
  validateId,
};
