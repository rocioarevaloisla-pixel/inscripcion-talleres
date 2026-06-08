const express = require('express');
const router = express.Router();
const { getAll, create, getMisInscripciones } = require('../controllers/inscripcionController');
const { verificarAdmin } = require('../middlewares/auth');

router.get('/', verificarAdmin, getAll);
router.get('/mis-inscripciones', getMisInscripciones);
router.post('/', create);

module.exports = router;
