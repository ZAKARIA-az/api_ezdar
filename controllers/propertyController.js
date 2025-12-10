const propertyService = require("../services/propertyService");
const {  createPropertyValidation, updatePropertyValidation } = require('../validations/propertyValidation');
const Property = require('../models/Property');

exports.getAllProperties = async (req, res, next) => {
  try {
    const filters = req.query || {};
    const result = await propertyService.getAllProperties(filters);
    if (result && result.success !== undefined) {
      return res.status(200).json(result);
    }
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.getPropertyById = async (req, res, next) => {
  try {
    const property_exist = await Property.findById(req.params.id);
    if (!property_exist) {
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
    const { error } = createPropertyValidation(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const my_property = await Property.create(req.body);
    res.status(201).json({
      success: true,
      data: my_property
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProperty = async (req, res, next) => {
  try {
    const { error } = updatePropertyValidation(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    const my_property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      success: true,
      data: my_property
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProperty = async (req, res, next) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};