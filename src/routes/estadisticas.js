const express = require('express');
const router = express.Router();
const { get } = require('../controllers/estadisticasController');
const { verificarAdmin } = require('../middlewares/auth');

router.get('/', verificarAdmin, get);

module.exports = router;
