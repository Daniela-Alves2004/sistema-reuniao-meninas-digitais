const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Sector extends Model { }

// Modelo de setor
Sector.init({

    id:{

        type: DataTypes.INTEGER,

        autoIncrement: true,

        primaryKey: true

    },

    nome: {

        type: DataTypes.STRING,

        allowNull: false

    },

}, {

    sequelize, // Conexão com o banco de dados

    modelName: 'Setor', // Nome do modelo

    tableName: 'Setor', // Nome da tabela

    timestamps: false,

});