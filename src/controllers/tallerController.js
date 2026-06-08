const Taller = require('../models/Taller');
const Inscripcion = require('../models/Inscripcion');
const { Op } = require('sequelize');

const getAll = async (req, res, next) => {
  try {
    const talleres = await Taller.findAll({
      include: [
        {
          model: Inscripcion,
          attributes: [],
          where: { estado: { [Op.ne]: 'cancelada' } },
          required: false
        }
      ],
      attributes: {
        include: [
          [
            require('sequelize').fn('COUNT', require('sequelize').col('Inscripcions.id')),
            'inscritos_count'
          ]
        ]
      },
      group: ['Taller.id']
    });

    if (req.usuario) {
      const tallerIds = talleres.map(t => t.id);
      const misInscripciones = await Inscripcion.findAll({
        where: {
          usuario_id: req.usuario.id,
          taller_id: { [Op.in]: tallerIds },
          estado: { [Op.ne]: 'cancelada' }
        },
        attributes: ['taller_id']
      });
      const inscritoSet = new Set(misInscripciones.map(i => i.taller_id));
      talleres.forEach(t => {
        t.dataValues.ya_inscrito = inscritoSet.has(t.id);
      });
    } else {
      talleres.forEach(t => {
        t.dataValues.ya_inscrito = false;
      });
    }

    res.json(talleres);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const taller = await Taller.findByPk(req.params.id);
    if (!taller) return res.status(404).json({ error: true, message: 'Taller no encontrado' });
    res.json(taller);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { nombre, instructor, capacidad_maxima, fecha_inicio, descripcion, imagen_url } = req.body;

    if (!nombre || !instructor || !fecha_inicio) {
      return res.status(400).json({ error: true, message: 'nombre, instructor y fecha_inicio son obligatorios' });
    }
    if (typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(422).json({ error: true, message: 'nombre debe ser un texto no vacío' });
    }
    if (!fecha_inicio.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(422).json({ error: true, message: 'fecha_inicio debe tener formato YYYY-MM-DD' });
    }

    const cap = Number(capacidad_maxima);
    if (capacidad_maxima !== undefined && (!Number.isInteger(cap) || cap < 1)) {
      return res.status(422).json({ error: true, message: 'capacidad_maxima debe ser un número entero positivo' });
    }

    const taller = await Taller.create({
      nombre: nombre.trim(),
      instructor: instructor.trim(),
      capacidad_maxima: cap || 20,
      fecha_inicio,
      descripcion: descripcion || null,
      imagen_url: imagen_url || null
    });
    res.status(201).json(taller);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const taller = await Taller.findByPk(req.params.id);
    if (!taller) return res.status(404).json({ error: true, message: 'Taller no encontrado' });

    const { nombre, instructor, capacidad_maxima, fecha_inicio, descripcion, estado, imagen_url } = req.body;

    if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
      return res.status(422).json({ error: true, message: 'nombre debe ser un texto no vacío' });
    }
    if (fecha_inicio !== undefined && !fecha_inicio.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(422).json({ error: true, message: 'fecha_inicio debe tener formato YYYY-MM-DD' });
    }

    if (capacidad_maxima !== undefined) {
      const cap = Number(capacidad_maxima);
      if (!Number.isInteger(cap) || cap < 1) {
        return res.status(422).json({ error: true, message: 'capacidad_maxima debe ser un número entero positivo' });
      }
    }

    const updates = {};
    if (nombre !== undefined) updates.nombre = nombre.trim();
    if (instructor !== undefined) updates.instructor = instructor.trim();
    if (capacidad_maxima !== undefined) updates.capacidad_maxima = capacidad_maxima;
    if (fecha_inicio !== undefined) updates.fecha_inicio = fecha_inicio;
    if (descripcion !== undefined) updates.descripcion = descripcion;
    if (estado !== undefined) updates.estado = estado;
    if (imagen_url !== undefined) updates.imagen_url = imagen_url;

    await taller.update(updates);
    res.json(taller);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const taller = await Taller.findByPk(req.params.id);
    if (!taller) return res.status(404).json({ error: true, message: 'Taller no encontrado' });

    const inscripcionesActivas = await Inscripcion.count({
      where: { taller_id: req.params.id, estado: { [Op.ne]: 'cancelada' } }
    });
    if (inscripcionesActivas > 0) {
      return res.status(409).json({ error: true, message: 'No se puede eliminar un taller con inscripciones activas. Cámbialo a estado "cancelado" en su lugar.' });
    }

    await taller.destroy();
    res.json({ mensaje: 'Taller eliminado correctamente' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
