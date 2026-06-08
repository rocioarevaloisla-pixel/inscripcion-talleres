'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('inscripciones', 'usuario_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: { model: 'usuarios', key: 'id' },
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('inscripciones', 'usuario_id');
  }
};
