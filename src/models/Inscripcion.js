const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Taller = require('./Taller');
const Usuario = require('./Usuario');

const Inscripcion = sequelize.define('Inscripcion', {
  nombre_alumno: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email_alumno: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' }
  },
  taller_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_inscripcion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada'),
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'inscripciones'
});

Taller.hasMany(Inscripcion, { foreignKey: 'taller_id' });
Inscripcion.belongsTo(Taller, { foreignKey: 'taller_id' });

Usuario.hasMany(Inscripcion, { foreignKey: 'usuario_id' });
Inscripcion.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = Inscripcion;
