const express = require("express");
const {
  getByCustomer, search, open, deposit, withdraw
} = require("../controllers/savingsController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/savings/customers/:maKH", verifyToken, checkRole(["STAFF"]), getByCustomer);
router.get("/savings/search", verifyToken, checkRole(["STAFF"]), search);
router.post("/savings", verifyToken, checkRole(["STAFF"]), open);
router.post("/savings/:maSTK/deposits", verifyToken, checkRole(["STAFF"]), deposit);
router.post("/savings/:maSTK/withdrawals", verifyToken, checkRole(["STAFF"]), withdraw);

module.exports = router;
