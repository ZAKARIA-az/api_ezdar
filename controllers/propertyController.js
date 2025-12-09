exports.getAllProperties = async (req, res, next) => {
  try {
    const Property = require('../models/Property');
    const properties = await Property.find();
    res.status(200).json({
      success: true,
      data: properties
    });
  } catch (err) {
    next(err);
  }
};

exports.getPropertyById = async (req, res, next) => {
  try {
    const Property = require('../models/Property');
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    res.status(200).json({
      success: true,
      data: property
    });
  } catch (err) {
    next(err);
  }
};

exports.createProperty = async (req, res, next) => {
  try {
    const Property = require('../models/Property');
    const property = await Property.create(req.body);
    res.status(201).json({
      success: true,
      data: property
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProperty = async (req, res, next) => {
  try {
    const Property = require('../models/Property');
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      success: true,
      data: property
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProperty = async (req, res, next) => {
  try {
    const Property = require('../models/Property');
    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};