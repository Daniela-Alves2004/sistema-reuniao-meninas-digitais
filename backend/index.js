const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const locationRoutes = require('./routes/locationRoutes');
const minutesRoutes = require('./routes/minutesRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const dotenv = require('dotenv');

dotenv.config(); // Configura as variáveis de ambiente

const app = express(); // Inicializa o servidor

app.use(express.json()); // Permite o uso de JSON nas requisições
app.use(cookieParser()); // Permite o uso de cookies

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

app.use('/api/users', userRoutes); // Rota para usuários
app.use('/api/meetings', meetingRoutes); // Rota para reuniões
app.use('/api/locations', locationRoutes); // Rota para locais
app.use('/api/minutes', minutesRoutes); // Rota para atas
app.use('/api/invitations', invitationRoutes); // Rota para convites

const PORT = process.env.PORT || 3000; // Porta do servidor

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`)); // Inicia o servidor
