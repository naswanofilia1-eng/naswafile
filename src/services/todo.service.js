 
const mongoose = require("mongoose");

const Todo = require("../models/todo.model");
const Category = require("../models/category.model");
const activityLogService = require("./activityLog.service");

// ==========================================
// HELPER ERROR
// ==========================================
const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// ==========================================
// VALIDASI OBJECT ID
// ==========================================
const validateObjectId = (id, message) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw createError(message, 400);
  }
};

// ==========================================
// POPULATE TODO
// ==========================================
const populateTodo = (query) => {
  return query
    .populate("owner", "name email")
    .populate("category", "name description")
    .populate("created_by", "name email")
    .populate("updated_by", "name email");
};

// ==========================================
// CREATE TODO
// ==========================================
const createTodo = async (data) => {
  // Validasi title
  if (
    !data.title ||
    typeof data.title !== "string" ||
    !data.title.trim()
  ) {
    throw createError("Title wajib diisi", 400);
  }

  if (data.title.trim().length < 3 ||
      data.title.trim().length > 100) {
    throw createError(
      "Title harus 3 sampai 100 karakter",
      400
    );
  }

  // Validasi owner
  validateObjectId(data.owner, "Owner ID tidak valid");

  // Validasi description
  const description = data.description || "";

  if (typeof description !== "string" || description.length > 500) {
    throw createError(
      "Description maksimal 500 karakter",
      400
    );
  }

  // Validasi completed
  let completed = false;

  if (data.completed !== undefined) {
    if (
      data.completed !== true &&
      data.completed !== false &&
      data.completed !== "true" &&
      data.completed !== "false"
    ) {
      throw createError(
        "Completed harus true atau false",
        400
      );
    }

    completed =
      data.completed === true || data.completed === "true";
  }

  // Validasi Category
  let categoryId = null;

  if (data.category !== undefined &&
      data.category !== null &&
      data.category !== "") {
    validateObjectId(data.category, "Category ID tidak valid");

    const category = await Category.findById(data.category);

    if (!category) {
      throw createError("Category tidak ditemukan", 404);
    }

    categoryId = category._id;
  }

  // Simpan Todo
  const todo = await Todo.create({
    title: data.title.trim(),
    description: description.trim(),
    completed,
    owner: data.owner,
    category: categoryId,
    created_by: data.owner,
    updated_by: data.owner,
    archived: false,
  });

  // Ambil Todo dengan populate
  const result = await populateTodo(
    Todo.findById(todo._id)
  );

  if (!result) {
    throw createError("Todo gagal dibuat");
  }

  // Activity Log CREATE
  await activityLogService.createLog({
    action: "CREATE",
    entity: "TODO",
    entityId: todo._id,
    userId: data.owner,
    snapshot: {
      after: result.toObject(),
    },
  });

  return result;
};

