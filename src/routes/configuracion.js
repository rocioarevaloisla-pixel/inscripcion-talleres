const express = require('express');
const router = express.Router();
const { getConfig, updateConfig } = require('../controllers/configuracionController');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

router.get('/', getConfig);
router.put('/', verificarToken, verificarAdmin, updateConfig);

module.exports = router;
