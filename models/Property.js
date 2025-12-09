const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  description: String,
  price: Number,
  location: String,
  images: [String],
  status: { type: String, default: "available" }
}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);
