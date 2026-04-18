const express = require("express");
const { getAll, create, update, remove } = require("../controllers/regulationController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/regulations", verifyToken, getAll);
router.post("/regulations", verifyToken, checkRole(["ADMIN"]), create);
router.put("/regulations/:id", verifyToken, checkRole(["ADMIN"]), update);
router.delete("/regulations/:id", verifyToken, checkRole(["ADMIN"]), remove);

module.exports = router;
