module.exports = {
  up: async (queryInterface) => {
    const talleresData = [
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
        posicion: 1,
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
        posicion: 2,
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
        posicion: 3,
        estado: 'activo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Gesti\u00f3n de Proyectos \u00c1giles',
        descripcion: 'Scrum, Kanban y herramientas digitales para gestionar proyectos.',
        instructor: 'Pedro Soto',
        capacidad_maxima: 5,
        imagen_url: 'https://picsum.photos/seed/proyectos/400/200',
        fecha_inicio: '2026-08-05',
        fecha_fin: '2026-08-07',
        hora_inicio: '15:00:00',
        hora_fin: '18:00:00',
        precio: 15000.00,
        posicion: 4,
        estado: 'activo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'CodyRockee',
        descripcion: 'Robotica educativa con CodyRockee: construye y programa tu primer robot desde cero.',
        instructor: 'Luis Vega',
        capacidad_maxima: 6,
        imagen_url: 'https://picsum.photos/seed/codyrockee/400/200',
        fecha_inicio: '2026-08-10',
        fecha_fin: '2026-08-12',
        hora_inicio: '10:00:00',
        hora_fin: '13:00:00',
        precio: 30000.00,
        posicion: 5,
        estado: 'activo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'BeeBot',
        descripcion: 'Pensamiento computacional con BeeBot: algoritmos, secuencias y logica divertida para ninos.',
        instructor: 'Valentina Rios',
        capacidad_maxima: 8,
        imagen_url: 'https://picsum.photos/seed/beebot/400/200',
        fecha_inicio: '2026-08-15',
        fecha_fin: '2026-08-17',
        hora_inicio: '14:00:00',
        hora_fin: '17:00:00',
        precio: 20000.00,
        posicion: 6,
        estado: 'activo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'CodeCraft',
        descripcion: 'Introduccion a la programacion con Python: videojuegos, datos y proyectos creativos.',
        instructor: 'Felipe Torres',
        capacidad_maxima: 10,
        imagen_url: 'https://picsum.photos/seed/codecraft/400/200',
        fecha_inicio: '2026-08-20',
        fecha_fin: '2026-08-22',
        hora_inicio: '09:00:00',
        hora_fin: '12:00:00',
        precio: 25000.00,
        posicion: 7,
        estado: 'activo',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    for (const t of talleresData) {
      const [existe] = await queryInterface.sequelize.query(
        'SELECT id FROM talleres WHERE nombre = ?', { replacements: [t.nombre] }
      );
      if (existe.length === 0) {
        await queryInterface.bulkInsert('talleres', [t], {});
      }
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('talleres', { nombre: [
      'Taller de Pintura al \u00d3leo',
      'Fotograf\u00eda de Retrato',
      'Introducci\u00f3n a la Cer\u00e1mica',
      'Gesti\u00f3n de Proyectos \u00c1giles',
      'CodyRockee',
      'BeeBot',
      'CodeCraft'
    ]}, {});
  }
};
