const Meeting = require('../models/Meeting');

// Função para buscar reuniões por data
exports.getMeetingByDate = async (req, res) => {
  
    const { date } = req.query;

    console.log('date:', date);

    try {

        const meetings = await Meeting.findAll({

            where: {

                data_reuniao: date 

            }

        });

        res.status(200).json({ meetings });

        console.log(meetings);

    } catch (error) {

        console.error('Error fetching meetings:', error);

        res.status(400).json({ error: error.message });

    }

};

// Função para buscar reuniões por id
exports.getMeetingById = async (req, res) => {

    const { id } = req.params;

    try {

        const meeting = await Meeting.findByPk(id);

        if (!meeting) {

            return res.status(404).json({ error: 'Reunião não encontrada' });

        }

        res.json(meeting);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};

// Função para criar reuniões
exports.createMeeting = async (req, res) => {

    const { data_reuniao, hora_reuniao, pauta, id_local } = req.body;

    try {

        const meeting = await Meeting.create({

            data_reuniao,

            hora_reuniao,

            data_criacao: new Date(),

            pauta,

            id_local

        });

        res.status(201).json({ meeting });

    } catch (error) {

        console.error('Error creating meeting:', error);

        res.status(400).json({ error: error.message });

    }

}