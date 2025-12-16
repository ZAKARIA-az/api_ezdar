const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const authMiddleware = require('../middlewares/authMiddleware');
const { roleMiddleware, authorizePropertyOwnerOrRole } = require('../middlewares/roleMiddleware');
const { getPropertyImagesUpload } = require('../middlewares/propertyImagesUploadMiddleware');
const role=require('../role');

router.get('/',propertyController.getAllProperties); // عام
router.get('/:id', propertyController.getPropertyById);

// إنشاء: محمي للمُلاّك أو الادمن
router.post('/', authMiddleware, roleMiddleware(role.OWNER), propertyController.createProperty);

// رفع صور: محمي — المالك فقط
router.post(
  '/:id/images',
  authMiddleware,
  (req, res, next) => {
    getPropertyImagesUpload().array('images', 10)(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ success: false, message: req.__('property.images.too_large') });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ success: false, message: req.__('property.images.too_many') });
        }
        if (err && typeof err.message === 'string' && err.message.startsWith('property.images.')) {
          return res.status(err.status || 400).json({ success: false, message: req.__(err.message) });
        }
        return next(err);
      }
      return next();
    });
  },
  propertyController.addPropertyImages
);

// حذف صورة واحدة: محمي — المالك فقط
router.delete(
  '/:id/images/:fileId',
  authMiddleware,
  propertyController.deletePropertyImage
);

// تحديث: محمي — المالك أو ادمن
router.put('/:id', authMiddleware, authorizePropertyOwnerOrRole(role.OWNER), propertyController.updateProperty);

// حذف: محمي — المالك أو ادمن
router.delete('/:id', authMiddleware, authorizePropertyOwnerOrRole(role.OWNER), propertyController.deleteProperty);

module.exports = router;