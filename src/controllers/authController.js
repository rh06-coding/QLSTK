const HttpError = require("../utils/HttpError");
const asyncHandler = require("../utils/asyncHandler");
const {
  loginWithCredentials,
  registerUser,
  getUserById,
} = require("../services/authService");
const { validateLoginPayload, validateRegisterPayload } = require("../utils/validators");

const login = asyncHandler(async (req, res) => {
  const credentials = validateLoginPayload(req.body);
  const authData = await loginWithCredentials(credentials);

  return res.status(200).json({
    success: true,
    data: authData,
  });
});

const register = asyncHandler(async (req, res) => {
  const payload = validateRegisterPayload(req.body);
  const result = await registerUser(payload);

  return res.status(201).json({
    success: true,
    message: "Tạo tài khoản thành công",
    data: result,
  });
});

const logout = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Đăng xuất thành công",
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.MaNguoiDung);
  if (!user) {
    throw new HttpError(404, "Không tìm thấy người dùng");
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = {
  login,
  register,
  logout,
  getMe,
};
