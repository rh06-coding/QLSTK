const express = require("express");
const { getAll, create } = require("../controllers/customerController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/customers", verifyToken, getAll);
router.post("/customers", verifyToken, create);

module.exports = router;