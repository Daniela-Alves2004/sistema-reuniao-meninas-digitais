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
