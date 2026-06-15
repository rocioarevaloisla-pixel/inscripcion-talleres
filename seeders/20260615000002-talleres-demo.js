module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('talleres', [
      {
        nombre: 'Taller de Pintura al Óleo',
        descripcion: 'Aprende técnicas básicas de pintura al óleo: color, textura y composición.',
        instructor: 'María González',
        capacidad_maxima: 5,
        imagen_url: 'https://picsum.photos/seed/pintura/400/200',
        fecha_inicio: '2026-07-01',
        fecha_fin: '2026-07-03',
        hora_inicio: '10:00:00',
        hora_fin: '13:00:00',
        precio: 25000.00,
        estado: 'activo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Fotografía de Retrato',
        descripcion: 'Domina la luz natural, encuadre y edición básica para retratos profesionales.',
        instructor: 'Carlos Muñoz',
        capacidad_maxima: 3,
        imagen_url: 'https://picsum.photos/seed/foto/400/200',
        fecha_inicio: '2026-07-10',
        fecha_fin: '2026-07-12',
        hora_inicio: '14:00:00',
        hora_fin: '17:00:00',
        precio: 35000.00,
        estado: 'activo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Introducción a la Cerámica',
        descripcion: 'Modelado a mano, torno básico y esmaltado para principiantes.',
        instructor: 'Ana Rivas',
        capacidad_maxima: 4,
        imagen_url: 'https://picsum.photos/seed/ceramica/400/200',
        fecha_inicio: '2026-07-20',
        fecha_fin: '2026-07-22',
        hora_inicio: '09:00:00',
        hora_fin: '12:00:00',
        precio: null,
        estado: 'activo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Gestión de Proyectos Ágiles',
        descripcion: 'Scrum, Kanban y herramientas digitales para gestionar proyectos.',
        instructor: 'Pedro Soto',
        capacidad_maxima: 5,
        imagen_url: 'https://picsum.photos/seed/proyectos/400/200',
        fecha_inicio: '2026-08-05',
        fecha_fin: '2026-08-07',
        hora_inicio: '15:00:00',
        hora_fin: '18:00:00',
        precio: 15000.00,
        estado: 'activo',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('talleres', { nombre: [
      'Taller de Pintura al Óleo',
      'Fotografía de Retrato',
      'Introducción a la Cerámica',
      'Gestión de Proyectos Ágiles'
    ]}, {});
  }
};
