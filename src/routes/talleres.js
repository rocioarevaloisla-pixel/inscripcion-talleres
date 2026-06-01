const express = require('express');
const router = express.Router();
const { getAll, getById, create } = require('../controllers/tallerController');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);

module.exports = router;