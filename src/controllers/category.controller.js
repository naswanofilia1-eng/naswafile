 
const categoryService = require("../services/category.service");

// Mengambil ID user yang sedang login
const getUserId = (req) => {
  const userId = req.user?.id || req.user?._id;

  if (!userId) {
    const error = new Error("User tidak ditemukan");
    error.statusCode = 401;
    throw error;
  }

  return userId;
};

// CREATE CATEGORY
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Nama category wajib diisi",
      });
    }

    const category = await categoryService.createCategory({
      name,
      description,
      userId: getUserId(req),
    });

    res.status(201).json({
      success: true,
      message: "Category berhasil dibuat",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL CATEGORIES
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// GET CATEGORY BY ID
const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE CATEGORY
const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body,
      getUserId(req)
    );

    res.status(200).json({
      success: true,
      message: "Category berhasil diperbarui",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE CATEGORY
const deleteCategory = async (req, res, next) => {
  try {
    const result = await categoryService.deleteCategory(
      req.params.id,
      getUserId(req)
    );

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
