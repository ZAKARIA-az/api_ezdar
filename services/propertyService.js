const Property = require("../models/Property");
// services/propertyService.js
const { createNotification } = require('./notificationService');


// Créer un index pour la recherche par ville
// À ajouter dans le modèle Property : propertySchema.index({ city: 1 });

// Fonction utilitaire pour construire la requête de filtrage
const buildFilterQuery = (filters = {}) => {
  const query = {};
  
  // Filtre par ville (avec index)
  if (filters.city) {
    query.city = { $regex: filters.city, $options: 'i' };
  }

  // Filtre par statut
  if (filters.status) {
    query.status = filters.status;
  }

  // Filtre par type
  if (filters.type) {
    query.type = filters.type;
  }

  // Filtre par prix
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }

  // Recherche par texte (titre ou description)
  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  return query;
};

exports.getAllProperties = async (filters = {}) => {
  // Convertir les filtres si nécessaire
  if (typeof filters === 'string') {
    try {
      filters = JSON.parse(filters);
    } catch (e) {
      throw new Error('property.invalid_filter');
    }
  }

  // Construire la requête
  const query = buildFilterQuery(filters);
  
  // Pagination et tri
  const page = parseInt(filters.page) || 1;
  const limit = Math.min(parseInt(filters.limit) || 10, 100); // Limite maximale de 100 éléments
  const skip = (page - 1) * limit;

  // Configuration du tri
  const sortOption = {};
  if (filters.sort) {
    const sortField = filters.sort.replace(/^-/, '');
    const sortOrder = filters.sort.startsWith('-') ? -1 : 1;
    sortOption[sortField] = sortOrder;
  }
  sortOption.createdAt = -1; // Tri secondaire par défaut

  // Exécution des requêtes en parallèle
  const [properties, total] = await Promise.all([
    Property.find(query)
      .populate('ownerId', 'fullName email phone')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),
    Property.countDocuments(query)
  ]);

  // Calcul du nombre total de pages
  const totalPages = Math.ceil(total / limit);

  // Retourner les résultats
  return {
    data: properties,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
};

exports.getPropertyById = async (id) => {
  const property = await Property.findById(id)
    .populate('ownerId', 'fullName email phone')
    .lean();
  
  if (!property) {
    throw new Error('property.not_found');
  }
  
  return property;
};


exports.createProperty = async (data, actorId) => {
  const property = new Property({
    ...data,
    ownerId: actorId
  });
  await property.validate();
  const savedProperty = await property.save();

  // 🔔 إنشاء إشعار
  await createNotification({
    userId: savedProperty.ownerId, // صاحب العقار
    actorId: actorId,              // من قام بالإنشاء
    type: 'PROPERTY_CREATED',
    data: {
      propertyId: savedProperty._id,
      title: savedProperty.title,
      messageKey: 'notifications.templates.property_created',
      link: `/properties/${savedProperty._id}`
    },
    priority: 'low'
  });

  return savedProperty;
};



exports.updateProperty = async (id, data, actorId) => {
  const property = await Property.findByIdAndUpdate(
    id,
    { $set: data },
    { 
      new: true,
      runValidators: true,
      context: 'query'
    }
  );
  
  if (!property) {
    throw new Error('property.not_found');
  }

  // 🔔 إنشاء إشعار
  await createNotification({
    userId: property.ownerId, // صاحب العقار
    actorId: actorId,              // من قام بالتحديث
    type: 'PROPERTY_UPDATED',
    data: {
      propertyId: property._id,
      title: property.title,
      messageKey: 'notifications.templates.property_updated',
      link: `/properties/${property._id}`
    },
    priority: 'low'
  });
  
  return property;
};

exports.deleteProperty = async (id) => {
  const property = await Property.findByIdAndDelete(id);
  
  if (!property) {
    throw new Error('property.not_found');
  }
  
  return { id: property._id };
};