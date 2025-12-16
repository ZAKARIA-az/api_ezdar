const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true 
  },
  title: {
    type: String,
    index: true
  },
  description: String,
  type: {
    type: String,
    enum: ['studio', 'Appartement', 'Maison', 'chambre', 'Chambre en colocation'],
    required: true,
    index: true
  },
  price: {
    type: Number,
    index: true
  },
  city: {
    type: String,
    index: true
  },
  location: {
    type: String,
    index: true
  },
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "uploads.files"
  }],
  status: { 
    type: String,
    enum: ['Disponible', 'Loué'],
    default: "Disponible",
    index: true
  }
}, { 
  timestamps: true 
});

// إنشاء فهارس مركبة للاستعلامات الشائعة
propertySchema.index({ 
  city: 1, 
  status: 1,
  price: 1 
});

propertySchema.index({
  title: "text",
  description: "text"
}, {
  weights: {
    title: 3,  // وزن أعلى للبحث في العنوان
    description: 1
  },
  name: "text_search_index"
});

module.exports = mongoose.model("Property", propertySchema);