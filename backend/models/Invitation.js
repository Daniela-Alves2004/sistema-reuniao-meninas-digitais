const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Invitation extends Model { }

// Modelo de convite
Invitation.init({

    id:{

        type: DataTypes.INTEGER,

        autoIncrement: true,

        primaryKey: true

    },

    id_reuniao:{

        type: DataTypes.INTEGER,

        allowNull: false,

        references: {

            model: 'Reuniao',

            key: 'id'

        }

    },

    id_usuario:{

        type: DataTypes.INTEGER,

        allowNull: false,

        references: {

            model: 'Usuario',

            key: 'id'

        }

    }
    
}, {

    sequelize,

    modelName: 'Convite',

    tableName: 'Convite',

});


