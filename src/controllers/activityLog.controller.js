 
const activityLogService = require("../services/activityLog.service");

// ======================================
// GET ALL ACTIVITY LOGS
// ======================================
const getAllLogs = async (req, res, next) => {
  try {
    const result = await activityLogService.getAllLogs(
      req.query
    );

    res.status(200).json({
      success: true,
      message: "Activity logs berhasil diambil",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// GET ACTIVITY LOG BY ID
// ======================================
const getLogById = async (req, res, next) => {
  try {
    const log = await activityLogService.getLogById(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Activity log berhasil ditemukan",
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// EXPORT
// ======================================
module.exports = {
  getAllLogs,
  getLogById,
};
