 
const todoService = require("../services/todo.service");

// ==========================================
// MENGAMBIL ID USER YANG LOGIN
// ==========================================
const getUserId = (req) => {
  const userId = req.user?.id || req.user?._id;

  if (!userId) {
    const error = new Error("User tidak ditemukan");
    error.statusCode = 401;
    throw error;
  }

  return userId;
};

// ==========================================
// CREATE TODO
// ==========================================
const createTodo = async (req, res, next) => {
  try {
    const ownerId = getUserId(req);

    const todo = await todoService.createTodo({
      ...req.body,
      owner: ownerId,
    });

    res.status(201).json({
      success: true,
      message: "Todo berhasil dibuat",
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET ALL TODOS
// ==========================================
const getAllTodos = async (req, res, next) => {
  try {
    const ownerId = getUserId(req);

    const result = await todoService.getAllTodos(ownerId, {
      page: req.query.page,
      limit: req.query.limit,
      completed: req.query.completed,
      sortBy: req.query.sortBy,
      order: req.query.order,
      search: req.query.search,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET TODO BY ID
// ==========================================
const getTodoById = async (req, res, next) => {
  try {
    const ownerId = getUserId(req);

    const todo = await todoService.getTodoById(
      req.params.id,
      ownerId
    );

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE TODO
// ==========================================
const updateTodo = async (req, res, next) => {
  try {
    const ownerId = getUserId(req);

    const todo = await todoService.updateTodo(
      req.params.id,
      req.body,
      ownerId
    );

    res.status(200).json({
      success: true,
      message: "Todo berhasil diperbarui",
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// DELETE / ARCHIVE TODO
// ==========================================
const deleteTodo = async (req, res, next) => {
  try {
    const ownerId = getUserId(req);

    const result = await todoService.deleteTodo(
      req.params.id,
      ownerId
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
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
