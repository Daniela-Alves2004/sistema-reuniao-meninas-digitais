const Sector = require('../models/Sector');

// Função para criar um setor
exports.createSector = async (req, res) => {

  try {

    const { nome } = req.body;

    const sector = await Sector.create({ nome });

    res.status(200).json({

      sector,

      mensagem: 'Setor criado com sucesso',

    });

  } catch (error) {

    res.status(400).json({ error: error.message });

  }

};