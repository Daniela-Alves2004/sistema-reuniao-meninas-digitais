const Minutes = require('../models/Minutes');

// Função para criar atas
exports.createMinutes = async (req, res) => {

    const { conteudo, id_reuniao } = req.body;

    try {

        const minutes = await Minutes.create({ 
            
            conteudo, 
            
            id_reuniao 
        
        });

        res.status(201).json(minutes);

    } catch (error) {

        console.error('Error creating minutes:', error);

        res.status(400).json({ error: error.message });

    }

}

// Função para listar ata utilizando o id da reunião
exports.listMinutesByMeeting = async (req, res) => {

    const { id } = req.params;

    try {

        const minutes = await Minutes.findAll({ where: { id_reuniao: id } });

        res.status(200).json(minutes);

    } catch (error) {

        console.error('Error listing minutes:', error);

        res.status(400).json({ error: error.message });

    }

}