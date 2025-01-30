import React from "react";
import { useNavigate } from "react-router-dom";
import logoBranca from '../../assets/logos/logoBranca.png';
import user from '../../assets/icons/user.svg';
import notificationNull from '../../assets/icons/notificationNull.svg';
import exit from '../../assets/icons/exit.svg';
import home from '../../assets/icons/home.svg';

import { removeAuthTokenFromCookies, getDecodedToken } from "../../utils/cookies";

import "./Header.css";

function Header() {

  const navigate = useNavigate();

  return (
    <header>
      <img
        src={logoBranca}
        alt="Logo do projeto de extensão Meninas Digitais na cor branca"
        width={125}
        height={125}
      />

      <div className="divIcons">

        <img
          src={home}
          alt="Página home"
          width={40}
          height={40}
          onClick={() => { navigate('/home') }}
        />

        {(getDecodedToken().papel === 'Lider') ? (

          <img
            src={user}
            alt="Ícone de usuário"
            width={30}
            height={30}
            onClick={() => { navigate('/perfil-admin') }}
          />

        ) : (

          <img
            src={user}
            alt="Ícone de usuário"
            width={30}
            height={30}
            onClick={() => { navigate('/perfil-usuario') }}
          />

        )}

        <img
          src={notificationNull}
          alt="Ícone de notificação"
          width={40}
          height={40}
        />

        <img
          src={exit}
          alt="Ícone de sair"
          width={40}
          height={40}
          onClick={() => { removeAuthTokenFromCookies(); navigate('/'); }}
        />

      </div>
    </header>
  );
}

export default Header;