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

// controllers/authController.js
exports.logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucun jeton fourni' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Vérifier si req.user est défini
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Utilisateur non authentifié'
      });
    }
    
    const result = await authService.logout(req.user, token);
    res.json(result);
  } catch (err) {
    console.error('Erreur dans le contrôleur de déconnexion:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Erreur lors de la déconnexion'
    });
  }
};