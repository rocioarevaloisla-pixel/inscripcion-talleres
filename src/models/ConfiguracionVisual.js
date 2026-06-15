const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ConfiguracionVisual extends Model {}

  ConfiguracionVisual.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      defaultValue: 1
    },
    settings: {
      type: DataTypes.TEXT,
      defaultValue: '{}',
      get() {
        const raw = this.getDataValue('settings');
        try { return JSON.parse(raw); }
        catch { return {}; }
      },
      set(value) {
        this.setDataValue('settings', JSON.stringify(value));
      }
    }
  }, {
    sequelize,
    modelName: 'ConfiguracionVisual',
    tableName: 'configuracion_visual',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ConfiguracionVisual;
};
