function errorHandler(err, req, res, next) {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

   if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

   if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field "${err.path}": ${err.value}`;
  }

   if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue).join(", ");
    message = `Duplicate value for field: ${field}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;