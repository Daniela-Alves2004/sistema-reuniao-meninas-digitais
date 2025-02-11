import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import user from '../../assets/icons/user.svg';
import notificationNull from '../../assets/icons/notificationNull.svg';
import exit from '../../assets/icons/exit.svg';
import home from '../../assets/icons/home.svg';
import { removeAuthTokenFromCookies, getDecodedToken } from "../../utils/cookies";
import { getInvitationsByUser } from "../../utils/api"; 
import { getMeetingById } from "../../utils/api";  
import PopUp from '../PopUp/PopUp';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]); 
  const [showPopup, setShowPopup] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState(null); 
  const [readNotifications, setReadNotifications] = useState(() => {
    const storedReadNotifications = localStorage.getItem('readNotifications');
    return storedReadNotifications ? JSON.parse(storedReadNotifications) : [];
  });

  useEffect(() => {
    const fetchInvitations = async () => {
      setLoading(true); 
      const token = getDecodedToken();
      if (token) {
        try {
          const response = await getInvitationsByUser(token.id); 
          setInvitations(response.data);
        } catch (error) {
          console.error("Erro ao buscar convites:", error);
        }
      }
      setLoading(false); 
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
    if (meetingDetails && meetingDetails.id === meetingId) {
      setMeetingDetails(null); 
      return;
    }
    setMeetingDetails(null);
    try {
      const meeting = await getMeetingById(meetingId); 
      setMeetingDetails(meeting); 
      console.log("Detalhes da reunião:", meeting);

      // Marcar a notificação como lida
      if (!readNotifications.includes(meetingId)) {
        const updatedReadNotifications = [...readNotifications, meetingId];
        setReadNotifications(updatedReadNotifications);
        localStorage.setItem('readNotifications', JSON.stringify(updatedReadNotifications));
      }
    } catch (error) {
      console.error("Erro ao buscar reunião:", error);
    }
  };

  // Verifica se há notificações não lidas
  const hasUnreadNotifications = invitations.some(invitation => !readNotifications.includes(invitation.id_reuniao));

  return (
    <header>
      <img
        src={'./favicon.ico'}
        alt="Logo do projeto de extensão Meninas Digitais na cor branca"
        width={70}
        height={70}
        onClick={() => { navigate('/home') }}
        style={{ cursor: 'pointer' }}
      />
      <div className="divIcons">
        <img
          src={home}
          alt="Página home"
          width={30}
          height={30}
          onClick={() => { navigate('/home') }}
        />
        <img
          src={user}
          alt="Ícone de usuário"
          width={20}
          height={20}
          onClick={() => { navigate('/perfil') }}
        />
        <img
          src={notificationNull}
          alt="Ícone de notificação"
          width={30}
          height={30}
          onClick={handleNotificationClick} 
          style={{ backgroundColor: hasUnreadNotifications ? 'red' : 'transparent' }} 
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
          <p>Carregando...</p>
        ) : invitations.length === 0 ? (
          <p>Você não tem convites.</p>
        ) : (
          <ul>
            {invitations.map((invitation, index) => (
              <li key={index} onClick={() => handleInvitationClick(invitation.id_reuniao)} className="invitation">
                <p><strong>{invitation.meeting.pauta}</strong> - {new Date(new Date(invitation.meeting.data_reuniao).setDate(new Date(invitation.meeting.data_reuniao).getDate() + 1)).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</p>
              </li>
            ))}
          </ul>
        )}

        {meetingDetails && (
          <div className="meeting-details">
            <h5>Detalhes da Reunião</h5>
            <p><strong>Pauta:</strong> {meetingDetails.pauta}</p>
            <p><strong>Data e Hora:</strong> {new Date(new Date(meetingDetails.data_reuniao).setDate(new Date(meetingDetails.data_reuniao).getDate() + 1)).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</p>
            <p><strong>Local:</strong> {meetingDetails.location.sala || meetingDetails.location.link}</p>
          </div>
        )}
      </PopUp>
    </header>
  );
}

export default Header;