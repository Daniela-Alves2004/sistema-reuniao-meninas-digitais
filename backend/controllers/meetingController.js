const Meeting = require('../models/User');

// Função para criar uma reunião
exports.createMeeting = async (req, res) => {
  
  try {

    const { titulo, descricao, data_hora, id_sala, id_usuario } = req.body;

    const meeting = await Meeting.create({ titulo, descricao, data_hora, id_sala, id_usuario });

    res.status(200).json(

      { 
        
        meeting,

        mensagem: 'Reunião registrada com sucesso'
      
      }

    );

  } catch (error) {

    res.status(400).json({ error: error.message });

  }

};