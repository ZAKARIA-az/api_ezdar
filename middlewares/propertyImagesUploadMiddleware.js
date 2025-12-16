const multer = require('multer');
const { getGridFsStorage } = require('../config/gridfs');

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg']);

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    const err = new Error('property.images.invalid_type');
    err.status = 400;
    return cb(err);
  }
  return cb(null, true);
};

let upload;

const getPropertyImagesUpload = () => {
  if (!upload) {
    upload = multer({
      storage: getGridFsStorage(),
      limits: { fileSize: MAX_SIZE_BYTES },
      fileFilter
    });
  }
  return upload;
};

module.exports = {
  getPropertyImagesUpload
};
