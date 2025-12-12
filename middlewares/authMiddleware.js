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
        message: 'Aucun jeton fourni' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Vérifier si le token est dans la liste noire
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      return res.status(401).json({ 
        success: false, 
        message: 'Session expirée, veuillez vous reconnecter' 
      });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Non autorisé' 
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Jeton invalide' 
      });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Session expirée' 
      });
    }
    next(err);
  }
};

module.exports = authMiddleware;
