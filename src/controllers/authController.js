const HttpError = require("../utils/HttpError");
const {
  loginWithCredentials,
  registerUser,
  getUserById,
} = require("../services/authService");
const { validateLoginPayload, validateRegisterPayload } = require("../utils/validators");

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
    const payload = validateRegisterPayload(req.body);
    const result = await registerUser(payload);
    
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
