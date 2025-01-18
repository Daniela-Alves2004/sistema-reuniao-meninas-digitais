import React from "react";
import logoBranca from '../../../assets/logos/logoBranca.png';
import user from '../../../assets/icons/user.svg';

import "./Header.css";

function Header() {

  return (

    <header>

      <img
        src={logoBranca}
        alt="Logo do projeto de extensão Meninas Digitais na cor branca"
        width={100}
        height={100}
      />

      <img
        src={user}
        alt="Ícone de usuário"
        width={35}
        height={35}
      />

    </header>

  );

}


export default Header;