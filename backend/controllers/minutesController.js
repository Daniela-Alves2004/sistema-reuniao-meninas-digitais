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