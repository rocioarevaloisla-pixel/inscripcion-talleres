const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove, reordenar } = require('../controllers/tallerController');
const { verificarAdmin, verificarTokenOpcional } = require('../middlewares/auth');

router.get('/', verificarTokenOpcional, getAll);
router.get('/:id', verificarTokenOpcional, getById);
router.post('/', verificarAdmin, create);
router.put('/:id', verificarAdmin, update);
router.put('/reordenar', verificarAdmin, reordenar);
router.delete('/:id', verificarAdmin, remove);

module.exports = router;
