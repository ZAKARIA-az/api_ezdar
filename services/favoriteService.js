const Favorite = require("../models/Favorite");
const Property = require("../models/Property");

exports.addToFavorites = async (userId, propertyId) => {
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new Error("favorites.errors.property_not_found");
  }

  const existingFavorite = await Favorite.findOne({ userId, propertyId });
  if (existingFavorite) {
    throw new Error("favorites.errors.already_exists");
  }

  const favorite = new Favorite({ userId, propertyId });
  return await favorite.save();
};

exports.removeFromFavorites = async (userId, propertyId) => {
  const favorite = await Favorite.findOneAndDelete({ userId, propertyId });
  if (!favorite) {
    throw new Error("favorites.errors.not_in_favorites");
  }
  return favorite;
};

exports.removeAllFavorites = async (userId) => {
  const result = await Favorite.deleteMany({ userId });
  return result;
};

exports.getUserFavorites = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const [favorites, total] = await Promise.all([
    Favorite.find({ userId })
      .populate('propertyId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Favorite.countDocuments({ userId })
  ]);

  return {
    data: favorites.map(fav => fav.propertyId),
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

exports.isFavorite = async (userId, propertyId) => {
  const favorite = await Favorite.findOne({ userId, propertyId });
  return !!favorite;
};