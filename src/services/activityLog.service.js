 
const mongoose = require("mongoose");
const ActivityLog = require("../models/activityLog.model");

// ==========================================
// VALIDASI OBJECT ID
// ==========================================
const validateObjectId = (id, message) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(message);
    error.statusCode = 400;
    throw error;
  }
};

// ==========================================
// CREATE ACTIVITY LOG
// ==========================================
const createLog = async ({
  action,
  entity,
  entityId,
  userId,
  snapshot,
}) => {
  validateObjectId(entityId, "Entity ID tidak valid");

  if (userId) {
    validateObjectId(userId, "User ID tidak valid");
  }

  return ActivityLog.create({
    action,
    entity,
    entityId,
    userId: userId || null,
    snapshot: snapshot || {},
  });
};

// ==========================================
// GET ALL ACTIVITY LOGS
// ==========================================
const getAllLogs = async (filters = {}) => {
  const page = Math.max(
    1,
    parseInt(filters.page, 10) || 1
  );

  const limit = Math.min(
    100,
    Math.max(1, parseInt(filters.limit, 10) || 10)
  );

  const query = {};

  // FILTER ACTION
  if (filters.action) {
    const action = String(filters.action).toUpperCase();

    if (!["CREATE", "UPDATE", "DELETE"].includes(action)) {
      const error = new Error("Action tidak valid");
      error.statusCode = 400;
      throw error;
    }

    query.action = action;
  }

  // FILTER ENTITY
  if (filters.entity) {
    const entity = String(filters.entity).toUpperCase();

    if (!["TODO", "CATEGORY"].includes(entity)) {
      const error = new Error("Entity tidak valid");
      error.statusCode = 400;
      throw error;
    }

    query.entity = entity;
  }

  // FILTER ENTITY ID
  if (filters.entityId) {
    validateObjectId(
      filters.entityId,
      "Entity ID tidak valid"
    );

    query.entityId = filters.entityId;
  }

  // AMBIL DATA DAN TOTAL
  const [logs, total] = await Promise.all([
    ActivityLog.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),

    ActivityLog.countDocuments(query),
  ]);

  return {
    data: logs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ==========================================
// GET ACTIVITY LOG BY ID
// ==========================================
const getLogById = async (id) => {
  validateObjectId(id, "Activity Log ID tidak valid");

  const log = await ActivityLog.findById(id)
    .populate("userId", "name email");

  if (!log) {
    const error = new Error(
      "Activity log tidak ditemukan"
    );
    error.statusCode = 404;
    throw error;
  }

  return log;
};

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  createLog,
  getAllLogs,
  getLogById,
};
