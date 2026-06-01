const Inscripcion = require('../models/Inscripcion');
const Taller = require('../models/Taller');

const getAll = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.findAll({ include: Taller });
    res.json(inscripciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const inscripcion = await Inscripcion.create(req.body);
    res.status(201).json(inscripcion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getAll, create };