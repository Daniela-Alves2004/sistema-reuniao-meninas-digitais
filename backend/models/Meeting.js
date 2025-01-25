const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const Location = require('./Location'); 

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

  hora_reuniao: {

    type: DataTypes.TIME,

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

      model: 'Local', 

      key: 'id'

    }

  }

}, {

  sequelize,

  modelName: 'Meeting', 

  tableName: 'Reuniao', 

  timestamps: false,

});

Meeting.belongsTo(Location, { foreignKey: 'id_local', as: 'location' });

module.exports = Meeting;