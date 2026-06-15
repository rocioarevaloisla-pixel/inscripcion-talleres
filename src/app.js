const express = require('express');
const cors = require('cors');
require('dotenv').config();

require('./models/index');

const authRouter = require('./routes/auth');
const talleresRouter = require('./routes/talleres');
const inscripcionesRouter = require('./routes/inscripciones');
const estadisticasRouter = require('./routes/estadisticas');
const listaEsperaRouter = require('./routes/listaEspera');
const { verificarToken, verificarTokenOpcional } = require('./middlewares/auth');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando' });
});
app.use('/api/auth', authRouter);

app.use('/api/talleres', verificarTokenOpcional, talleresRouter);
app.use('/api/inscripciones', verificarToken, inscripcionesRouter);
app.use('/api/estadisticas', verificarToken, estadisticasRouter);
app.use('/api/lista-espera', verificarToken, listaEsperaRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
