// models/Meeting.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Location = require('./Location');  // Import the Location model

class Meeting extends Model { }

Meeting.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  data_reuniao: {
    type: DataTypes.DATE,
    allowNull: false
  },
  data_criacao: {
    type: DataTypes.DATE,
    allowNull: false
  },
  pauta: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_local: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Local', // This should reference the Location model
      key: 'id'
    }
  }
}, {
  sequelize, // Database connection
  modelName: 'Meeting', 
  tableName: 'Reuniao', 
  timestamps: false,
});

// Define the association between Meeting and Location
Meeting.belongsTo(Location, { foreignKey: 'id_local', as: 'location' });

module.exports = Meeting;
