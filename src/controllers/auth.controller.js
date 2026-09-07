const authService = require("../services/auth.service");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("Name, email, and password are required", 400));
  }

  const { user, token } = await authService.register({ name, email, password });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  const { user, token } = await authService.login({ email, password });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    },
  });
});

module.exports = { register, login };