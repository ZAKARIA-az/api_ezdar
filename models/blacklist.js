const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true, // Chaque jeton ne peut être présent qu'une seule fois
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Lien vers l'utilisateur
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true, // Date d'expiration du jeton
  },
}, { timestamps: true });

// Index pour supprimer automatiquement les jetons expirés
blacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("BlacklistToken", blacklistSchema);
