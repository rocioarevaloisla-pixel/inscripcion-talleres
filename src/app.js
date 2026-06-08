const express = require('express');
const cors = require('cors');
require('dotenv').config();

require('./models/index');

const authRouter = require('./routes/auth');
const talleresRouter = require('./routes/talleres');
const inscripcionesRouter = require('./routes/inscripciones');
const { verificarToken } = require('./middlewares/auth');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

//Rutas públicas (documentado para GEN-06)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando' });
});
app.use('/api/auth', authRouter); // /registro y /login son públicas

//Rutas protegidas (requieren JWT válido)
app.use('/api/talleres', verificarToken, talleresRouter);
app.use('/api/inscripciones', verificarToken, inscripcionesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;