// ==========================================
// GET ALL TODOS
// ==========================================
const getAllTodos = async (ownerId, filters = {}) => {
  validateObjectId(ownerId, "Owner ID tidak valid");

  // Pagination
  const page = Math.max(
    1,
    parseInt(filters.page, 10) || 1
  );

  const limit = Math.min(
    100,
    Math.max(1, parseInt(filters.limit, 10) || 10)
  );

  const skip = (page - 1) * limit;

  // Query dasar
  const query = {
    owner: ownerId,
    archived: { $ne: true },
  };

  // Filter completed
  if (
    filters.completed === true ||
    filters.completed === "true"
  ) {
    query.completed = true;
  } else if (
    filters.completed === false ||
    filters.completed === "false"
  ) {
    query.completed = false;
  }

  // Search berdasarkan title
  if (filters.search && String(filters.search).trim()) {
    const searchText = String(filters.search).trim();

    const escapedSearch = searchText.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    query.title = {
      $regex: escapedSearch,
      $options: "i",
    };
  }

  // Sorting
  const allowedSortFields = [
    "created_at",
    "updated_at",
    "title",
    "completed",
  ];

  const sortBy = allowedSortFields.includes(filters.sortBy)
    ? filters.sortBy
    : "created_at";

  const order =
    String(filters.order).toLowerCase() === "asc" ? 1 : -1;

  // Ambil data dan total secara bersamaan
  const [todos, total] = await Promise.all([
    populateTodo(Todo.find(query))
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit),

    Todo.countDocuments(query),
  ]);

  return {
    data: todos,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ==========================================
// GET ALL TODOS FOR ADMIN
// ==========================================
const getAllTodosForAdmin = async () => {
  return populateTodo(
    Todo.find({
      archived: { $ne: true },
    })
  ).sort({
    created_at: -1,
  });
};

// ==========================================
// GET TODO BY ID
// ==========================================
const getTodoById = async (id, ownerId) => {
  validateObjectId(id, "Todo ID tidak valid");

  const query = {
    _id: id,
    archived: { $ne: true },
  };

  if (ownerId) {
    validateObjectId(ownerId, "Owner ID tidak valid");
    query.owner = ownerId;
  }

  const todo = await populateTodo(
    Todo.findOne(query)
  );

  if (!todo) {
    throw createError("Todo tidak ditemukan", 404);
  }

  return todo;
};

// ==========================================
// UPDATE TODO
// ==========================================
const updateTodo = async (id, data, ownerId) => {
  validateObjectId(id, "Todo ID tidak valid");
  validateObjectId(ownerId, "Owner ID tidak valid");

  // Cari Todo milik user
  const existingTodo = await Todo.findOne({
    _id: id,
    owner: ownerId,
    archived: { $ne: true },
  });

  if (!existingTodo) {
    throw createError("Todo tidak ditemukan", 404);
  }

  // Snapshot sebelum perubahan
  const beforeSnapshot = existingTodo.toObject();

  const updateData = {};

  // Update title
  if (data.title !== undefined) {
    if (
      typeof data.title !== "string" ||
      !data.title.trim()
    ) {
      throw createError("Title tidak boleh kosong", 400);
    }

    const title = data.title.trim();

    if (title.length < 3 || title.length > 100) {
      throw createError(
        "Title harus 3 sampai 100 karakter",
        400
      );
    }

    updateData.title = title;
  }

  // Update description
  if (data.description !== undefined) {
    if (
      typeof data.description !== "string" ||
      data.description.length > 500
    ) {
      throw createError(
        "Description maksimal 500 karakter",
        400
      );
    }

    updateData.description = data.description.trim();
  }

  // Update completed
  if (data.completed !== undefined) {
    if (
      typeof data.completed !== "boolean" &&
      data.completed !== "true" &&
      data.completed !== "false"
    ) {
      throw createError(
        "Completed harus true atau false",
        400
      );
    }

    updateData.completed =
      data.completed === true || data.completed === "true";
  }

  // Update Category
  if (data.category !== undefined) {
    if (data.category === null || data.category === "") {
      updateData.category = null;
    } else {
      validateObjectId(
        data.category,
        "Category ID tidak valid"
      );

      const category = await Category.findById(data.category);

      if (!category) {
        throw createError("Category tidak ditemukan", 404);
      }

      updateData.category = category._id;
    }
  }

  // Review 3: catat user yang memperbarui
  updateData.updated_by = ownerId;

  // Update database
  const updatedTodo = await populateTodo(
    Todo.findOneAndUpdate(
      {
        _id: id,
        owner: ownerId,
        archived: { $ne: true },
      },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
  );

  if (!updatedTodo) {
    throw createError("Todo tidak ditemukan", 404);
  }

  // Activity Log UPDATE
  await activityLogService.createLog({
    action: "UPDATE",
    entity: "TODO",
    entityId: updatedTodo._id,
    userId: ownerId,
    snapshot: {
      before: beforeSnapshot,
      after: updatedTodo.toObject(),
    },
  });

  return updatedTodo;
};

// ==========================================
// DELETE TODO (SOFT DELETE / ARCHIVE)
// ==========================================
const deleteTodo = async (id, ownerId) => {
  validateObjectId(id, "Todo ID tidak valid");
  validateObjectId(ownerId, "Owner ID tidak valid");

  const todo = await populateTodo(
    Todo.findOne({
      _id: id,
      owner: ownerId,
      archived: { $ne: true },
    })
  );

  if (!todo) {
    throw createError("Todo tidak ditemukan", 404);
  }

  // Snapshot sebelum archive
  const beforeSnapshot = todo.toObject();

  // Archive Todo
  todo.archived = true;
  todo.updated_by = ownerId;

  await todo.save();

  // Ambil data setelah archive
  const archivedTodo = await populateTodo(
    Todo.findById(todo._id)
  );

  if (!archivedTodo) {
    throw createError("Todo gagal diarsipkan");
  }

  // Activity Log DELETE
  await activityLogService.createLog({
    action: "DELETE",
    entity: "TODO",
    entityId: todo._id,
    userId: ownerId,
    snapshot: {
      before: beforeSnapshot,
      after: archivedTodo.toObject(),
    },
  });

  return {
    message: "Todo berhasil diarsipkan",
    data: {
      _id: todo._id,
      archived: true,
    },
  };
};

// ==========================================
// SUMMARY STATISTICS
// ==========================================
const getSummaryStats = async (ownerId) => {
  const query = {
    archived: { $ne: true },
  };

  if (ownerId) {
    validateObjectId(ownerId, "Owner ID tidak valid");
    query.owner = ownerId;
  }

  const [total, completed, pending] = await Promise.all([
    Todo.countDocuments(query),

    Todo.countDocuments({
      ...query,
      completed: true,
    }),

    Todo.countDocuments({
      ...query,
      completed: false,
    }),
  ]);

  return {
    total,
    completed,
    pending,
  };
};

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  createTodo,
  getAllTodos,
  getAllTodosForAdmin,
  getTodoById,
  updateTodo,
  deleteTodo,
  getSummaryStats,
};
