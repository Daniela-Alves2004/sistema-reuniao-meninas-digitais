import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import Header from '../../components/Header/Header';
import Botao from '../../components/Botao/Botao';
import PopUp from '../../components/PopUp/PopUp';
import Calendar from 'react-calendar';
import { ToastContainer, toast } from 'react-toastify';
import { getAuthTokenFromCookies, getDecodedToken } from '../../utils/cookies';
import {
  getMeetingsByDate,
  getMeetingDetails,
  getAllLocations,
  getAllUsers,
  createMeeting,
  sendInvitations,
  addMinutesToMeeting,
  getInvitationsByMeeting,
  getMeetingMinutes,
  getUserById,
} from '../../utils/api';
import Select from 'react-select';
import './Home.css';

const Home = () => {

  const [date, setDate] = useState(new Date());
  const [popupState, setPopupState] = useState(null);
  const [meetingData, setMeetingData] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [meetingMinutes, setMeetingMinutes] = useState([]);
  const [error, setError] = useState(null);

  const userOptions = users.map(user => ({
    value: user.id,
    label: `${user.primeiro_nome} ${user.ultimo_nome}`,
  }));

  const handleUserChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions.map(option => option.value));
  };

  const handleDateChange = async (newDate) => {
    setDate(newDate);
    setPopupState('popup');
    setError(null);
    try {
      const response = await getMeetingsByDate(newDate);
      setMeetingData(response);
    } catch (error) {
      setMeetingData(null);
      setError('Erro ao buscar dados da reunião. Tente novamente mais tarde.');
    }
  };

  const closePopup = () => setPopupState(null);

  const openMeetingDetails = async (meeting) => {
    setSelectedMeeting(meeting);
    setPopupState('details');
    try {
      const locationResponse = await getMeetingDetails(meeting.id);
      const minutesResponse = await getMeetingMinutes(meeting.id);
      const invitationResponse = await getInvitationsByMeeting(meeting.id);
      const invitedUserIds = invitationResponse.data.map(invitation => invitation.id_usuario);

      const usersDetails = await Promise.all(
        invitedUserIds.map(async (userId) => {
          const userResponse = await getUserById(userId);
          return userResponse.data;
        })
      );

      setSelectedMeeting(prev => ({
        ...prev,
        location: locationResponse.location,
        invitedUsers: usersDetails,
      }));
      setMeetingMinutes(minutesResponse.data || []);
    } catch (error) {
      setSelectedMeeting(prev => ({ ...prev, location: null, invitedUsers: [] }));
    }
  };

  const handleAddMeetingClick = async () => {
    setPopupState('addMeeting');
    try {
      const [locationsResponse, usersResponse] = await Promise.all([getAllLocations(), getAllUsers()]);
      setLocations(locationsResponse || []);
      setUsers(usersResponse || []);
    } catch (error) {
      toast.error('Erro ao buscar dados. Tente novamente mais tarde.');
    }
  };

  const handleAddSubmit = async (event, isMinutes = false) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { pauta, hora_reuniao, data_reuniao, meetingLocation, ata } = Object.fromEntries(formData);
    const data = {
      pauta,
      hora_reuniao,
      data_reuniao,
      id_local: parseInt(meetingLocation),
    };

    try {
      if (isMinutes) {
        const token = getAuthTokenFromCookies();
        if (!token) {
          throw new Error('Token de autenticação não encontrado');
        }
        if (!ata || ata.trim() === "") {
          toast.error('Conteúdo da ata não pode ser vazio');
          return;
        }
        const response = await addMinutesToMeeting(selectedMeeting.id, ata, token);
        console.log('response:', response);
        toast.success('Ata adicionada com sucesso!');
        const updatedMinutes = await getMeetingMinutes(selectedMeeting.id);
        setMeetingMinutes(updatedMinutes.data || []);
        closePopup();

      } else {
        const response = await createMeeting(data);
        toast.success('Reunião criada com sucesso!');
        closePopup();
        await sendInvitationsToUsers(response.meeting.id);
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error(`Erro ao ${isMinutes ? 'adicionar ata' : 'criar reunião'}. Verifique os dados.`);
    }
  };

  const sendInvitationsToUsers = async (meetingId) => {
    try {
      await sendInvitations(meetingId, selectedUsers);
      toast.success('Convites enviados com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar convites:', error);
      toast.error('Erro ao enviar convites. Tente novamente.');
    }
  };

  // Função para renderizar o popup de reuniões
  const renderMeetingPopup = () => (
    <PopUp isOpen={popupState === 'popup'} onClose={closePopup}>
      {error ? (
        <p>{error}</p>
      ) : meetingData && meetingData.length > 0 ? (
        <div>
          <p>{new Date(meetingData[0].data_reuniao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</p>
          <ul>
            {meetingData.map((meeting, index) => (
              <li key={index} onClick={() => openMeetingDetails(meeting)}>
                {meeting.pauta}
              </li>
            ))}
          </ul>
          {getDecodedToken()?.papel.trim() === 'Lider' && (
            <Botao texto={"+ Criar Reunião"} className="btAdicionar" onClick={handleAddMeetingClick} />
          )}
        </div>
      ) : (
        <>
          {getDecodedToken()?.papel.trim() === 'Lider' && (
            <Botao texto={"+ Criar Reunião"} className="btAdicionar" onClick={handleAddMeetingClick} />
          )}
          <p>Nenhuma reunião marcada para o dia.</p>
        </>
      )}
    </PopUp>
  );

  // Função para renderizar o popup de detalhes da reunião
  const renderMeetingDetailsPopup = () => (
    <PopUp isOpen={popupState === 'details'} onClose={closePopup}>
      {selectedMeeting ? (
        <div>
          <h4>Informações da reunião:</h4>
          {selectedMeeting.location ? (
            <div>
              <p><strong>Pauta:</strong> {selectedMeeting.pauta}</p>
              <p><strong>Hora da Reunião: </strong>{new Date(`1970-01-01T${selectedMeeting.hora_reuniao}`).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
              {selectedMeeting.location.link ? (
                <p><strong>Local:</strong> Remoto - <a href={selectedMeeting.location.link} target="_blank" rel="noopener noreferrer">{selectedMeeting.location.link}</a></p>
              ) : (
                <p><strong>Local:</strong> {selectedMeeting.location.sala || 'Não disponível'}</p>
              )}
            </div>
          ) : (
            <p>Detalhes não disponíveis.</p>
          )}
          <div>
            <h4>Convidados:</h4>
            {selectedMeeting.invitedUsers && selectedMeeting.invitedUsers.length > 0 ? (
              <ul>
                {selectedMeeting.invitedUsers.map((user, index) => (
                  <li key={index}>{user.primeiro_nome} {user.ultimo_nome}</li>
                ))}
              </ul>
            ) : (
              <p>Sem convidados registrados.</p>
            )}
          </div>
          <div className="divAta">
            <h4>Ata da Reunião</h4>
            {meetingMinutes.length > 0 ? (
              <ul>
                {meetingMinutes.map((minute, index) => (
                  <li key={index}>{minute.conteudo}</li>
                ))}
              </ul>
            ) : (
              <>
                {getDecodedToken()?.papel.trim() === 'Lider' && (
                  <Botao texto={"+ Criar Ata"} className="btAdicionar" onClick={() => setPopupState('addMinutes')} />
                )}
                <h5>Sem ata registrada.</h5>
              </>
            )}
          </div>
        </div>
      ) : (
        <p>Detalhes não disponíveis.</p>
      )}
    </PopUp>
  );

  const renderAddMinutesPopup = () => (
    <PopUp isOpen={popupState === 'addMinutes'} onClose={closePopup}>
      <form onSubmit={(e) => handleAddSubmit(e, true)}>
        <div>
          <label htmlFor="ata">Conteúdo da Ata:</label>
          <textarea id="ata" name="ata" rows="4" required />
        </div>
        <Botao texto={"Adicionar Ata"} className="btAdicionar" type="submit" />
      </form>
    </PopUp>
  );

  const renderAddMeetingPopup = () => (
    <PopUp isOpen={popupState === 'addMeeting'} onClose={closePopup}>
      <form onSubmit={handleAddSubmit}>
        <div>
          <label htmlFor="pauta">Pauta:</label>
          <input type="text" id="pauta" name="pauta" required />
        </div>
        <div>
          <label htmlFor="data_reuniao">Data:</label>
          <input type="date" id="data_reuniao" name="data_reuniao" value={date.toISOString().split("T")[0]} readOnly required />
        </div>
        <div>
          <label htmlFor="hora_reuniao">Hora:</label>
          <input type="time" id="hora_reuniao" name="hora_reuniao" required />
        </div>
        <div>
          <label htmlFor="meetingLocation">Local:</label>
          <select id="meetingLocation" name="meetingLocation" required>
            <option value="" disabled>Selecione um local</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.link ? `Remoto - ${location.link}` : `Presencial - ${location.sala || 'Não especificado'}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="meetingUsers">Convidar Usuários:</label>
          <Select
            id="meetingUsers"
            options={userOptions}
            isMulti
            value={userOptions.filter(option => selectedUsers.includes(option.value))}
            onChange={handleUserChange}
          />
        </div>
        <Botao texto={"Criar Reunião"} className="btAdicionar" type="submit" />
      </form>
    </PopUp>
  );

  return (
    <div className="divHome">
      <Header />
      <div className="divCalendar">
        <Calendar onChange={handleDateChange} value={date} />
      </div>
      {renderMeetingPopup()}
      {renderMeetingDetailsPopup()}
      {renderAddMinutesPopup()}
      {renderAddMeetingPopup()}
      <ToastContainer />
    </div>
  );
};
export default Home;