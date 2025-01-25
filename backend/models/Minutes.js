const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const Meeting = require('./Meeting');

class Minutes extends Model { }

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

    id_reuniao: {

        type: DataTypes.INTEGER,

        allowNull: false,

        references: {

            model: 'Meeting',

            key: 'id'

        }

    }
    
}, {

    sequelize,

    modelName: 'Minute',

    tableName: 'Ata',

    timestamps: false

});

Minutes.belongsTo(Meeting, { foreignKey: 'id_reuniao', as: 'meeting' });

module.exports = Minutes;