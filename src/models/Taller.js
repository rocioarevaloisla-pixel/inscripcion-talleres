const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Taller = sequelize.define('Taller', {
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  instructor: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  capacidad_maxima: {
    type: DataTypes.INTEGER,
    defaultValue: 20
  },
  imagen_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fecha_fin: {
    type: DataTypes.DATEONLY
  },
  estado: {
    type: DataTypes.ENUM('activo', 'cerrado', 'cancelado'),
    defaultValue: 'activo'
  }
}, {
  tableName: 'talleres'
});

module.exports = Taller;