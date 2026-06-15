const ListaEspera = require('../models/ListaEspera');
const Taller = require('../models/Taller');
const Inscripcion = require('../models/Inscripcion');
const { Op } = require('sequelize');

const create = async (req, res, next) => {
  try {
    const { taller_id } = req.body;

    if (!taller_id) {
      return res.status(400).json({ error: true, message: 'taller_id es obligatorio' });
    }

    const taller = await Taller.findByPk(taller_id);
    if (!taller) {
      return res.status(404).json({ error: true, message: 'Taller no encontrado' });
    }

    if (taller.estado !== 'activo') {
      return res.status(422).json({ error: true, message: 'El taller no está disponible' });
    }

    const inscripcionesActuales = await Inscripcion.count({
      where: { taller_id, estado: { [Op.ne]: 'cancelada' } }
    });

    if (inscripcionesActuales < taller.capacidad_maxima) {
      return res.status(422).json({ error: true, message: 'El taller aún tiene cupos disponibles, puedes inscribirte directamente' });
    }

    const yaSolicitado = await ListaEspera.findOne({
      where: {
        usuario_id: req.usuario.id,
        taller_id,
        estado: 'pendiente'
      }
    });

    if (yaSolicitado) {
      return res.status(409).json({ error: true, message: 'Ya estás en la lista de espera de este taller' });
    }

    const existente = await ListaEspera.create({
      usuario_id: req.usuario.id,
      taller_id
    });

    res.status(201).json(existente);
  } catch (err) {
    next(err);
  }
};

const getMisSolicitudes = async (req, res, next) => {
  try {
    const solicitudes = await ListaEspera.findAll({
      where: { usuario_id: req.usuario.id },
      include: [
        { model: Taller, attributes: ['nombre', 'instructor', 'fecha_inicio', 'estado', 'capacidad_maxima'] }
      ],
      order: [['fecha_solicitud', 'DESC']]
    });

    res.json(solicitudes);
  } catch (err) {
    next(err);
  }
};

const cancel = async (req, res, next) => {
  try {
    const solicitud = await ListaEspera.findOne({
      where: { id: req.params.id, usuario_id: req.usuario.id, estado: 'pendiente' }
    });

    if (!solicitud) {
      return res.status(404).json({ error: true, message: 'Solicitud no encontrada o ya procesada' });
    }

    solicitud.estado = 'cancelada';
    await solicitud.save();

    res.json({ mensaje: 'Solicitud de lista de espera cancelada' });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getMisSolicitudes, cancel };
