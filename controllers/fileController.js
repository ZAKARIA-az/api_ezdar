const fileService = require('../services/fileService');

exports.uploadFile = async (req, res, next) => {
  try {
    const meta = fileService.getUploadedFileMeta(req.file);
    return res.status(201).json(meta);
  } catch (err) {
    return next(err);
  }
};

exports.streamFile = async (req, res, next) => {
  try {
    const { file, stream } = await fileService.getFileForDownload(req.params.id);

    res.set('Content-Type', file.contentType || 'application/octet-stream');
    res.set('Content-Length', file.length);
    res.set('Content-Disposition', `inline; filename="${file.filename}"`);

    stream.on('error', next);
    return stream.pipe(res);
  } catch (err) {
    return next(err);
  }
};

exports.deleteFile = async (req, res, next) => {
  try {
    const result = await fileService.deleteFileById(req.params.id);
    if (result && result.messageKey) {
      const { messageKey, ...rest } = result;
      return res.json({ ...rest, message: req.__(messageKey) });
    }
    return res.json(result);
  } catch (err) {
    return next(err);
  }
};

exports.filesErrorHandler = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ success: false, message: req.__('files.too_large') });
    }

    if (err && typeof err.message === 'string' && err.message.startsWith('files.')) {
      return res.status(err.status || 400).json({ success: false, message: req.__(err.message) });
    }
  }
  return next(err);
};
