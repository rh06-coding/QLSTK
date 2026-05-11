const HttpError = require("./HttpError");

function validateLoginPayload(body) {
  const { username, password } = body || {};
  if (!username || !password) {
    throw new HttpError(400, "Vui lòng cung cấp đầy đủ username và password");
  }
  return { username, password };
}

function validateRegisterPayload(body) {
  const { username, password, MaVaiTro } = body || {};
  if (!username || !password || !MaVaiTro) {
    throw new HttpError(400, "Vui lòng cung cấp đầy đủ username, password và MaVaiTro");
  }
  
  if (typeof username !== 'string' || typeof password !== 'string') {
    throw new HttpError(400, "Username và password phải là chuỗi");
  }
  
  const parsedRoleId = Number(MaVaiTro);
  if (!Number.isInteger(parsedRoleId) || parsedRoleId <= 0) {
    throw new HttpError(400, "Mã vai trò không hợp lệ");
  }
  
  return { username, password, MaVaiTro: parsedRoleId };
}

function validateRegulationPayload(body) {
  const {
    loai,
    KyHan,
    TenLTK,
    LaiSuat,
    SoTienGuiToiThieu,
    ThoiGianGuiToiThieu,
    SoTienGuiThemToiThieu,
  } = body || {};

  const normalizedLoai = (typeof loai === "string" ? loai.trim().toLowerCase() : "");
  const parsedKyHan = Number(KyHan);
  const parsedLaiSuat = Number(LaiSuat);
  const parsedSoTienGuiToiThieu = Number(SoTienGuiToiThieu);
  const parsedThoiGianGuiToiThieu =
    ThoiGianGuiToiThieu === undefined ? null : Number(ThoiGianGuiToiThieu);
  const parsedSoTienGuiThemToiThieu =
    SoTienGuiThemToiThieu === undefined ? null : Number(SoTienGuiThemToiThieu);

  if (
    !normalizedLoai ||
    KyHan === undefined ||
    !TenLTK ||
    LaiSuat === undefined ||
    SoTienGuiToiThieu === undefined
  ) {
    throw new HttpError(400, "Vui lòng cung cấp đầy đủ thông tin loại tiết kiệm");
  }

  if (!["co_ky_han", "khong_ky_han"].includes(normalizedLoai)) {
    throw new HttpError(400, "Loại tiết kiệm không hợp lệ");
  }

  if (!Number.isInteger(parsedKyHan) || parsedKyHan < 0) {
    throw new HttpError(400, "Kỳ hạn không hợp lệ");
  }

  if (normalizedLoai === "co_ky_han" && parsedKyHan <= 0) {
    throw new HttpError(400, "Loại có kỳ hạn yêu cầu KyHan > 0");
  }

  if (normalizedLoai === "khong_ky_han" && parsedKyHan !== 0) {
    throw new HttpError(400, "Loại không kỳ hạn yêu cầu KyHan = 0");
  }

  if (
    Number.isNaN(parsedLaiSuat) ||
    Number.isNaN(parsedSoTienGuiToiThieu) ||
    parsedLaiSuat <= 0 ||
    parsedSoTienGuiToiThieu < 0
  ) {
    throw new HttpError(400, "Thông tin loại tiết kiệm không hợp lệ (số âm hoặc lãi suất <= 0)");
  }

  if (parsedThoiGianGuiToiThieu !== null) {
    if (!Number.isInteger(parsedThoiGianGuiToiThieu) || parsedThoiGianGuiToiThieu < 0) {
      throw new HttpError(400, "ThoiGianGuiToiThieu không hợp lệ");
    }
  }

  if (parsedSoTienGuiThemToiThieu !== null) {
    if (!Number.isInteger(parsedSoTienGuiThemToiThieu) || parsedSoTienGuiThemToiThieu < 0) {
      throw new HttpError(400, "SoTienGuiThemToiThieu không hợp lệ");
    }
  }

  return {
    loai: normalizedLoai,
    KyHan: parsedKyHan,
    TenLTK,
    LaiSuat: parsedLaiSuat,
    SoTienGuiToiThieu: parsedSoTienGuiToiThieu,
    ThoiGianGuiToiThieu: parsedThoiGianGuiToiThieu,
    SoTienGuiThemToiThieu: parsedSoTienGuiThemToiThieu,
  };
}

function validateUpdateRegulationPayload(body) {
  const {
    loai,
    KyHan,
    TenLTK,
    LaiSuat,
    SoTienGuiToiThieu,
    ThoiGianGuiToiThieu,
    SoTienGuiThemToiThieu,
  } = body || {};

  const normalizedLoai = (typeof loai === "string" ? loai.trim().toLowerCase() : "");
  const parsedKyHan = Number(KyHan);
  const parsedLaiSuat = Number(LaiSuat);
  const parsedSoTienGuiToiThieu = Number(SoTienGuiToiThieu);
  const parsedThoiGianGuiToiThieu =
    ThoiGianGuiToiThieu === undefined ? null : Number(ThoiGianGuiToiThieu);
  const parsedSoTienGuiThemToiThieu =
    SoTienGuiThemToiThieu === undefined ? null : Number(SoTienGuiThemToiThieu);

  if (
    !normalizedLoai ||
    KyHan === undefined ||
    !TenLTK ||
    LaiSuat === undefined ||
    SoTienGuiToiThieu === undefined
  ) {
    throw new HttpError(400, "Vui lòng cung cấp đầy đủ thông tin loại tiết kiệm");
  }

  if (!["co_ky_han", "khong_ky_han"].includes(normalizedLoai)) {
    throw new HttpError(400, "Loại tiết kiệm không hợp lệ");
  }

  if (!Number.isInteger(parsedKyHan) || parsedKyHan < 0) {
    throw new HttpError(400, "Kỳ hạn không hợp lệ");
  }

  if (normalizedLoai === "co_ky_han" && parsedKyHan <= 0) {
    throw new HttpError(400, "Loại có kỳ hạn yêu cầu KyHan > 0");
  }

  if (normalizedLoai === "khong_ky_han" && parsedKyHan !== 0) {
    throw new HttpError(400, "Loại không kỳ hạn yêu cầu KyHan = 0");
  }

  if (
    Number.isNaN(parsedLaiSuat) ||
    Number.isNaN(parsedSoTienGuiToiThieu) ||
    parsedLaiSuat <= 0 ||
    parsedSoTienGuiToiThieu < 0
  ) {
    throw new HttpError(400, "Thông tin loại tiết kiệm không hợp lệ (số âm hoặc lãi suất <= 0)");
  }

  if (parsedThoiGianGuiToiThieu !== null) {
    if (!Number.isInteger(parsedThoiGianGuiToiThieu) || parsedThoiGianGuiToiThieu < 0) {
      throw new HttpError(400, "ThoiGianGuiToiThieu không hợp lệ");
    }
  }

  if (parsedSoTienGuiThemToiThieu !== null) {
    if (!Number.isInteger(parsedSoTienGuiThemToiThieu) || parsedSoTienGuiThemToiThieu < 0) {
      throw new HttpError(400, "SoTienGuiThemToiThieu không hợp lệ");
    }
  }

  return {
    loai: normalizedLoai,
    KyHan: parsedKyHan,
    TenLTK,
    LaiSuat: parsedLaiSuat,
    SoTienGuiToiThieu: parsedSoTienGuiToiThieu,
    ThoiGianGuiToiThieu: parsedThoiGianGuiToiThieu,
    SoTienGuiThemToiThieu: parsedSoTienGuiThemToiThieu,
  };
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
