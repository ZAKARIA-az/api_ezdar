const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

const BUCKET_NAME = 'uploads';

let bucket;
let storage;

class GridFsMulterStorage {
  constructor({ bucketName } = {}) {
    this.bucketName = bucketName || BUCKET_NAME;
  }

  _getBucket() {
    return getGridFSBucket();
  }

  _handleFile(req, file, cb) {
    try {
      const bucket = this._getBucket();

      const filename = `${Date.now()}-${file.originalname}`;
      const uploadStream = bucket.openUploadStream(filename, {
        contentType: file.mimetype,
        metadata: {
          originalname: file.originalname
        }
      });

      let size = 0;
      file.stream.on('data', (chunk) => {
        size += chunk.length;
      });

      uploadStream.on('error', (err) => cb(err));
      uploadStream.on('finish', () => {
        return cb(null, {
          id: uploadStream.id,
          filename,
          size,
          contentType: file.mimetype
        });
      });

      file.stream.pipe(uploadStream);
    } catch (err) {
      cb(err);
    }
  }

  _removeFile(req, file, cb) {
    const id = file && file.id;
    if (!id) return cb(null);
    try {
      const bucket = this._getBucket();
      bucket.delete(id).then(() => cb(null)).catch(cb);
    } catch (err) {
      cb(err);
    }
  }
}

const getGridFSBucket = () => {
  if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
    throw new Error('files.db_not_ready');
  }
  if (!bucket) {
    bucket = new GridFSBucket(mongoose.connection.db, { bucketName: BUCKET_NAME });
  }
  return bucket;
};

const getGridFsStorage = () => {
  if (!storage) {
    storage = new GridFsMulterStorage({ bucketName: BUCKET_NAME });
  }
  return storage;
};

module.exports = {
  BUCKET_NAME,
  getGridFSBucket,
  getGridFsStorage
};
