const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const protect = catchAsync(async (req, res, next) => {
  let token;

  // Token dikirim lewat header: Authorization: Bearer 
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in. Please log in to get access", 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("The user belonging to this token no longer exists", 401));
  }

  // Simpan data user di req.user, supaya bisa dipakai di controller/middleware berikutnya
  req.user = currentUser;
  next();
});

module.exports = { protect };