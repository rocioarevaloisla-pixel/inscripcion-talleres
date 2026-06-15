const express = require('express');
const router = express.Router();
const { getAll, create, getMisInscripciones, cancel } = require('../controllers/inscripcionController');
const { verificarAdmin } = require('../middlewares/auth');

router.get('/', verificarAdmin, getAll);
router.get('/mis-inscripciones', getMisInscripciones);
router.post('/', create);
router.put('/:id/cancelar', cancel);

module.exports = router;
