const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Taller = require('./Taller');
const Usuario = require('./Usuario');

const ListaEspera = sequelize.define('ListaEspera', {
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  taller_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_solicitud: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'aceptada', 'cancelada'),
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'lista_espera'
});

Taller.hasMany(ListaEspera, { foreignKey: 'taller_id' });
ListaEspera.belongsTo(Taller, { foreignKey: 'taller_id' });

Usuario.hasMany(ListaEspera, { foreignKey: 'usuario_id' });
ListaEspera.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = ListaEspera;
