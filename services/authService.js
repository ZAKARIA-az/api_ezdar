const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.register = async (data) => {
  const { fullName, email, password, role } = data;

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("Email already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName, email, password: hashed, role
  });

  return { user, token: generateToken(user._id) };
};

exports.login = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  return { user, token: generateToken(user._id) };
};

exports.logout = async (user) => {
  // Implement logout logic if needed (e.g., token invalidation)
  return { success: true, message: "Logged out successfully" };
};