const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Taller = require('./Taller');

const Inscripcion = sequelize.define('Inscripcion', {
  nombre_alumno: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email_alumno: {
    type: DataTypes.STRING(150),
    allowNull: false
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

// Relación 1:N — un Taller tiene muchas Inscripciones
Taller.hasMany(Inscripcion, { foreignKey: 'taller_id' });
Inscripcion.belongsTo(Taller, { foreignKey: 'taller_id' });

module.exports = Inscripcion;