import React, { useState } from 'react';
import axios from 'axios';
import logoBranca from '../../assets/logos/logoBranca.png';
import Botao from '../../components/Botao/Botao';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

require('./Login.css');

const Login = () => {

  const [registroAluno, setRegistroAluno] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (event) => {
    event.preventDefault();
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        ra: registroAluno,
        senha: senha,
      }, {
        withCredentials: true,
      });
      if (response.data.papel === 'Membro') {
        Cookies.set('authToken', response.data.token, { expires: 1 });
        toast.success('Login bem-sucedido!', {
          autoClose: 1000,
        });
        setTimeout(() => {navigate('/home');}, 1000);
      } else if ((response.data.papel === 'Lider') || (response.data.papel === 'Coordenadora')) {
        Cookies.set('authToken', response.data.token, { expires: 1 });
        toast.success('Login bem-sucedido!', {
          autoClose: 1000,
        });
        setTimeout(() => {navigate('/home');}, 1000);
      }
    } catch (error) {
      toast.error('Erro no login. Verifique suas credenciais.', {
        autoClose: 3000,
      });
      console.error('Erro no login:', error);
    }
  };

  return (
    <div className="login-container-wrapper">
      <div className="login-container-logo">
        <img
          src={logoBranca}
          alt="Logo do projeto de extensão Meninas Digitais na cor branca"
        />
      </div>
      <div className="container-login">
        <form onSubmit={handleLogin}>
          <div className='login-container-dados'>
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
          <div className='login-container-botoes'>
            <Botao className="btEntrar" type="submit" texto="Entrar" />
          </div>
        </form>
        <p className='login-saiba-mais'>Clique aqui para saber mais sobre o nosso projeto!</p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
