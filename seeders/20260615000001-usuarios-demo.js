const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    const hash = bcrypt.hashSync('123456', 10);
    await queryInterface.bulkInsert('usuarios', [
      { nombre: 'Juan Pérez', email: 'juan@correo.cl', password: hash, rol: 'usuario', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'María Soto', email: 'maria@correo.cl', password: hash, rol: 'usuario', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Carlos Ruiz', email: 'carlos@correo.cl', password: hash, rol: 'usuario', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('usuarios', { email: ['juan@correo.cl', 'maria@correo.cl', 'carlos@correo.cl'] }, {});
  }
};
