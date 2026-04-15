const {
  HttpError,
  loginWithCredentials,
  validateLoginPayload,
} = require("../services/authService");

async function login(req, res) {
  try {
    const credentials = validateLoginPayload(req.body);
    const authData = await loginWithCredentials(credentials);

    return res.status(200).json({
      success: true,
      data: authData,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Đăng nhập thất bại",
    });
  }
}

module.exports = {
  login,
};
