const HttpError = require("../utils/HttpError");
const {
  loginWithCredentials,
  validateLoginPayload,
  registerUser,
  getUserById,
} = require("../services/authService");

async function login(req, res, next) {
  try {
    const credentials = validateLoginPayload(req.body);
    const authData = await loginWithCredentials(credentials);

    return res.status(200).json({
      success: true,
      data: authData,
    });
  } catch (error) {
    next(error);
  }
}

async function register(req, res, next) {
  try {
    const { username, password, MaVaiTro, MaKH } = req.body;
    if (!username || !password || !MaVaiTro) {
      throw new HttpError(400, "Vui lòng cung cấp đầy đủ username, password và MaVaiTro");
    }

    const result = await registerUser({ username, password, MaVaiTro, MaKH });
    
    return res.status(201).json({
      success: true,
      message: "Tạo tài khoản thành công",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res) {
  return res.status(200).json({
    success: true,
    message: "Đăng xuất thành công",
  });
}

async function getMe(req, res, next) {
  try {
    const user = await getUserById(req.user.MaNguoiDung);
    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }
    
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  register,
  logout,
  getMe,
};
