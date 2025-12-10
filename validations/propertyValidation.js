const Joi = require('joi');

// Validation عند إنشاء عقار جديد
const createPropertyValidation = (data) => {
  const schema = Joi.object({
    ownerId: Joi.string().required(), // عادة ObjectId من MongoDB
    title: Joi.string().min(3).required(),
    city: Joi.string().min(2).required(),
    type: Joi.string().valid(
      'studio',      
      'Appartement',   
      'Maison',       
      'chambre',      
      'Chambre en colocation',   //une chambre en une appartement commun
    ).required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().positive().required(),
    location: Joi.string().min(3).required(),
    images: Joi.array().items(Joi.string().uri()), // روابط الصور
    status: Joi.string().valid('Disponible', 'Loué').default('Disponible'),
  });
  return schema.validate(data);
};

// Validation عند تعديل عقار (Update) - بعض الحقول يمكن أن تكون اختيارية
const updatePropertyValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3),
    description: Joi.string().min(10),
    price: Joi.number().positive(),
    location: Joi.string().min(3),
    images: Joi.array().items(Joi.string().uri()),
    status: Joi.string().valid('Disponible', 'Loué'),
  });
  return schema.validate(data);
};

module.exports = { createPropertyValidation, updatePropertyValidation };
