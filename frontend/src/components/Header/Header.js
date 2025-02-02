import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
          setInvitations(response.data);
        } catch (error) {
          console.error("Erro ao buscar convites:", error);
        }
      }
      setLoading(false); // Finaliza o carregamento
    };
    fetchInvitations();
  }, []);

  const handleNotificationClick = () => {
    setShowPopup(prev => !prev);
    setMeetingDetails(null);
  };

  const handleLogout = () => {
    removeAuthTokenFromCookies();
    navigate('/');
  };

  const handleInvitationClick = async (meetingId) => {
    // Se o meetingId for o mesmo que o meetingDetails.id, apenas fecha os detalhes
    if (meetingDetails && meetingDetails.id === meetingId) {
      setMeetingDetails(null); // Fecha os detalhes da reunião
      return;
    }
  
    // Limpa os detalhes da reunião antes de buscar novos detalhes
    setMeetingDetails(null);
  
    try {
      const meeting = await getMeetingById(meetingId); // Buscar reunião pelo id
      setMeetingDetails(meeting); // Armazenar os detalhes da reunião no estado
    } catch (error) {
      console.error("Erro ao buscar reunião:", error);
    }
  };

  return (
    <header>
      <img
        src={'./favicon.ico'}
        alt="Logo do projeto de extensão Meninas Digitais na cor branca"
        width={70}
        height={70}
      />

      <div className="divIcons">
        <img
          src={home}
          alt="Página home"
          width={30}
          height={30}
          onClick={() => { navigate('/home') }}
        />

        {(getDecodedToken().papel === 'Lider') ? (
          <img
            src={user}
            alt="Ícone de usuário"
            width={20}
            height={20}
            onClick={() => { navigate('/perfil-admin') }}
          />
        ) : (
          <img
            src={user}
            alt="Ícone de usuário"
            width={20}
            height={20}
            onClick={() => { navigate('/perfil-usuario') }}
          />
        )}

        <img
          src={notificationNull}
          alt="Ícone de notificação"
          width={30}
          height={30}
          onClick={handleNotificationClick} // Abre o pop-up de convites
        />

        <img
          src={exit}
          alt="Ícone de sair"
          width={30}
          height={30}
          onClick={handleLogout}
        />
      </div>

      {/* PopUp para visualizar os convites */}
      <PopUp isOpen={showPopup} onClose={handleNotificationClick}>
        <h4>Convites:</h4>
        {loading ? (
          <p>Carregando...</p> // Exibe "Carregando..." enquanto os convites estão sendo carregados
        ) : invitations.length === 0 ? (
          <p>Você não tem convites.</p>
        ) : (
          <ul>
            {invitations.map((invitation, index) => (
              <li key={index} onClick={() => handleInvitationClick(invitation.id_reuniao)} className="invitation">
                <p><strong>{invitation.meeting.pauta}</strong> - {invitation.meeting.data_reuniao}</p>
              </li>
            ))}
          </ul>
        )}
        
        {/* Exibe os detalhes da reunião, caso esteja disponível */}
        {meetingDetails && (
          <div className="meeting-details">
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
