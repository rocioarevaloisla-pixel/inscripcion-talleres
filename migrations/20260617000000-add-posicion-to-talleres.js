module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('talleres', 'posicion', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('talleres', 'posicion');
  }
};
