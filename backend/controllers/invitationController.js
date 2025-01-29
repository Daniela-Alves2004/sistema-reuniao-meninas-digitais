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