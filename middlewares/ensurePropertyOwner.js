const mongoose = require('mongoose');
const Property = require('../models/Property');

const ensurePropertyOwner = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ success: false, message: req.__('property.invalid_id') });
    }

    const property = await Property.findById(propertyId).select('ownerId');
    if (!property) {
      return res.status(404).json({ success: false, message: req.__('property.not_found') });
    }

    if (!req.user || !property.ownerId || !property.ownerId.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: req.__('role.forbidden_not_owner') });
    }

    req.property = property;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = ensurePropertyOwner;
