const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

async function register({ name, email, password }) {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  return { user, token };
}

async function login({ email, password }) {
  // .select("+password") diperlukan karena di schema, password diset select: false
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user._id);

  return { user, token };
}

module.exports = { register, login };