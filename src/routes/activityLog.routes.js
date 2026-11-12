 const express = require("express");
const router = express.Router();

const activityLogController = require("../controllers/activityLog.controller");
const { protect } = require("../middlewares/auth.middleware");

// Semua route activity log harus login terlebih dahulu
router.use(protect);

router.get("/", activityLogController.getAllLogs);
router.get("/:id", activityLogController.getLogById);

module.exports = router;