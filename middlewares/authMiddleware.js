const jwt = require('jsonwebtoken');
const User = require('../models/User'); // موديل المستخدم

// middlewares/authMiddleware.js
const { isTokenBlacklisted } = require('../services/authService');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: req.__('auth.token_missing') 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Vérifier si le token est dans la liste noire
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      return res.status(401).json({ 
        success: false, 
        message: req.__('auth.session_expired_relogin') 
      });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: req.__('auth.not_authorized') 
      });
    }

    req.user = user;

    // Apply saved language for authenticated users
    if (req.setLocale && user.language && ['en', 'ar', 'fr', 'et'].includes(user.language)) {
      req.setLocale(user.language);
      res.cookie('lang', user.language, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });
    }

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: req.__('auth.token_invalid') 
      });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: req.__('auth.token_expired') 
      });
    }
    next(err);
  }
};

module.exports = authMiddleware;
