const express = require("express");
const { login, register, logout, getMe } = require("../controllers/authController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/auth/login", login);
router.post("/auth/register", verifyToken, checkRole(["ADMIN"]), register);
router.post("/auth/logout", verifyToken, logout);
router.get("/auth/me", verifyToken, getMe);

module.exports = router;
