const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const BlacklistToken = require('../models/blacklist');
const jwt = require('jsonwebtoken');

exports.register = async (data) => {
  const { fullName, email, password, role } = data;

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("Email already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName, email, password: hashed, role
  });

  return { user, token: generateToken(user._id) };
};

exports.login = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  return { user, token: generateToken(user._id) };
};




exports.logout = async (user, token) => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }

    // Vérifier et décoder le token pour obtenir l'expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérifier si l'utilisateur est défini et a un _id
    if (!user || !user._id) {
      throw new Error('Informations utilisateur manquantes');
    }

    // Ajouter le token à la liste noire
    const blacklistToken = new BlacklistToken({
      token,
      user: user._id,
      expiresAt: new Date(decoded.exp * 1000) // Convertir la date d'expiration
    });

    await blacklistToken.save();

    return { 
      success: true, 
      message: "Déconnexion réussie" 
    };
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    throw new Error(`Erreur lors de la déconnexion: ${error.message}`);
  }
};

// Fonction utilitaire pour vérifier si un token est dans la liste noire
exports.isTokenBlacklisted = async (token) => {
  const blacklistedToken = await BlacklistToken.findOne({ token });
  return !!blacklistedToken;
};