const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
const userRoutes = require('./routes/userRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const locationRoutes = require('./routes/locationRoutes');
const dotenv = require('dotenv');

dotenv.config();

const app = express(); // Inicializa o servidor

app.use(express.json()); // Permite o uso de JSON nas requisições
app.use(cookieParser()); // Permite o uso de cookies

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true // Permite o envio de cookies
}));

app.use('/api/users', userRoutes); // Rota para usuários
app.use('/api/meetings', meetingRoutes); // Rota para reuniões
app.use('/api/locations', locationRoutes); // Rota para locais

app.use('/', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true })); // Proxy para o frontend

const PORT = process.env.PORT || 3000; // Porta do servidor

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`)); // Inicia o servidor
