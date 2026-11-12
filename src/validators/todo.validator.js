 
const { body, param, query } = require("express-validator");

// ==========================================
// CREATE TODO
// ==========================================
const createTodoRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title wajib diisi")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title harus 3 sampai 100 karakter"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description maksimal 500 karakter"),

  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed harus true atau false"),

  body("category")
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId()
    .withMessage("Category ID tidak valid"),
];

// ==========================================
// UPDATE TODO
// ==========================================
const updateTodoRules = [
  param("id")
    .isMongoId()
    .withMessage("Todo ID tidak valid"),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title tidak boleh kosong")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title harus 3 sampai 100 karakter"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description maksimal 500 karakter"),

  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed harus true atau false"),

  body("category")
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId()
    .withMessage("Category ID tidak valid"),
];

// ==========================================
// GET TODO BY ID
// ==========================================
const getTodoByIdRules = [
  param("id")
    .isMongoId()
    .withMessage("Todo ID tidak valid"),
];

// ==========================================
// GET ALL TODOS
// ==========================================
const getAllTodosRules = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page harus berupa angka positif"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit harus antara 1 sampai 100"),

  query("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed harus true atau false"),

  query("search")
    .optional()
    .trim()
    .isString()
    .withMessage("Search harus berupa teks")
    .isLength({ max: 100 })
    .withMessage("Search maksimal 100 karakter"),

  query("sortBy")
    .optional()
    .isIn(["created_at", "updated_at", "title", "completed"])
    .withMessage("sortBy tidak valid"),

  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order harus asc atau desc"),
];

module.exports = {
  createTodoRules,
  updateTodoRules,
  getTodoByIdRules,
  getAllTodosRules,
};
