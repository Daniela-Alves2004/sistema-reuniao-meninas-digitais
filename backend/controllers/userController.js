const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Configuração do dotenv

// Função para registrar um usuário
exports.registerUser = async (req, res) => {

  try {

    const { ra, primeiro_nome, ultimo_nome, email, senha, papel, telefone, id_setor } = req.body;

    const user = await User.create({ ra, primeiro_nome, ultimo_nome, email, senha, papel, telefone, id_setor });

    res.status(200).json({

      user,

      mensagem: 'Usuário registrado com sucesso',

    });

  } catch (error) {

    res.status(400).json({ error: error.message });

  }

};

// Função para um usuário fazer login
exports.loginUser = async (req, res) => {

  const { ra, senha } = req.body;

  try {

    const user = await User.findOne({ where: { ra, senha } });

    if (!user) {

      return res.status(401).json({ error: 'Credênciais inválidas' });

    }

    const token = jwt.sign({ 
      
      user_id: user.user_id, 
      ra: user.ra, 
      primeiro_nome: user.primeiro_nome, 
      segundo_nome: user.segundo_nome, 
      email: user.email, 
      telefone: user.telefone, 
      papel: user.papel, 
      id_setor: user.id_setor 
      
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({

      token,

      message: 'Login efetuado com sucesso',

      papel: user.papel,

    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
  
};

// Função para deletar um usuário
exports.deleteUser = async (req, res) => {

  const { id } = req.params;

  try {

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await user.destroy();

    res.json({ message: 'Usuário deletado' });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};
