const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const locationRoutes = require('./routes/locationRoutes');
const dotenv = require('dotenv');

dotenv.config();

const app = express(); // Inicializa o servidor

app.use(express.json()); // Permite o uso de JSON nas requisições

app.use(cors({ origin: 'http://localhost:3001' }));

app.use('/api/users', userRoutes); // Rota para usuários

app.use('/api/meetings', meetingRoutes); // Rota para reuniões

app.use('/api/locations', locationRoutes); // Rota para locais

const PORT = process.env.PORT; // Porta do servidor

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`)); // Inicia o servidor