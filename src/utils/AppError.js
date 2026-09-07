class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // menandai ini error yang "diketahui/disengaja", bukan bug tak terduga

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;