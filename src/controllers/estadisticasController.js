const { Sequelize, fn, col } = require('sequelize');
const Taller = require('../models/Taller');
const Inscripcion = require('../models/Inscripcion');
const Usuario = require('../models/Usuario');

const get = async (req, res, next) => {
  try {
    const [totalTalleres, talleresActivos, totalInscripciones, totalUsuarios, inscripcionesPorMes] =
      await Promise.all([
        Taller.count(),
        Taller.count({ where: { estado: 'activo' } }),
        Inscripcion.count(),
        Usuario.count(),
        Inscripcion.findAll({
          attributes: [
            [fn('DATE_FORMAT', col('fecha_inscripcion'), '%Y-%m'), 'mes'],
            [fn('COUNT', col('id')), 'cantidad']
          ],
          group: [fn('DATE_FORMAT', col('fecha_inscripcion'), '%Y-%m')],
          order: [[fn('DATE_FORMAT', col('fecha_inscripcion'), '%Y-%m'), 'ASC']],
          raw: true
        })
      ]);

    res.json({
      total_talleres: totalTalleres,
      talleres_activos: talleresActivos,
      total_inscripciones: totalInscripciones,
      total_usuarios: totalUsuarios,
      inscripciones_por_mes: inscripcionesPorMes
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { get };
