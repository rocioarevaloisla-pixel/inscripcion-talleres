const Taller = require('../models/Taller');

const getAll = async (req, res) => {
  try {
    const talleres = await Taller.findAll();
    res.json(talleres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const taller = await Taller.findByPk(req.params.id);
    if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
    res.json(taller);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const taller = await Taller.create(req.body);
    res.status(201).json(taller);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create };