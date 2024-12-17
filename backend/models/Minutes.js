const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Minutes extends Model { }

// Modelo de ata
Minutes.init({

    id:{

        type: DataTypes.INTEGER,

        autoIncrement: true,

        primaryKey: true

    },

    conteudo: {

        type: DataTypes.TEXT,

        allowNull: false

    },

    arquivos: {

        type: DataTypes.STRING,

        allowNull: true

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

    sequelize,

    modelName: 'Ata',

    tableName: 'Ata',

});