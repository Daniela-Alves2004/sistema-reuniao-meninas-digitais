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

  try {

    const invitations = await Invitation.findAll({ where: { id_reuniao } });

    res.json(invitations);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

// Função para listar todos os convites através do id do usuário
exports.getInvitationsByUserId = async (req, res) => {

  const { id_usuario } = req.params;

  try {

    const invitations = await Invitation.findAll({
      where: { id_usuario },
      include: ['meeting'] // Usando o alias 'meeting' definido na associação
    });

    console.log('Convites:', invitations);

    res.json(invitations);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};