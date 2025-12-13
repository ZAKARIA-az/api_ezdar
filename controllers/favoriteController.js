const favoriteService = require("../services/favoriteService");

// Ajouter un bien aux favoris
exports.addToFavorites = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user._id;

    const favorite = await favoriteService.addToFavorites(userId, propertyId);
    res.status(200).json({
      success: true,
      message: 'تمت الإضافة إلى المفضلة بنجاح',
      data: favorite
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
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
      message: 'تمت الإزالة من المفضلة بنجاح'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
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
      message: 'تم حذف جميع المفضلة بنجاح'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
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
      message: 'تم جلب المفضلة بنجاح',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
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
      message: 'تم التحقق من المفضلة بنجاح',
      data: { isFavorite }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};