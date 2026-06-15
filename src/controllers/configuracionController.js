const ConfiguracionVisual = require('../models/ConfiguracionVisual');

const getConfig = async (req, res, next) => {
  try {
    let config = await ConfiguracionVisual.findByPk(1);
    if (!config) {
      config = await ConfiguracionVisual.create({
        id: 1,
        settings: {
          vista: 'grid',
          tamano: 'med',
          soloActivos: true,
          soloConCupo: false,
          soloGratis: false,
          orden: 'default'
        }
      });
    }
    res.json(config.settings);
  } catch (err) {
    next(err);
  }
};

const updateConfig = async (req, res, next) => {
  try {
    let config = await ConfiguracionVisual.findByPk(1);
    if (!config) {
      config = await ConfiguracionVisual.create({ id: 1, settings: req.body });
    } else {
      config.settings = req.body;
      await config.save();
    }
    res.json(config.settings);
  } catch (err) {
    next(err);
  }
};

module.exports = { getConfig, updateConfig };
