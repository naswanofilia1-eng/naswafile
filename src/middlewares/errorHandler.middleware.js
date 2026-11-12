 function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // MONGOOSE VALIDATION ERROR
  if (err.name === "ValidationError") {
    statusCode = 400;

    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  // MONGOOSE CAST ERROR
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field "${err.path}"`;
  }

  // DUPLICATE DATA ERROR
  if (err.code === 11000) {
    statusCode = 409;

    const field = Object.keys(err.keyValue || {}).join(", ");

    message = `Duplicate value for field: ${field || "unknown"}`;
  }

  // INTERNAL SERVER ERROR
  if (statusCode >= 500) {
    console.error(err);

    message = "Internal Server Error";
  }

  // RESPONSE
  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;