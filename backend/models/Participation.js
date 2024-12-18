const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Participation extends Model { }

// Modelo de participação
Participation.init({

    id:{

        type: DataTypes.INTEGER,

        autoIncrement: true,

        primaryKey: true

    },

    presente: {

        type: DataTypes.BOOLEAN,

        allowNull: false

    },

    id_reuniao: {

        type: DataTypes.INTEGER,

        allowNull: false,

        references: {

            model: 'Reuniao',

            key: 'id'

        }

    },

    id_usuario: {

        type: DataTypes.INTEGER,

        allowNull: false,

        references: {

            model: 'Usuario',

            key: 'id'

        }

    },

}, {

    sequelize, // Conexão com o banco de dados

    modelName: 'Participacao', // Nome do modelo

    tableName: 'Participacao', // Nome da tabela

    timestamps: false,

});