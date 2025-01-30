const Invitation = require('../models/Invitation');

// Função para criar um convite
exports.createInvitation = async (req, res) => {
    
  const { id_reuniao, id_usuario } = req.body;

  try {

    const invitation = await Invitation.create({ id_reuniao, id_usuario });

    res.json(invitation);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

// Função para listar todos os convites através do id da reunião
exports.getInvitationsByMeetingId = async (req, res) => {

  const { id_reuniao } = req.params;

  console.log(id_reuniao); // Verifique se o id está sendo passado corretamente

  try {

    const invitations = await Invitation.findAll({ where: { id_reuniao } });

    console.log(invitations); 

    res.json(invitations);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

// Função para listar todos os convites através do id do usuário
exports.getInvitationsByUserId = async (req, res) => {

  const { id_usuario } = req.params;

  console.log(id_usuario); // Verifique se o id está sendo passado corretamente

  try {

    const invitations = await Invitation.findAll({ where: { id_usuario } });

    console.log(invitations); 

    res.json(invitations);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};