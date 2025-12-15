const router = require('express').Router();
const languageController = require('../controllers/languageController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, languageController.getLanguage);
router.put('/', authMiddleware, languageController.updateLanguage);

module.exports = router;
