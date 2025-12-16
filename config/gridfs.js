const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const { GridFSBucket } = require('mongodb');

const BUCKET_NAME = 'uploads';

let bucket;
let storage;

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
    storage = new GridFsStorage({
      url: process.env.MONGO_URI,
      file: async (req, file) => {
        return {
          bucketName: BUCKET_NAME,
          filename: `${Date.now()}-${file.originalname}`,
          contentType: file.mimetype,
          metadata: {
            originalname: file.originalname
          }
        };
      }
    });
  }
  return storage;
};

module.exports = {
  BUCKET_NAME,
  getGridFSBucket,
  getGridFsStorage
};
