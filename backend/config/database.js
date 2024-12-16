const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(

  process.env.POSTGRES_DB, // Nome do banco de dados

  process.env.POSTGRES_USER, // Usuário

  process.env.POSTGRES_PASSWORD, // Senha

  {

    host: 'localhost', // Host
    
    dialect: 'postgres', // Dialeto

  }

);

module.exports = sequelize;