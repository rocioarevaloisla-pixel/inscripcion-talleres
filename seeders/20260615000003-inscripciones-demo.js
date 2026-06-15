module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [usuarios] = await queryInterface.sequelize.query(
      `SELECT id, email FROM usuarios WHERE email IN ('juan@correo.cl', 'maria@correo.cl', 'carlos@correo.cl')`
    );
    const [talleres] = await queryInterface.sequelize.query(
      `SELECT id, nombre FROM talleres WHERE nombre IN (
        'Taller de Pintura al Óleo',
        'Fotografía de Retrato',
        'Introducción a la Cerámica',
        'Gestión de Proyectos Ágiles'
      )`
    );

    const userMap = {};
    usuarios.forEach(u => { userMap[u.email] = u.id; });

    const tallerMap = {};
    talleres.forEach(t => { tallerMap[t.nombre] = t.id; });

    const ahora = new Date();

    await queryInterface.bulkInsert('inscripciones', [
      {
        taller_id: tallerMap['Taller de Pintura al Óleo'],
        usuario_id: userMap['juan@correo.cl'],
        nombre_alumno: 'Juan Pérez',
        email_alumno: 'juan@correo.cl',
        estado: 'confirmada',
        fecha_inscripcion: ahora,
        createdAt: ahora,
        updatedAt: ahora
      },
      {
        taller_id: tallerMap['Fotografía de Retrato'],
        usuario_id: userMap['maria@correo.cl'],
        nombre_alumno: 'María Soto',
        email_alumno: 'maria@correo.cl',
        estado: 'confirmada',
        fecha_inscripcion: ahora,
        createdAt: ahora,
        updatedAt: ahora
      },
      {
        taller_id: tallerMap['Taller de Pintura al Óleo'],
        usuario_id: userMap['carlos@correo.cl'],
        nombre_alumno: 'Carlos Ruiz',
        email_alumno: 'carlos@correo.cl',
        estado: 'pendiente',
        fecha_inscripcion: ahora,
        createdAt: ahora,
        updatedAt: ahora
      }
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('inscripciones', {
      email_alumno: ['juan@correo.cl', 'maria@correo.cl', 'carlos@correo.cl']
    }, {});
  }
};
