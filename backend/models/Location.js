const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Location extends Model { }

Location.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sala: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  
  sequelize,

  modelName: 'Location', 

  tableName: 'Local', 

  timestamps: false,

});

module.exports = Location;
