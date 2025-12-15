const Property = require('../models/Property');

// تحقق أن دور المستعمل واحد من الأدوار المسموح بها
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: req.__('common.unauthorized') });
    if (allowedRoles.includes(req.user.role)) return next();
    return res.status(403).json({ success: false, message: req.__('role.forbidden_insufficient') });
  };
};

// تحقق أن المستعمل مالك العقار أو لديه دور مسموح (مثلاً admin)
const authorizePropertyOwnerOrRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: req.__('common.unauthorized') });
      const property = await Property.findById(req.params.id).select('ownerId');
      if (!property) return res.status(404).json({ success: false, message: req.__('property.not_found') });

      const isOwner = property.ownerId && property.ownerId.equals(req.user._id);
      if (isOwner) return next();

      if (allowedRoles.includes(req.user.role)) return next();

      return res.status(403).json({ success: false, message: req.__('role.forbidden_not_owner') });
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { roleMiddleware, authorizePropertyOwnerOrRole };
