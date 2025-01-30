import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoBranca from '../../assets/logos/logoBranca.png';
import user from '../../assets/icons/user.svg';
import notificationNull from '../../assets/icons/notificationNull.svg';
import exit from '../../assets/icons/exit.svg';
import home from '../../assets/icons/home.svg';
import { removeAuthTokenFromCookies, getDecodedToken } from "../../utils/cookies";
import { getInvitationsByUser } from "../../utils/api";  // Função que busca convites do usuário
import { getMeetingById } from "../../utils/api";  // Função para buscar as reuniões

import PopUp from '../PopUp/PopUp'; // Importe o componente PopUp
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]); // Estado para armazenar os convites
  const [showPopup, setShowPopup] = useState(false); // Estado para controlar o pop-up
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [meetingDetails, setMeetingDetails] = useState(null); // Estado para armazenar os detalhes da reunião

  // Função para buscar os convites ao montar o componente
  useEffect(() => {
    const fetchInvitations = async () => {
      setLoading(true); // Inicia o carregamento
      const token = getDecodedToken();
      if (token) {
        try {
          const response = await getInvitationsByUser(token.id); // Função para pegar convites
          setInvitations(response.data || []);
        } catch (error) {
          console.error("Erro ao buscar convites:", error);
        }
      }
      setLoading(false); // Finaliza o carregamento
    };
    fetchInvitations();
  }, []);

  const handleNotificationClick = () => {
    setShowPopup(prev => !prev); // Alterna a visibilidade do pop-up
    setMeetingDetails(null); // Reseta os detalhes da reunião ao fechar o pop-up
  };

  const handleLogout = () => {
    removeAuthTokenFromCookies();
    navigate('/');
  };

  const handleInvitationClick = async (meetingId) => {
    try {
      const meeting = await getMeetingById(meetingId); // Buscar reunião pelo id
      console.log('Detalhes da reunião:', meeting);
      setMeetingDetails(meeting); // Armazenar os detalhes da reunião no estado
    } catch (error) {
      console.error("Erro ao buscar reunião:", error);
    }
  };

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
          onClick={handleNotificationClick} // Abre o pop-up de convites
        />

        <img
          src={exit}
          alt="Ícone de sair"
          width={40}
          height={40}
          onClick={handleLogout}
        />
      </div>

      {/* Usando o componente PopUp */}
      <PopUp isOpen={showPopup} onClose={handleNotificationClick}>
        <h4>Convites:</h4>
        {loading ? (
          <p>Carregando...</p> // Exibe "Carregando..." enquanto os convites estão sendo carregados
        ) : invitations.length === 0 ? (
          <p>Você não tem convites.</p>
        ) : (
          <ul>
            {invitations.map((invitation, index) => (
              <li key={index} onClick={() => handleInvitationClick(invitation.id)}>
                <p><strong>{invitation.pauta}</strong> - {invitation.data_reuniao}</p>
                <p>{invitation.local || 'Local não especificado'}</p>
              </li>
            ))}
          </ul>
        )}
        
        {/* Exibe os detalhes da reunião, caso esteja disponível */}
        {meetingDetails && (
          <div>
            <h5>Detalhes da Reunião</h5>
            <p><strong>Pauta:</strong> {meetingDetails.pauta}</p>
            <p><strong>Data e Hora:</strong> {meetingDetails.data_reuniao}</p>
            <p><strong>Local:</strong> {meetingDetails.local || 'Local não especificado'}</p>
          </div>
        )}
      </PopUp>
    </header>
  );
}

export default Header;
