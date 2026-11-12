 const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/category.controller");
const { protect } = require("../middlewares/auth.middleware");

// Semua route category harus login terlebih dahulu
router.use(protect);

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;