const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:    { type: String },
  language: { 
    type: String, 
    enum: ['en', 'ar', 'fr', 'et'], 
    default: 'en' 
  },
  role:     { type: String, enum: ["user", "owner"], default: "user" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
