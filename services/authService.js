const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const BlacklistToken = require('../models/blacklist');
const jwt = require('jsonwebtoken');

exports.register = async (data) => {
  const { fullName, email, password, role } = data;

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("auth.user_exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName, email, password: hashed, role
  });

  return { user, token: generateToken(user._id) };
};

exports.login = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) throw new Error("auth.invalid_credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("auth.invalid_credentials");

  return { user, token: generateToken(user._id) };
};

exports.logout = async (user, token) => {
  try {
    if (!token) {
      throw new Error('auth.token_missing');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!user || !user._id) {
      throw new Error('auth.user_info_missing');
    }

    const blacklistToken = new BlacklistToken({
      token,
      user: user._id,
      expiresAt: new Date(decoded.exp * 1000)
    });

    await blacklistToken.save();

    return {
      success: true,
      messageKey: "auth.logout_success"
    };
  } catch (error) {
    if (error && typeof error.message === 'string' && error.message.startsWith('auth.')) {
      throw error;
    }
    throw new Error('auth.logout_failed');
  }
};

exports.isTokenBlacklisted = async (token) => {
  const blacklistedToken = await BlacklistToken.findOne({ token });
  return !!blacklistedToken;
};
