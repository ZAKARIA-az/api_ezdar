const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middlewares/authMiddleware');
const { roleMiddleware} = require('../middlewares/roleMiddleware');
const role=require('../role');

// Protéger toutes les routes avec l'authentification
router.use(authMiddleware,roleMiddleware(role.USER));

// Ajouter un bien aux favoris
router.post('/', favoriteController.addToFavorites);

// Supprimer un bien des favoris
router.delete('/:propertyId', favoriteController.removeFromFavorites);

// Supprimer tous les favoris d'un utilisateur
router.delete('/', favoriteController.removeAllFavorites);

// Obtenir la liste des favoris d'un utilisateur
router.get('/', favoriteController.getUserFavorites);

// Vérifier si un bien est dans les favoris
router.get('/check/:propertyId', favoriteController.checkIfFavorite);

module.exports = router;