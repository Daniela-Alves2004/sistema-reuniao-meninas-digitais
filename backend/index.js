const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const locationRoutes = require('./routes/locationRoutes');
const minutesRoutes = require('./routes/minutesRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const sectorRoutes = require('./routes/sectorRoutes');
const dotenv = require('dotenv');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

dotenv.config(); // Configura as variáveis de ambiente
admin.initializeApp(); // Inicializa o Firebase Admin SDK (caso precise dele)

const app = express(); // Inicializa o servidor Express

app.use(express.json()); // Permite o uso de JSON nas requisições
app.use(cookieParser()); // Permite o uso de cookies

// Configuração do CORS
const origin = process.env.ORIGIN

app.use(cors({
  origin: origin, // Permite que o frontend acesse a API
  credentials: true
}));

// Rotas
app.use('/api/users', userRoutes); // Rota para usuários
app.use('/api/meetings', meetingRoutes); // Rota para reuniões
app.use('/api/locations', locationRoutes); // Rota para locais
app.use('/api/minutes', minutesRoutes); // Rota para atas
app.use('/api/invitations', invitationRoutes); // Rota para convites
app.use('/api/sectors', sectorRoutes); // Rota para setores

// Firebase Function para Express
exports.api = functions.https.onRequest(app); // Exporte o app Express como uma função do Firebase

// Para rodar localmente, use a porta configurada no ambiente ou 3000
const PORT = process.env.PORT || 3000; 
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`)); // Inicia o servidor apenas localmente, se não estiver em produção
}
