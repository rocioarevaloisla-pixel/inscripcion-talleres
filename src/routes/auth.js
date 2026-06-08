const express = require('express');
const router = express.Router();
const { registro, login, perfil } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/auth');

// Rutas públicas
router.post('/registro', registro);
router.post('/login', login);

// Ruta protegida
router.get('/perfil', verificarToken, perfil);

module.exports = router;