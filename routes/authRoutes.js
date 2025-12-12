const router = require("express").Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// Routes publiques
router.post("/register", authController.register);
router.post("/login", authController.login);

// Route protégée nécessitant une authentification
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;
