const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  description: String,
  type: {
    type: String,
    enum: ['studio', 'Appartement', 'Maison', 'chambre', 'Chambre en colocation'],
    required: true
  },
  price: Number,
  city: String,
  location: String,
  images: [String],
  status: { 
    type: String,
    enum: ['Disponible', 'Loué'],
    default: "Disponible" }
}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);
