const express = require("express");
const { getAll } = require("../controllers/roleController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/roles", verifyToken, getAll);

module.exports = router;
