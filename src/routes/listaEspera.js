const express = require('express');
const router = express.Router();
const { create, getMisSolicitudes, cancel } = require('../controllers/listaEsperaController');

router.post('/', create);
router.get('/mis-solicitudes', getMisSolicitudes);
router.put('/:id/cancelar', cancel);

module.exports = router;
