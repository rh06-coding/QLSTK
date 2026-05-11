const express = require("express");
const { getAll, create, update, remove } = require("../controllers/regulationController");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/regulations", verifyToken, checkRole(["CEO", "STAFF"]), getAll);
router.post("/regulations", verifyToken, checkRole(["CEO"]), create);
router.put("/regulations/:id", verifyToken, checkRole(["CEO"]), update);
router.delete("/regulations/:id", verifyToken, checkRole(["CEO"]), remove);

module.exports = router;
