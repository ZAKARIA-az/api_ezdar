const propertyService = require("../services/propertyService");
const {  createPropertyValidation, updatePropertyValidation } = require('../validations/propertyValidation');


exports.getAllProperties = async (req, res, next) => {
  try {
    // فلترة ديناميكية من query params
    const filters = {
      ...req.query.filter ? JSON.parse(req.query.filter) : {},
      city: req.query.city,
      status: req.query.status,
      type: req.query.type,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      search: req.query.search,
      page: req.query.page,
      limit: req.query.limit,
      sort: req.query.sort
    };

    const result = await propertyService.getAllProperties(filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};


exports.getPropertyById = async (req, res, next) => {
  try {
    const result = await propertyService.getPropertyById(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.createProperty = async (req, res, next) => {
  try {
    const { error } = createPropertyValidation(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const result = await propertyService.createProperty(req.body,req.user._id);
    // result بصيغة { success, data } من الـ service
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.updateProperty = async (req, res, next) => {
  try {
    const { error } = updatePropertyValidation(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const result = await propertyService.updateProperty(req.params.id, req.body,req.user._id);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.deleteProperty = async (req, res, next) => {
  try {
    const result = await propertyService.deleteProperty(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};