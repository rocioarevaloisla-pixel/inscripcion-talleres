const express = require('express');
const router = express.Router();
const { getConfig, updateConfig } = require('../controllers/configuracionController');
const { verificarAdmin } = require('../middlewares/auth');

router.get('/', getConfig);
router.put('/', verificarAdmin, updateConfig);

module.exports = router;
