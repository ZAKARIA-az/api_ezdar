const express = require('express');
const { getUpload } = require('../middlewares/uploadMiddleware');
const fileController = require('../controllers/fileController');

const router = express.Router();

router.post(
  '/',
  (req, res, next) => getUpload().single('file')(req, res, next),
  fileController.uploadFile
);

router.get('/:id', fileController.streamFile);

router.delete('/:id', fileController.deleteFile);

router.use(fileController.filesErrorHandler);

module.exports = router;
