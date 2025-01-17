import React from 'react';
import logoBranca from '../../../assets/logos/logoBranca.png';
import Botao from '../../Micro/Botao/Botao';
import './Style.css';
const Login = () => {
  return (
    <div className="container-wrapper">
      <div className="container-logo">
        <img
          src={logoBranca}
          alt="Logo do projeto de extensão Meninas Digitais na cor branca"
        />
      </div>
      <div className="container-login">
        <form>
          <div className='container-dados'>
            <label htmlFor="registro-aluno">RA:</label>
            <input type="number" id="registro-aluno" name="registro-aluno" />
            <label htmlFor="senha">Senha:</label>
            <input type="password" id="senha" name="senha" />

          </div>
          <div className='container-botoes'>
            <Botao className="btEntrar" type="submit" texto="Entrar" Click={() => console.log('Entrar clicado')} />
            <Botao className="btCadastrar" type="button" texto="Cadastrar" Click={() => console.log('Cadastrar clicado')} />
          </div>
        </form>
        <p className='esqueceu-senha'>Esqueceu a senha?</p>
        <p className='saiba-mais'>Clique aqui para saber mais sobre o nosso projeto!</p>
    
      </div>
    </div>
  );
};

export default Login;
