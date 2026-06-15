const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const PasswordResetToken = sequelize.define('PasswordResetToken', {
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  tableName: 'password_reset_tokens',
  timestamps: true,
  underscored: true
});

module.exports = PasswordResetToken;
