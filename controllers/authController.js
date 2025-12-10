const authService = require("../services/authService");
const { registerValidation, loginValidation } = require('../validations/authValidation');

exports.register = async (req, res, next) => {
  try {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const result = await authService.register(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
exports.logout = async (req, res, next) => {
  try {
    const result = await authService.logout(req.user);
    res.json(result);
  } catch (err) {
    next(err);
  }
};