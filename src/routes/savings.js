const express = require("express");
const {
  getAll, getById, search, open, deposit, withdraw
} = require("../controllers/savingsController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/savings", verifyToken, getAll);
router.get("/savings/search", verifyToken, search);    // ⚠️ TRƯỚC /:maSTK
router.get("/savings/:maSTK", verifyToken, getById);
router.post("/savings", verifyToken, open);
router.post("/savings/:maSTK/deposits", verifyToken, deposit);
router.post("/savings/:maSTK/withdrawals", verifyToken, withdraw);

module.exports = router;