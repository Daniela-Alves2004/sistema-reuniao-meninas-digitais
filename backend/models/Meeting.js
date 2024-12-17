const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Meeting extends Model { }

// Modelo de reunião
Meeting.init({

    id:{

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

            model: 'Local',

            key: 'id'

        }

    },



}, {

    sequelize, // Conexão com o banco de dados

    modelName: 'Reuniao', // Nome do modelo

    tableName: 'Reuniao', // Nome da tabela

    timestamps: false,

});