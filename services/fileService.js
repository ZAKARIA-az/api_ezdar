const mongoose = require('mongoose');
const { getGridFSBucket } = require('../config/gridfs');

const createError = (message, status) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const parseObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError('files.invalid_id', 400);
  }
  return new mongoose.Types.ObjectId(id);
};

exports.getUploadedFileMeta = (file) => {
  if (!file) {
    throw createError('files.no_file', 400);
  }
  return {
    id: file.id,
    filename: file.filename,
    size: file.size,
    contentType: file.contentType
  };
};

exports.getFileForDownload = async (id) => {
  const _id = parseObjectId(id);
  const bucket = getGridFSBucket();

  const files = await bucket.find({ _id }).toArray();
  if (!files || files.length === 0) {
    throw createError('files.not_found', 404);
  }

  const file = files[0];
  const stream = bucket.openDownloadStream(_id);

  return { file, stream };
};

exports.deleteFileById = async (id) => {
  const _id = parseObjectId(id);
  const bucket = getGridFSBucket();

  const files = await bucket.find({ _id }).toArray();
  if (!files || files.length === 0) {
    throw createError('files.not_found', 404);
  }

  await bucket.delete(_id);
  return { success: true, messageKey: 'files.deleted' };
};
