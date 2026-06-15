const express = require('express');
const router = express.Router();
const { registro, login, perfil, forgotPassword, resetPassword } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/auth');

// Rutas públicas
router.post('/registro', registro);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Ruta protegida
router.get('/perfil', verificarToken, perfil);

module.exports = router;