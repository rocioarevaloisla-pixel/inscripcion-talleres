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
    const { nombre, instructor, capacidad_maxima, fecha_inicio, fecha_fin, hora_inicio, hora_fin, descripcion, imagen_url, precio } = req.body;

    if (!nombre || !instructor || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ error: true, message: 'nombre, instructor, fecha_inicio y fecha_fin son obligatorios' });
    }
    if (typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(422).json({ error: true, message: 'nombre debe ser un texto no vacío' });
    }
    if (!fecha_inicio.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(422).json({ error: true, message: 'fecha_inicio debe tener formato YYYY-MM-DD' });
    }
    if (!fecha_fin.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(422).json({ error: true, message: 'fecha_fin debe tener formato YYYY-MM-DD' });
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaInicioDt = new Date(fecha_inicio + 'T12:00:00');
    if (fechaInicioDt < hoy) {
      return res.status(422).json({ error: true, message: 'La fecha de inicio no puede ser anterior a hoy' });
    }
    if (fechaInicioDt.getFullYear() > 2026) {
      return res.status(422).json({ error: true, message: 'La fecha de inicio no puede ser más allá de 2026' });
    }

    const fechaFinDt = new Date(fecha_fin + 'T12:00:00');
    if (fechaFinDt < fechaInicioDt) {
      return res.status(422).json({ error: true, message: 'La fecha de fin no puede ser anterior a la fecha de inicio' });
    }
    if (fechaFinDt.getFullYear() > 2026) {
      return res.status(422).json({ error: true, message: 'La fecha de fin no puede ser más allá de 2026' });
    }

    const cap = Number(capacidad_maxima);
    if (capacidad_maxima !== undefined && (!Number.isInteger(cap) || cap < 1)) {
      return res.status(422).json({ error: true, message: 'capacidad_maxima debe ser un número entero positivo' });
    }

    if (hora_inicio !== undefined || hora_fin !== undefined) {
      if (!hora_inicio || !hora_fin) {
        return res.status(422).json({ error: true, message: 'hora_inicio y hora_fin deben enviarse juntos' });
      }
      if (!/^\d{2}:\d{2}$/.test(hora_inicio) && !/^\d{2}:\d{2}:\d{2}$/.test(hora_inicio)) {
        return res.status(422).json({ error: true, message: 'hora_inicio debe tener formato HH:MM' });
      }
      if (!/^\d{2}:\d{2}$/.test(hora_fin) && !/^\d{2}:\d{2}:\d{2}$/.test(hora_fin)) {
        return res.status(422).json({ error: true, message: 'hora_fin debe tener formato HH:MM' });
      }
    }

    if (precio !== undefined && precio !== null && precio !== '') {
      const p = Number(precio);
      if (isNaN(p) || p < 0) {
        return res.status(422).json({ error: true, message: 'precio debe ser un número positivo' });
      }
    }

    const taller = await Taller.create({
      nombre: nombre.trim(),
      instructor: instructor.trim(),
      capacidad_maxima: cap || 20,
      fecha_inicio,
      fecha_fin,
      hora_inicio: hora_inicio ? (hora_inicio.length === 5 ? hora_inicio + ':00' : hora_inicio) : '09:00:00',
      hora_fin: hora_fin ? (hora_fin.length === 5 ? hora_fin + ':00' : hora_fin) : '18:00:00',
      descripcion: descripcion || null,
      imagen_url: imagen_url || null,
      precio: precio !== undefined && precio !== '' ? Number(precio) : null
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

    const { nombre, instructor, capacidad_maxima, fecha_inicio, fecha_fin, hora_inicio, hora_fin, descripcion, estado, imagen_url, precio } = req.body;

    if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
      return res.status(422).json({ error: true, message: 'nombre debe ser un texto no vacío' });
    }
    if (fecha_inicio !== undefined && !fecha_inicio.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(422).json({ error: true, message: 'fecha_inicio debe tener formato YYYY-MM-DD' });
    }
    if (fecha_fin !== undefined && !fecha_fin.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(422).json({ error: true, message: 'fecha_fin debe tener formato YYYY-MM-DD' });
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fecha_inicio !== undefined) {
      const d = new Date(fecha_inicio + 'T12:00:00');
      if (d < hoy) {
        return res.status(422).json({ error: true, message: 'La fecha de inicio no puede ser anterior a hoy' });
      }
      if (d.getFullYear() > 2026) {
        return res.status(422).json({ error: true, message: 'La fecha de inicio no puede ser más allá de 2026' });
      }
    }

    if (fecha_fin !== undefined) {
      const d = new Date(fecha_fin + 'T12:00:00');
      if (fecha_inicio !== undefined && d < new Date(fecha_inicio + 'T12:00:00')) {
        return res.status(422).json({ error: true, message: 'La fecha de fin no puede ser anterior a la fecha de inicio' });
      }
      if (d.getFullYear() > 2026) {
        return res.status(422).json({ error: true, message: 'La fecha de fin no puede ser más allá de 2026' });
      }
    }

    if (capacidad_maxima !== undefined) {
      const cap = Number(capacidad_maxima);
      if (!Number.isInteger(cap) || cap < 1) {
        return res.status(422).json({ error: true, message: 'capacidad_maxima debe ser un número entero positivo' });
      }
    }

    if (hora_inicio !== undefined || hora_fin !== undefined) {
      if (!hora_inicio || !hora_fin) {
        return res.status(422).json({ error: true, message: 'hora_inicio y hora_fin deben enviarse juntos' });
      }
      if (!/^\d{2}:\d{2}$/.test(hora_inicio) && !/^\d{2}:\d{2}:\d{2}$/.test(hora_inicio)) {
        return res.status(422).json({ error: true, message: 'hora_inicio debe tener formato HH:MM' });
      }
      if (!/^\d{2}:\d{2}$/.test(hora_fin) && !/^\d{2}:\d{2}:\d{2}$/.test(hora_fin)) {
        return res.status(422).json({ error: true, message: 'hora_fin debe tener formato HH:MM' });
      }
    }

    if (precio !== undefined && precio !== null && precio !== '') {
      const p = Number(precio);
      if (isNaN(p) || p < 0) {
        return res.status(422).json({ error: true, message: 'precio debe ser un número positivo' });
      }
    }

    const updates = {};
    if (nombre !== undefined) updates.nombre = nombre.trim();
    if (instructor !== undefined) updates.instructor = instructor.trim();
    if (capacidad_maxima !== undefined) updates.capacidad_maxima = capacidad_maxima;
    if (fecha_inicio !== undefined) updates.fecha_inicio = fecha_inicio;
    if (fecha_fin !== undefined) updates.fecha_fin = fecha_fin;
    if (hora_inicio !== undefined) updates.hora_inicio = hora_inicio.length === 5 ? hora_inicio + ':00' : hora_inicio;
    if (hora_fin !== undefined) updates.hora_fin = hora_fin.length === 5 ? hora_fin + ':00' : hora_fin;
    if (descripcion !== undefined) updates.descripcion = descripcion;
    if (estado !== undefined) updates.estado = estado;
    if (imagen_url !== undefined) updates.imagen_url = imagen_url;
    if (precio !== undefined) updates.precio = precio !== '' ? Number(precio) : null;

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
