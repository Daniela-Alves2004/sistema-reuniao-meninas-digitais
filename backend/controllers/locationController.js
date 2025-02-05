const Location = require('../models/Location');
const Meeting = require('../models/Meeting'); 

// Função para pegar a localização de uma reunião
exports.getLocationByMeeting = async (req, res) => {
  
  const { meetingId } = req.query;

  try {

    const meeting = await Meeting.findOne({

      where: { id: meetingId },

      include: [{

        model: Location,

        as: 'location', 

      }],

    });

    if (!meeting) {

      return res.status(404).json({ error: 'Meeting not found' });

    }

    res.status(200).json({ location: meeting.location });

  } catch (error) {

    console.error('Error fetching location:', error);

    res.status(400).json({ error: error.message });

  }

};

// Função para pegar todas as localizações
exports.getAllLocations = async (req, res) => {

  try {

    const locations = await Location.findAll();

    res.status(200).json({ locations });

  } catch (error) {

    console.error('Error fetching locations:', error);

    res.status(400).json({ error: error.message });

  }

};

// Função para criar localizações
exports.createLocation = async (req, res) => {

  const { tipo, link, sala } = req.body;

  try {

    const location = await Location.create({ tipo, link, sala });

    res.status(201).json({ location });

  } catch (error) {

    console.error('Error creating location:', error);

    res.status(400).json({ error: error.message });

  }

};