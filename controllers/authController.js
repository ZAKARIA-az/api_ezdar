const authService = require("../services/authService");
const { registerValidation, loginValidation } = require('../validations/authValidation');

exports.register = async (req, res, next) => {
  try {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const result = await authService.register(req.body);
    res.json(result);
  } catch (err) {
    if (err && typeof err.message === 'string' && err.message.startsWith('auth.')) {
      return res.status(400).json({ success: false, message: req.__(err.message) });
    }
    return res.status(500).json({ success: false, message: req.__('common.server_error') });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    if (err && typeof err.message === 'string' && err.message.startsWith('auth.')) {
      return res.status(400).json({ success: false, message: req.__(err.message) });
    }
    return res.status(500).json({ success: false, message: req.__('common.server_error') });
  }
};

// controllers/authController.js
exports.logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ 
        success: false, 
        message: req.__('auth.token_missing') 
      });
    }

    const token = authHeader.split(' ')[1];

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: req.__('auth.not_authenticated')
      });
    }

    const result = await authService.logout(req.user, token);
    if (result && result.messageKey) {
      const { messageKey, ...rest } = result;
      return res.json({ ...rest, message: req.__(messageKey) });
    }
    return res.json(result);
  } catch (err) {
    if (err && typeof err.message === 'string' && err.message.startsWith('auth.')) {
      return res.status(400).json({ success: false, message: req.__(err.message) });
    }
    return res.status(500).json({ success: false, message: req.__('common.server_error') });
  }
};
