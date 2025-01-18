const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model { }

// Modelo de usuário
User.init({

    id:{

        type: DataTypes.INTEGER,

        autoIncrement: true,

        primaryKey: true

    },

    ra: {

        type: DataTypes.INTEGER,

        allowNull: false

    },

    primeiro_nome: {

        type: DataTypes.STRING,

        allowNull: false

    },

    ultimo_nome: {

        type: DataTypes.STRING,

        allowNull: false

    },

    papel: {

        type: DataTypes.STRING,

        allowNull: false

    },

    email: {

        type: DataTypes.STRING,

        allowNull: false

    },

    telefone: {

        type: DataTypes.STRING,

        allowNull: false

    },

    senha: {
        
        type: DataTypes.STRING,

        allowNull: false

    },

    id_setor: {

        type: DataTypes.INTEGER,

        allowNull: false,

        references: {

            model: 'Setor',

            key: 'id'

        }

    }

}, {

    sequelize, // Conexão com o banco de dados
  
    modelName: 'User', // Nome do modelo

    tableName: 'Usuario', // Evita pluralização automática para "Usuarios"
  
    timestamps: false,

});

module.exports = User;