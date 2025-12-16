const express = require('express');
const mongoose = require('mongoose');
const { getUpload } = require('../middlewares/uploadMiddleware');
const { getGridFSBucket } = require('../config/gridfs');

const router = express.Router();

router.post('/', async (req, res, next) => {
  getUpload().single('file')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ success: false, message: req.__('files.too_large') });
      }
      if (err && typeof err.message === 'string' && err.message.startsWith('files.')) {
        return res.status(err.status || 400).json({ success: false, message: req.__(err.message) });
      }
      return next(err);
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: req.__('files.no_file') });
    }

    const f = req.file;
    return res.status(201).json({
      id: f.id,
      filename: f.filename,
      size: f.size,
      contentType: f.contentType
    });
  });
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: req.__('files.invalid_id') });
    }
    const id = new mongoose.Types.ObjectId(req.params.id);
    const bucket = getGridFSBucket();

    const files = await bucket.find({ _id: id }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ success: false, message: req.__('files.not_found') });
    }

    const file = files[0];
    res.set('Content-Type', file.contentType || 'application/octet-stream');
    res.set('Content-Length', file.length);
    res.set('Content-Disposition', `inline; filename="${file.filename}"`);

    const stream = bucket.openDownloadStream(id);
    stream.on('error', next);
    return stream.pipe(res);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: req.__('files.invalid_id') });
    }
    const id = new mongoose.Types.ObjectId(req.params.id);
    const bucket = getGridFSBucket();

    const files = await bucket.find({ _id: id }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ success: false, message: req.__('files.not_found') });
    }

    await bucket.delete(id);
    return res.json({ success: true, message: req.__('files.deleted') });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
