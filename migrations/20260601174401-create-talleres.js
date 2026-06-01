'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('talleres', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      instructor: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      capacidad_maxima: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 20
      },
      fecha_inicio: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      fecha_fin: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      estado: {
        type: Sequelize.ENUM('activo', 'cerrado', 'cancelado'),
        defaultValue: 'activo'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('talleres');
  }
};