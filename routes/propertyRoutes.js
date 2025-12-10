const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const authMiddleware = require('../middlewares/authMiddleware');
const { roleMiddleware, authorizePropertyOwnerOrRole } = require('../middlewares/roleMiddleware');
const role=require('../role');

router.get('/', authMiddleware,roleMiddleware('user','owner'),propertyController.getAllProperties); // عام
router.get('/:id', propertyController.getPropertyById);

// إنشاء: محمي للمُلاّك أو الادمن
router.post('/', authMiddleware, roleMiddleware('owner'), propertyController.createProperty);

// تحديث: محمي — المالك أو ادمن
router.put('/:id', authMiddleware, authorizePropertyOwnerOrRole('admin'), propertyController.updateProperty);

// حذف: محمي — المالك أو ادمن
router.delete('/:id', authMiddleware, authorizePropertyOwnerOrRole('admin'), propertyController.deleteProperty);

module.exports = router;