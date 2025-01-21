import React, { useState } from 'react';
import axios from 'axios';
import logoBranca from '../../../assets/logos/logoBranca.png';
import Botao from '../../micro/Botao/Botao';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
require('./Login.css');

const Login = () => {

  const [registroAluno, setRegistroAluno] = useState('');
  
  const [senha, setSenha] = useState('');

  const navigate = useNavigate(); 

  const handleLogin = async (event) => {

    event.preventDefault();

    try {

      const response = await axios.post(`http://localhost:3000/api/users/login`, {

        ra: registroAluno,

        senha: senha,

      }, {

        withCredentials: true,

      });

      console.log('Resposta do login:', response.data.message);

      toast.success('Login bem-sucedido!', {

        autoClose: 1000, 

      });

      setTimeout(() => {

        navigate('/home');

      }, 3000); 

    } catch (error) {

      toast.error('Erro no login. Verifique suas credenciais.', {

        autoClose: 3000,

      });

      console.error('Erro no login:', error);

    }

  };

  return (

    <div className="container-wrapper">

      <div className="container-logo">
      
        <img

          src={logoBranca}

          alt="Logo do projeto de extensão Meninas Digitais na cor branca"

        />

      </div>

      <div className="container-login">

        <form onSubmit={handleLogin}>

          <div className='container-dados'>

            <label htmlFor="registro-aluno">RA:</label>

            <input

              type="number"
              id="registro-aluno"
              name="registro-aluno"
              value={registroAluno}
              onChange={(e) => setRegistroAluno(e.target.value)}

            />

            <label htmlFor="senha">Senha:</label>

            <input

              type="password"
              id="senha"
              name="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}

            />

          </div>

          <div className='container-botoes'>

            <Botao className="btEntrar" type="submit" texto="Entrar" />

            <Botao className="btCadastrar" type="button" texto="Cadastrar" Click={() => console.log('Cadastrar clicado')} />

          </div>

        </form>

        <p className='esqueceu-senha'>Esqueceu a senha?</p>

        <p className='saiba-mais'>Clique aqui para saber mais sobre o nosso projeto!</p>

      </div>

      <ToastContainer />

    </div>

  );

};

export default Login;