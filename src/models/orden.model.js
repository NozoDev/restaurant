const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const Orden = db.define('orden', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  foodId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'cancelled', 'completed'),
    allowNull: false,
    defaultValue: 'active',
  },
});

module.exports = Orden;
