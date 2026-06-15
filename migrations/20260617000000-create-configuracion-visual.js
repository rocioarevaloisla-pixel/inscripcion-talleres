'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('configuracion_visual', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        defaultValue: 1
      },
      settings: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: '{}'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.bulkInsert('configuracion_visual', [{
      id: 1,
      settings: JSON.stringify({
        vista: 'grid',
        tamano: 'med',
        soloActivos: true,
        soloConCupo: false,
        soloGratis: false,
        orden: 'default'
      })
    }]);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('configuracion_visual');
  }
};
