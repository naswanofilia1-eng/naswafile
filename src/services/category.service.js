 
const mongoose = require("mongoose");

const Category = require("../models/category.model");
const Todo = require("../models/todo.model");
const activityLogService = require("./activityLog.service");

// ======================================
// HELPER ERROR
// ======================================
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// ======================================
// VALIDASI OBJECT ID
// ======================================
const validateObjectId = (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Category ID tidak valid", 400);
  }
};

// ======================================
// CREATE CATEGORY
// ======================================
const createCategory = async (data) => {
  const { name, description, userId } = data;

  if (!name || typeof name !== "string" || !name.trim()) {
    throw createError("Nama category wajib diisi", 400);
  }

  const existingCategory = await Category.findOne({
    name: name.trim(),
  });

  if (existingCategory) {
    throw createError("Category sudah tersedia", 409);
  }

  const category = await Category.create({
    name: name.trim(),
    description: description || "",
    created_by: userId || null,
    updated_by: userId || null,
  });

  await activityLogService.createLog({
    action: "CREATE",
    entity: "CATEGORY",
    entityId: category._id,
    userId,
    snapshot: {
      after: category.toObject(),
    },
  });

  return Category.findById(category._id)
    .populate("created_by", "name email")
    .populate("updated_by", "name email");
};

// ======================================
// GET ALL CATEGORIES
// ======================================
const getAllCategories = async () => {
  return Category.find()
    .populate("created_by", "name email")
    .populate("updated_by", "name email")
    .sort({ created_at: -1 });
};

// ======================================
// GET CATEGORY BY ID
// ======================================
const getCategoryById = async (id) => {
  validateObjectId(id);

  const category = await Category.findById(id)
    .populate("created_by", "name email")
    .populate("updated_by", "name email");

  if (!category) {
    throw createError("Category tidak ditemukan", 404);
  }

  return category;
};

// ======================================
// UPDATE CATEGORY
// ======================================
const updateCategory = async (id, data, userId) => {
  validateObjectId(id);

  const category = await Category.findById(id);

  if (!category) {
    throw createError("Category tidak ditemukan", 404);
  }

  const beforeSnapshot = category.toObject();

  if (data.name !== undefined) {
    if (typeof data.name !== "string" || !data.name.trim()) {
      throw createError("Nama category tidak boleh kosong", 400);
    }

    const existingCategory = await Category.findOne({
      name: data.name.trim(),
      _id: { $ne: id },
    });

    if (existingCategory) {
      throw createError("Nama category sudah digunakan", 409);
    }

    category.name = data.name.trim();
  }

  if (data.description !== undefined) {
    category.description = data.description;
  }

  if (userId) {
    category.updated_by = userId;
  }

  await category.save();

  await activityLogService.createLog({
    action: "UPDATE",
    entity: "CATEGORY",
    entityId: category._id,
    userId,
    snapshot: {
      before: beforeSnapshot,
      after: category.toObject(),
    },
  });

  return Category.findById(category._id)
    .populate("created_by", "name email")
    .populate("updated_by", "name email");
};

// ======================================
// DELETE CATEGORY
// ======================================
const deleteCategory = async (id, userId) => {
  validateObjectId(id);

  const category = await Category.findById(id);

  if (!category) {
    throw createError("Category tidak ditemukan", 404);
  }

  const beforeSnapshot = category.toObject();

  // Lepaskan relasi Category dari Todo
  await Todo.updateMany(
    { category: id },
    {
      $set: {
        category: null,
        ...(userId ? { updated_by: userId } : {}),
      },
    }
  );

  // Catat Activity Log sebelum Category dihapus
  await activityLogService.createLog({
    action: "DELETE",
    entity: "CATEGORY",
    entityId: category._id,
    userId,
    snapshot: {
      before: beforeSnapshot,
    },
  });

  await Category.findByIdAndDelete(id);

  return {
    message: "Category berhasil dihapus",
    data: category,
  };
};

// ======================================
// EXPORT
// ======================================
module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
