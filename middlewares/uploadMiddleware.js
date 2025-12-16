const multer = require('multer');
const { getGridFsStorage } = require('../config/gridfs');

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'application/pdf']);

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    const err = new Error('files.invalid_type');
    err.status = 400;
    return cb(err);
  }
  return cb(null, true);
};

let upload;

const getUpload = () => {
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
  getUpload
};
