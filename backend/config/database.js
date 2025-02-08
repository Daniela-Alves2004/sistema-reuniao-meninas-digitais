const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.POSTGRES_DB, // Nome do banco de dados
  process.env.POSTGRES_USER, // Usuário
  process.env.POSTGRES_PASSWORD, // Senha
  {
    host: process.env.POSTGRES_HOST, // Host
    dialect: 'postgres', // Dialeto
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    port: 5432 // Certifique-se de que a porta está correta
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });

module.exports = sequelize;
