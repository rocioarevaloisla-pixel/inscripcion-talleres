const Taller = require('../models/Taller');

// GET /api/talleres — listar todos
const getAll = async (req, res) => {
  try {
    const talleres = await Taller.findAll();
    res.json(talleres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/talleres/:id — obtener uno
const getById = async (req, res) => {
  try {
    const taller = await Taller.findByPk(req.params.id);
    if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
    res.json(taller);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/talleres — crear
const create = async (req, res) => {
  try {
    const taller = await Taller.create(req.body);
    res.status(201).json(taller);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/talleres/:id — actualizar
const update = async (req, res) => {
  try {
    const taller = await Taller.findByPk(req.params.id);
    if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
    await taller.update(req.body);
    res.json(taller);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/talleres/:id — eliminar
const remove = async (req, res) => {
  try {
    const taller = await Taller.findByPk(req.params.id);
    if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
    await taller.destroy();
    res.json({ mensaje: 'Taller eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };