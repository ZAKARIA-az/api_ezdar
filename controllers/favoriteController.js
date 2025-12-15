const favoriteService = require("../services/favoriteService");

// Ajouter un bien aux favoris
exports.addToFavorites = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user._id;

    const favorite = await favoriteService.addToFavorites(userId, propertyId);
    res.status(200).json({
      success: true,
      message: req.__('favorites.add_success'),
      data: favorite
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error && typeof error.message === 'string') ? req.__(error.message) : req.__('common.server_error')
    });
  }
};

// Supprimer un bien des favoris
exports.removeFromFavorites = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user._id;

    await favoriteService.removeFromFavorites(userId, propertyId);
    res.status(200).json({
      success: true,
      message: req.__('favorites.remove_success')
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error && typeof error.message === 'string') ? req.__(error.message) : req.__('common.server_error')
    });
  }
};

// Supprimer tous les favoris d'un utilisateur
exports.removeAllFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    await favoriteService.removeAllFavorites(userId);
    
    res.status(200).json({
      success: true,
      message: req.__('favorites.remove_all_success')
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error && typeof error.message === 'string') ? req.__(error.message) : req.__('common.server_error')
    });
  }
};

// Obtenir la liste des favoris d'un utilisateur
exports.getUserFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await favoriteService.getUserFavorites(userId, page, limit);
    res.status(200).json({
      success: true,
      message: req.__('favorites.fetch_success'),
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error && typeof error.message === 'string') ? req.__(error.message) : req.__('common.server_error')
    });
  }
};

// Vérifier si un bien est dans les favoris
exports.checkIfFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user._id;

    const isFavorite = await favoriteService.isFavorite(userId, propertyId);
    res.status(200).json({
      success: true,
      message: req.__('favorites.check_success'),
      data: { isFavorite }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: (error && typeof error.message === 'string') ? req.__(error.message) : req.__('common.server_error')
    });
  }
};