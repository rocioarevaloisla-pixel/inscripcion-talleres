'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inscripciones', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre_alumno: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email_alumno: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      taller_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'talleres', key: 'id' },
        onDelete: 'CASCADE'
      },
      fecha_inscripcion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'confirmada', 'cancelada'),
        defaultValue: 'pendiente'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('inscripciones');
  }
};