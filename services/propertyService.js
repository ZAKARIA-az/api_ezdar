const Property = require("../models/Property");


exports.getAllProperties = async (filters = {}) => {
  try {
    // إذا كان الفلتر عبارة عن نص، نقوم بتحويله إلى كائن
    if (typeof filters === 'string') {
      try {
        filters = JSON.parse(filters);
      } catch (e) {
        throw new Error('تنسيق الفلتر غير صالح');
      }
    }

    const andConditions = [];

    // city
    if (filters.city) {
      andConditions.push({ city: { $regex: filters.city, $options: "i" } });
    }

    // status
    if (filters.status) {
      andConditions.push({ status: filters.status });
    }

    // type
    if (filters.type) {
      andConditions.push({ type: filters.type });
    }

    // price
    if (filters.minPrice || filters.maxPrice) {
      const priceFilter = {};
      if (filters.minPrice) priceFilter.$gte = Number(filters.minPrice);
      if (filters.maxPrice) priceFilter.$lte = Number(filters.maxPrice);
      andConditions.push({ price: priceFilter });
    }

    // search (title / description)
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      andConditions.push({
        $or: [
          { title: searchRegex },
          { description: searchRegex }
        ]
      });
    }

    // استعلام نهائي
    const query = andConditions.length ? { $and: andConditions } : {};

    // pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    // sort ديناميكي
    let sortOption = { createdAt: -1 }; // القيمة الافتراضية
    if (filters.sort) {
      const sortField = filters.sort.replace('-', '');
      const sortOrder = filters.sort.startsWith('-') ? -1 : 1;
      sortOption = { [sortField]: sortOrder, createdAt: -1 }; // ترتيب ثانوي حسب الأحدث
    }

    const properties = await Property.find(query)
      .populate('ownerId', 'fullName email role')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Property.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return {
      success: true,
      count: properties.length,
      page,
      pages,
      total,
      data: properties
    };

  } catch (error) {
    console.error('خطأ في جلب العقارات:', error);
    throw error;
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