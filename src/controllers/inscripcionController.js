const Inscripcion = require('../models/Inscripcion');
const Taller = require('../models/Taller');
const Usuario = require('../models/Usuario');
const ListaEspera = require('../models/ListaEspera');
const { Op } = require('sequelize');

const getAll = async (req, res, next) => {
  try {
    const inscripciones = await Inscripcion.findAll({
      where: { estado: { [Op.ne]: 'cancelada' } },
      include: [
        { model: Taller, attributes: ['nombre', 'instructor', 'capacidad_maxima', 'estado'] },
        { model: Usuario, attributes: ['nombre', 'email', 'rol'] }
      ],
      order: [['fecha_inscripcion', 'DESC']]
    });
    res.json(inscripciones);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { taller_id, nombre_alumno, email_alumno } = req.body;

    if (!taller_id || !nombre_alumno || !email_alumno) {
      return res.status(400).json({ error: true, message: 'taller_id, nombre_alumno y email_alumno son obligatorios' });
    }

    const taller = await Taller.findByPk(taller_id);
    if (!taller) {
      return res.status(404).json({ error: true, message: 'Taller no encontrado' });
    }

    if (taller.estado !== 'activo') {
      return res.status(422).json({ error: true, message: 'El taller no está disponible para inscripciones' });
    }

    const yaInscrito = await Inscripcion.findOne({
      where: {
        usuario_id: req.usuario.id,
        taller_id,
        estado: { [Op.ne]: 'cancelada' }
      }
    });

    if (yaInscrito) {
      return res.status(409).json({ error: true, message: 'Ya estás inscrito en este taller' });
    }

    const newStart = new Date(`${taller.fecha_inicio}T${taller.hora_inicio || '09:00:00'}`);
    const newEnd = new Date(`${taller.fecha_fin || taller.fecha_inicio}T${taller.hora_fin || '18:00:00'}`);

    const activas = await Inscripcion.findAll({
      where: { usuario_id: req.usuario.id, estado: { [Op.ne]: 'cancelada' } },
      include: [{ model: Taller, attributes: ['fecha_inicio', 'fecha_fin', 'hora_inicio', 'hora_fin'] }]
    });

    const solapada = activas.some(insc => {
      if (insc.taller_id === taller_id) return false;
      const t = insc.Taller;
      const start = new Date(`${t.fecha_inicio}T${t.hora_inicio || '09:00:00'}`);
      const end = new Date(`${t.fecha_fin || t.fecha_inicio}T${t.hora_fin || '18:00:00'}`);
      return newStart <= end && start <= newEnd;
    });

    if (solapada) {
      return res.status(409).json({ error: true, message: 'Ya tienes una inscripción en un taller con horario solapado' });
    }

    const inscripcionesActuales = await Inscripcion.count({
      where: { taller_id, estado: { [Op.ne]: 'cancelada' } }
    });

    if (inscripcionesActuales >= taller.capacidad_maxima) {
      return res.status(409).json({ error: true, message: 'El taller ha alcanzado su capacidad máxima' });
    }

    const inscripcion = await Inscripcion.create({
      taller_id,
      nombre_alumno,
      email_alumno,
      usuario_id: req.usuario.id,
      estado: 'confirmada'
    });

    res.status(201).json(inscripcion);
  } catch (err) {
    next(err);
  }
};

const getMisInscripciones = async (req, res, next) => {
  try {
    const inscripciones = await Inscripcion.findAll({
      where: { usuario_id: req.usuario.id },
      include: [
        { model: Taller, attributes: ['nombre', 'instructor', 'fecha_inicio', 'fecha_fin', 'hora_inicio', 'hora_fin', 'capacidad_maxima', 'estado'] }
      ]
    });
    res.json(inscripciones);
  } catch (err) {
    next(err);
  }
};

const cancel = async (req, res, next) => {
  try {
    const inscripcion = await Inscripcion.findOne({
      where: { id: req.params.id, usuario_id: req.usuario.id, estado: { [Op.ne]: 'cancelada' } },
      include: [{ model: Taller, attributes: ['id', 'nombre', 'fecha_inicio', 'fecha_fin'] }]
    });

    if (!inscripcion) {
      return res.status(404).json({ error: true, message: 'Inscripción no encontrada o ya cancelada' });
    }

    const fin = inscripcion.Taller.fecha_fin || inscripcion.Taller.fecha_inicio;
    const tallerFecha = new Date(fin + 'T23:59:59');
    if (tallerFecha < new Date()) {
      return res.status(422).json({ error: true, message: 'No puedes cancelar una inscripción a un taller que ya se realizó' });
    }

    inscripcion.estado = 'cancelada';
    await inscripcion.save();

    const siguiente = await ListaEspera.findOne({
      where: { taller_id: inscripcion.taller_id, estado: 'pendiente' },
      include: [{ model: require('../models/Usuario'), attributes: ['nombre', 'email'] }],
      order: [['fecha_solicitud', 'ASC']]
    });

    if (siguiente) {
      siguiente.estado = 'aceptada';
      await siguiente.save();

      await Inscripcion.create({
        taller_id: siguiente.taller_id,
        nombre_alumno: siguiente.Usuario?.nombre || 'Alumno',
        email_alumno: siguiente.Usuario?.email || 'alumno@correo.cl',
        usuario_id: siguiente.usuario_id,
        estado: 'confirmada'
      });
    }

    res.json({ mensaje: 'Inscripción cancelada exitosamente', auto_inscrito: !!siguiente });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, create, getMisInscripciones, cancel };
