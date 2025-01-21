import React, { useState } from 'react';
import axios from 'axios';
import logoBranca from '../../../assets/logos/logoBranca.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './Cadastro.css';

function Cadastrar() {
  const [primeiroNome, setPrimeiroNome] = useState('');
  const [ultimoNome, setUltimoNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [ra, setRa] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const navigate = useNavigate();

  const handleCadastro = async (event) => {
    debugger;
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/users/register', {
        primeiro_nome: primeiroNome,
        ultimo_nome: ultimoNome,
        email: email,
        telefone: telefone,
        ra: ra,
        senha: senha,
        confirmarSenha: confirmarSenha,
      });

      console.log('Resposta do cadastro:', response.mensagem);

      toast.success('Cadastro bem-sucedido!', {
        autoClose: 1000,
      });

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast.error('Erro no cadastro. Verifique as informações inseridas.', {
        autoClose: 3000,
      });
      console.error('Erro no cadastro:', error);
    }
  };

  return (
    <div className='cadastro-container-wrapper'>
      <div className='cadastro-container-logo'>
        <img
          src={logoBranca}
          alt="Logo do projeto de extensão Meninas Digitais na cor branca"
        />
        <p>Cadastro</p>
      </div>
      <div className='cadastro-container-cadastro'>
        <form onSubmit={handleCadastro}>
          <div className='cadastro-container-dados'>
            <div className='cadastro-coluna'>
              <div className='cadastro-nome'>
                <label htmlFor="primeiro-nome">Primeiro Nome:</label>
                <input
                  type="text"
                  id="primeiro-nome"
                  name="primeiro-nome"
                  value={primeiroNome}
                  onChange={(e) => setPrimeiroNome(e.target.value)}
                />
                <label htmlFor="ultimo-nome">Último Nome:</label>
                <input
                  type="text"
                  id="ultimo-nome"
                  name="ultimo-nome"
                  value={ultimoNome}
                  onChange={(e) => setUltimoNome(e.target.value)}
                />
              </div>
              <div className='cadastro-senha'>
                <label htmlFor="senha">Senha:</label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <label htmlFor="confirmar-senha">Confirmar Senha:</label>
                <input
                  type="password"
                  id="confirmar-senha"
                  name="confirmar-senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
              </div>
            </div>
            <div className='cadastro-coluna'>
              <div className='cadastro-contato'>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="telefone">Telefone:</label>
                <input
                  type="text"
                  id="telefone"
                  name="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>
              <div className='cadastro-academico'>
                <label htmlFor="ra">RA:</label>
                <input
                  type="number"
                  id="ra"
                  name="ra"
                  value={ra}
                  onChange={(e) => setRa(e.target.value)}
                />
                <label className="cadastro-setores">Setor e Papel:</label>
                <div className='cadastro-setor-papel'>
                  <select
                    id='setores'
                    name='setores'>
                      <option disabled value selected>--Setores--</option>
                      <option value='1'>Marketing</option>
                      <option value='2'>Gestão de Pessoas</option>
                      <option value='3'>Conteúdo</option>
                      <option value='4'>Instrutores</option>
                      <option value='5'>Professores</option>
                  </select>
                  <select
                    id='papeis'
                    name='papeis'>
                      <option disabled value selected>--Papeis--</option>
                      <option value='Aluna'>Aluna</option>
                      <option value='Professora'>Professora</option>
                      <option value='Coordenadora de setor'>Coordenadora de setor</option>
                    </select>
                </div>
              </div>
            </div>
            <div className="cadastro-container-botoes">
                  <Botao className="btCadastrar" type="submit" texto="Cadastrar-se" onClick={() => console.log('Cadastrar-se clicado')} />
                  <Botao className="btIrParaLogin" type="button" texto="Voltar para login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} />
            </div>

          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Cadastrar;