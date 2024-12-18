const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Report extends Model { }

// Modelo de relatório
Report.init({

    id:{

        type: DataTypes.INTEGER,

        autoIncrement: true,

        primaryKey: true

    },

    data_criacao:{

        type: DataTypes.DATE,

        allowNull: false

    },

    tipo_relatorio: {

        type: DataTypes.STRING,

        allowNull: false

    },

    conteudo: {

        type: DataTypes.TEXT,

        allowNull: false

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

    modelName: 'Report',

    tableName: 'Report',

});