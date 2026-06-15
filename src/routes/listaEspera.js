const express = require('express');
const router = express.Router();
const { create, getMisSolicitudes, cancel, getAll } = require('../controllers/listaEsperaController');
const { verificarAdmin } = require('../middlewares/auth');

router.get('/', verificarAdmin, getAll);
router.post('/', create);
router.get('/mis-solicitudes', getMisSolicitudes);
router.put('/:id/cancelar', cancel);

module.exports = router;
