const Property = require("../models/Property");

exports.getAllProperties = async (filters = {}) => {
  try {
    const query = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) {
        query.price.$gte = Number(filters.minPrice);
      }
      if (filters.maxPrice) {
        query.price.$lte = Number(filters.maxPrice);
      }
    }
    
    if (filters.city) {
      query.city = new RegExp(filters.city, 'i'); //  case-insensitive
    }
    
    if (filters.location) {
      query.location = new RegExp(filters.location, 'i');
    }
    
    const properties = await Property.find(query).populate('ownerId');
    
    return {
      success: true,
      count: properties.length,
      data: properties
    };
  } catch (err) {
    throw new Error(`Error fetching properties: ${err.message}`);
  }
};

exports.getPropertyById = async (id) => {
  try {
    const property = await Property.findById(id).populate('ownerId');
    if (!property) {
      throw new Error('Property not found');
    }
    return { success: true, data: property };
  } catch (err) {
    throw new Error(`Error fetching property: ${err.message}`);
  }
};

exports.createProperty = async (data) => {
  try {
    const property = await Property.create(data);
    return { success: true, data: property };
  } catch (err) {
    throw new Error(`Error creating property: ${err.message}`);
  }
};

exports.updateProperty = async (id, data) => {
  try {
    const property = await Property.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });
    if (!property) {
      throw new Error('Property not found');
    }
    return { success: true, data: property };
  } catch (err) {
    throw new Error(`Error updating property: ${err.message}`);
  }
};

exports.deleteProperty = async (id) => {
  try {
    const property = await Property.findByIdAndDelete(id);
    if (!property) {
      throw new Error('Property not found');
    }
    return { success: true, message: 'Property deleted successfully' };
  } catch (err) {
    throw new Error(`Error deleting property: ${err.message}`);
  }
};