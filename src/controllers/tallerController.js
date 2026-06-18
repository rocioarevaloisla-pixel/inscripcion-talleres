const Taller = require('../models/Taller');
const Inscripcion = require('../models/Inscripcion');
const ListaEspera = require('../models/ListaEspera');
const Usuario = require('../models/Usuario');
const { Op } = require('sequelize');

const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || null;
    const limit = parseInt(req.query.limit) || 12;
    const offset = page ? (page - 1) * limit : null;

    const queryOptions = {
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
      group: ['Taller.id'],
      order: [['posicion', 'ASC'], ['id', 'ASC']]
    };

    if (offset !== null) {
      queryOptions.limit = limit;
      queryOptions.offset = offset;
      queryOptions.subQuery = false;
    }

    const talleres = await Taller.findAll(queryOptions);

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

    if (offset !== null) {
      const total = await Taller.count();
      res.json({
        talleres,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      });
    } else {
      res.json(talleres);
    }
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const taller = await Taller.findByPk(req.params.id, {
      include: [{
        model: Inscripcion,
        attributes: [],
        where: { estado: { [Op.ne]: 'cancelada' } },
        required: false
      }],
      attributes: {
        include: [
          [require('sequelize').fn('COUNT', require('sequelize').col('Inscripcions.id')), 'inscritos_count']
        ]
      },
      group: ['Taller.id']
    });
    if (!taller) return res.status(404).json({ error: true, message: 'Taller no encontrado' });

    if (req.usuario) {
      const inscripcion = await Inscripcion.findOne({
        where: {
          usuario_id: req.usuario.id,
          taller_id: taller.id,
          estado: { [Op.ne]: 'cancelada' }
        }
      });
      taller.dataValues.ya_inscrito = !!inscripcion;
    } else {
      taller.dataValues.ya_inscrito = false;
    }

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
    if (typeof instructor !== 'string' || instructor.trim() === '') {
      return res.status(422).json({ error: true, message: 'instructor debe ser un texto no vacío' });
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
      if (hora_inicio > hora_fin) {
        return res.status(422).json({ error: true, message: 'La hora de inicio no puede ser mayor a la hora de término' });
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
    if (instructor !== undefined && (typeof instructor !== 'string' || instructor.trim() === '')) {
      return res.status(422).json({ error: true, message: 'instructor debe ser un texto no vacío' });
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
      if (fecha_inicio !== taller.fecha_inicio && d < hoy) {
        return res.status(422).json({ error: true, message: 'La fecha de inicio no puede ser anterior a hoy' });
      }
      if (d.getFullYear() > 2026) {
        return res.status(422).json({ error: true, message: 'La fecha de inicio no puede ser más allá de 2026' });
      }
      const currentFechaFin = fecha_fin !== undefined ? fecha_fin : taller.fecha_fin;
      if (d > new Date(currentFechaFin + 'T12:00:00')) {
        return res.status(422).json({ error: true, message: 'La fecha de inicio no puede ser posterior a la fecha de término' });
      }
    }

    if (fecha_fin !== undefined) {
      const d = new Date(fecha_fin + 'T12:00:00');
      const currentFechaInicio = fecha_inicio !== undefined ? fecha_inicio : taller.fecha_inicio;
      if (d < new Date(currentFechaInicio + 'T12:00:00')) {
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
      if (hora_inicio > hora_fin) {
        return res.status(422).json({ error: true, message: 'La hora de inicio no puede ser mayor a la hora de término' });
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

    if (updates.capacidad_maxima) {
      const activas = await Inscripcion.count({
        where: { taller_id: taller.id, estado: { [Op.ne]: 'cancelada' } }
      });
      const libres = Math.max(0, updates.capacidad_maxima - activas);
      if (libres > 0) {
        const espera = await ListaEspera.findAll({
          where: { taller_id: taller.id, estado: 'pendiente' },
          order: [['fecha_solicitud', 'ASC']],
          limit: libres,
          include: [{ model: Usuario, attributes: ['nombre', 'email'] }]
        });
        for (const e of espera) {
          await e.update({ estado: 'aceptada' });
          await Inscripcion.create({
            taller_id: e.taller_id,
            usuario_id: e.usuario_id,
            nombre_alumno: e.Usuario?.nombre || 'Alumno',
            email_alumno: e.Usuario?.email || 'alumno@correo.cl',
            estado: 'confirmada'
          });
        }
      }
    }

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

const reordenar = async (req, res, next) => {
  try {
    const { orden } = req.body;
    if (!Array.isArray(orden) || orden.length === 0) {
      return res.status(400).json({ error: true, message: 'orden debe ser un arreglo no vacío' });
    }

    for (const item of orden) {
      if (!item.id || typeof item.posicion !== 'number') {
        return res.status(400).json({ error: true, message: 'Cada item debe tener id y posicion' });
      }
      await Taller.update({ posicion: item.posicion }, { where: { id: item.id } });
    }

    res.json({ mensaje: 'Orden actualizado correctamente' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove, reordenar };
