'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('talleres', 'hora_inicio', {
      type: Sequelize.TIME,
      allowNull: false,
      defaultValue: '09:00:00'
    });

    await queryInterface.addColumn('talleres', 'hora_fin', {
      type: Sequelize.TIME,
      allowNull: false,
      defaultValue: '18:00:00'
    });

    await queryInterface.addColumn('talleres', 'precio', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    });

    await queryInterface.sequelize.query(
      'UPDATE talleres SET fecha_fin = fecha_inicio WHERE fecha_fin IS NULL'
    );

    await queryInterface.changeColumn('talleres', 'fecha_fin', {
      type: Sequelize.DATEONLY,
      allowNull: false
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('talleres', 'precio');
    await queryInterface.removeColumn('talleres', 'hora_fin');
    await queryInterface.removeColumn('talleres', 'hora_inicio');

    await queryInterface.changeColumn('talleres', 'fecha_fin', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });
  }
};
