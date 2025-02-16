const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Meeting = require('./Meeting');
const User = require('./User');

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

            model: 'Meeting',

            key: 'id'

        }

    },

    id_usuario:{

        type: DataTypes.INTEGER,

        allowNull: false,

        references: {

            model: 'User',

            key: 'id'

        }

    }
    
}, {

    sequelize,

    modelName: 'Invitation',

    tableName: 'Convite',

    timestamps: false

});

Invitation.belongsTo(Meeting, { foreignKey: 'id_reuniao', as: 'meeting' });
Invitation.belongsTo(User, { foreignKey: 'id_usuario', as: 'user' });

module.exports = Invitation;

