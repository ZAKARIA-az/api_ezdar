const mongoose = require('mongoose');
const Property = require('../models/Property');
const { getGridFSBucket } = require('../config/gridfs');

const ensureOwner = async (propertyId, actorId) => {
  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    throw new Error('property.invalid_id');
  }

  const property = await Property.findById(propertyId);
  if (!property) {
    throw new Error('property.not_found');
  }

  if (!actorId || !property.ownerId || !property.ownerId.equals(actorId)) {
    throw new Error('role.forbidden_not_owner');
  }

  return property;
};

exports.addImages = async ({ propertyId, actorId, files }) => {
  const property = await ensureOwner(propertyId, actorId);

  if (!Array.isArray(files) || files.length === 0) {
    throw new Error('property.images.no_files');
  }

  const fileIds = files.map((f) => f.id);

  try {
    property.images = Array.isArray(property.images) ? property.images : [];
    property.images.push(...fileIds);
    await property.save();

    return {
      success: true,
      messageKey: 'property.images.upload_success',
      images: fileIds,
      property
    };
  } catch (err) {
    // cleanup orphan GridFS files
    try {
      const bucket = getGridFSBucket();
      await Promise.allSettled(fileIds.map((id) => bucket.delete(id)));
    } catch (_) {
      // ignore cleanup
    }
    throw err;
  }
};

exports.deleteImage = async ({ propertyId, fileId, actorId }) => {
  const property = await ensureOwner(propertyId, actorId);

  if (!mongoose.Types.ObjectId.isValid(fileId)) {
    throw new Error('property.images.invalid_id');
  }

  const fid = new mongoose.Types.ObjectId(fileId);

  const hasImage = Array.isArray(property.images) && property.images.some((x) => x && x.equals(fid));
  if (!hasImage) {
    throw new Error('property.images.not_found');
  }

  property.images = property.images.filter((x) => !x.equals(fid));
  await property.save();

  const bucket = getGridFSBucket();
  await bucket.delete(fid);

  return { success: true, messageKey: 'property.images.deleted', fileId: fid };
};
