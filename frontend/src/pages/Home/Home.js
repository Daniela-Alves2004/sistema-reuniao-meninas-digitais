import React, { useState, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import Header from '../../components/Header/Header';
import Botao from '../../components/Botao/Botao';
import Calendar from 'react-calendar';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { ToastContainer, toast } from 'react-toastify';
import { getAuthTokenFromCookies, getDecodedToken } from '../../utils/cookies';
import { getMeetingsByDate, getMeetingDetails, getAllLocations, getAllUsers, createMeeting, sendInvitations, addMinutesToMeeting, getInvitationsByMeeting, getMeetingMinutes, getUserById } from '../../utils/api';
import Select from 'react-select';

require('./Home.css');

const Home = () => {
  
  const [date, setDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showAddMeetingPopup, setShowAddMeetingPopup] = useState(false);
  const [showAddMinutesPopup, setShowAddMinutesPopup] = useState(false);
  const [meetingMinutes, setMeetingMinutes] = useState([]);
  const [meetingData, setMeetingData] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);

  const options = users.map(user => ({
    value: user.id,
    label: `${user.primeiro_nome} ${user.ultimo_nome}`
  }));

  const handleUserChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions.map(option => option.value));
  };

  const handleDateChange = async (newDate) => {
    setDate(newDate);
    setShowPopup(true);
    setError(null);
    try {
      const response = await getMeetingsByDate(newDate);
      console.log('response:', response);
      setMeetingData(response);
    } catch (error) {
      console.error('Erro ao buscar dados da reunião:', error);
      setMeetingData(null);
      setError('Erro ao buscar dados da reunião. Tente novamente mais tarde.');
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setShowDetailsPopup(false);
    setShowAddMeetingPopup(false);
    setShowAddMinutesPopup(false);
  };

  const openMeetingDetails = async (meeting) => {
    setSelectedMeeting(meeting);
    setShowPopup(false);
    setShowDetailsPopup(true);
    try {
      
      const locationResponse = await getMeetingDetails(meeting.id);
      setSelectedMeeting((prevState) => ({
        ...prevState,
        location: locationResponse.location,
      }));
    
      const minutesResponse = await getMeetingMinutes(meeting.id);
      setMeetingMinutes(minutesResponse.data || []);
  
      const invitationResponse = await getInvitationsByMeeting(meeting.id);
      const invitedUserIds = invitationResponse.data.map(invitation => invitation.id_usuario);
  
      const usersDetails = await Promise.all(
        invitedUserIds.map(async (userId) => {
          const userResponse = await getUserById(userId);
          return userResponse.data;
        })
      );
  
      setSelectedMeeting((prevState) => ({
        ...prevState,
        invitedUsers: usersDetails,
      }));
    } catch (error) {
      console.error('Erro ao buscar detalhes da reunião:', error);
      setSelectedMeeting((prevState) => ({
        ...prevState,
        location: null, // Em caso de erro, defina 'location' como null
        invitedUsers: [],
      }));
    }
  };
  

  const handleAddMeetingClick = async () => {
    setShowPopup(false);
    setShowAddMeetingPopup(true);
    try {
      const responseLocations = await getAllLocations();
      setLocations(responseLocations.data.locations || []);

      const responseUsers = await getAllUsers();
      setUsers(responseUsers.data || []);
    } catch (error) {
      console.error('Erro ao buscar locais ou usuários:', error);
      setLocations([]);
      setUsers([]);
      alert('Erro ao buscar dados. Tente novamente mais tarde.');
    }
  };

  const handleAddMeetingSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const pauta = formData.get("pauta");
    const hora_reuniao = formData.get("hora_reuniao");
    const data_reuniao = formData.get("data_reuniao");
    const id_local = formData.get("meetingLocation");

    try {
      const response = await createMeeting({
        pauta,
        hora_reuniao,
        data_reuniao,
        id_local,
        convidados: selectedUsers,
      });

      if (response.status === 201) {
        toast.success('Reunião criada!', { autoClose: 3000 });

        for (const userId of selectedUsers) {
          try {
            const invitationResponse = await sendInvitations({
              id_usuario: userId,
              id_reuniao: response.data.meeting.id,
            });

            if (invitationResponse.status === 201) {
              console.log(`Convite enviado para o usuário ${userId}`);
            }
          } catch (invitationError) {
            console.error(`Erro ao enviar convite para o usuário ${userId}:`, invitationError);
          }
        }

        closePopup();
      }
    } catch (error) {
      console.error("Erro ao criar reunião:", error);
      alert("Ocorreu um erro ao criar a reunião. Tente novamente.");
    }
  };

  const handleAddMinutesClick = (meeting) => {
    setSelectedMeeting(meeting);
    setShowPopup(false);
    setShowAddMinutesPopup(true);
  };

  const handleAddMinutesSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const ata = formData.get('ata');
    const meetingId = selectedMeeting.id;
    const token = getAuthTokenFromCookies();

    try {
      const response = await addMinutesToMeeting({
        id_reuniao: meetingId,
        conteudo: ata,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        toast.success('Ata adicionada com sucesso!', { autoClose: 3000 });
        closePopup();
      }
    } catch (error) {
      console.error('Erro ao adicionar ata:', error);
      alert('Erro ao adicionar ata. Tente novamente.');
    }
  };

  return (

    <div className="divHome">

      <Header />

      <div className="divCalendar">
        <Calendar onChange={handleDateChange} value={date} />
      </div>

      {/* Pop-Up para visualizar as reuniões do dia. */}
      <Dialog open={showPopup} onClose={closePopup}>
        <DialogContent>
          {error ? (
            <p>{error}</p>
          ) : meetingData && meetingData.length > 0 ? (  // Verifique se "meetingData" é um array válido
            <div>
              <p>
                {new Date(
                  new Date(meetingData[0].data_reuniao).setDate(
                    new Date(meetingData[0].data_reuniao).getDate() + 1
                  )
                ).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                })}
              </p>
              <ul>
                {meetingData.map((meeting, index) => (  
                  <li key={index} onClick={() => openMeetingDetails(meeting)}>
                    {meeting.pauta}
                  </li>
                ))}
              </ul>

              {getDecodedToken()?.papel.trim() === 'Lider' && (
                <Botao texto={"+"} className="btAdicionar" onClick={handleAddMeetingClick}></Botao>
              )}

            </div>
          ) : (
            <div>
              <p>Nenhuma reunião encontrada para esta data.</p>

              {getDecodedToken()?.papel.trim() === 'Lider' && (
                <Botao texto={"+"} className="btAdicionar" onClick={handleAddMeetingClick}></Botao>
              )}

            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pop-Up para adicionar uma ata */}
      <Dialog open={showAddMinutesPopup} onClose={closePopup}>
        <DialogContent>
          <form onSubmit={handleAddMinutesSubmit}>
            <div>
              <label htmlFor="ata">Conteúdo da Ata:</label>
              <textarea id="ata" name="ata" rows="4" required />
            </div>
            <Botao texto={"+"} className="btAdicionar" type="submit"></Botao>
          </form>
        </DialogContent>
      </Dialog>

      {/* Pop-Up para visualizar os detalhes da reunião */}
      <Dialog open={showDetailsPopup} onClose={closePopup}>
        <DialogContent>
          {selectedMeeting ? (
            <div>
              {selectedMeeting.location ? (
                <div>
                  <p>
                    <strong>Pauta:</strong> {selectedMeeting.pauta}
                  </p>
                  <p>
                    <strong>Hora da Reunião: </strong>
                    {new Date(`1970-01-01T${selectedMeeting.hora_reuniao}`).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {selectedMeeting.location.sala ? (
                    <p>
                      <strong>Local:</strong> {selectedMeeting.location.sala}
                    </p>
                  ) : (
                    <p>
                      <strong>Local:</strong> Sala não disponível.
                    </p>
                  )}
                  <p>
                    <strong>Tipo:</strong> {selectedMeeting.location.tipo}
                  </p>
                  {selectedMeeting.location.link ? (
                    <p>
                      <strong>Link:</strong>{' '}
                      <a href={selectedMeeting.location.link} target="_blank" rel="noopener noreferrer">
                        {selectedMeeting.location.link}
                      </a>
                    </p>
                  ) : (
                    <p>
                      <strong>Link:</strong> Link não disponível.
                    </p>
                  )}
                </div>
              ) : (
                <p>
                  <strong>Local não disponível.</strong>
                </p>
              )}

              <div className='divAta'>
                <h3>Ata da Reunião</h3>
                {meetingMinutes.length > 0 ? (
                  <ul>
                    {meetingMinutes.map((minute, index) => (
                      <li key={index}>{minute.conteudo}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Nenhuma ata registrada para esta reunião.</p>
                )}
              </div>

              {/* Lista de Convidados */}
              <div className="divConvidados">
                <h3>Convidados:</h3>
                {selectedMeeting.invitedUsers && selectedMeeting.invitedUsers.length > 0 ? (
                  <ul>
                    {selectedMeeting.invitedUsers.map((user, index) => (
                      <li key={index}>
                        {user.primeiro_nome} {user.ultimo_nome}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Não há convidados para esta reunião.</p>
                )}

              </div>

              {/* Botão para adicionar ata - Somente para Lideres */}
              {getDecodedToken()?.papel.trim() === 'Lider' && (
                <Botao texto={"+"} className="btAdicionar" onClick={() => {
                  closePopup();
                  handleAddMinutesClick(selectedMeeting);
                }}></Botao>
              )}
            </div>
          ) : (
            <p>Detalhes não disponíveis.</p>
          )}
        </DialogContent>
      </Dialog>


      {/* Pop-Up para inserir as informações da reunião e adicionar ela. */}
      <Dialog open={showAddMeetingPopup} onClose={closePopup}>
        <DialogContent>
          <form onSubmit={handleAddMeetingSubmit}>
            <div>
              <label htmlFor="pauta">Pauta:</label>
              <input type="text" id="pauta" name="pauta" required />
            </div>
            <div>
              <label htmlFor="data_reuniao">Data:</label>
              <input
                type="date"
                id="data_reuniao"
                name="data_reuniao"
                value={date.toISOString().split("T")[0]}
                readOnly
                required
              />
            </div>

            <div>
              <label htmlFor="hora_reuniao">Hora:</label>
              <input
                type="time"
                id="hora_reuniao"
                name="hora_reuniao"
                required
              />
            </div>
            <div>
              <label htmlFor="meetingLocation">Local:</label>
              <select id="meetingLocation" name="meetingLocation" required>
                <option value="" disabled selected>Selecione um local</option>
                {locations.map((location) => {
                  const isRemoto = !!location.link;
                  const displayName = isRemoto
                    ? `Remoto - ${location.link}`
                    : `Presencial - ${location.sala || 'Sala não especificada'}`;
                  return (
                    <option key={location.id} value={location.id}>
                      {displayName}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label htmlFor="meetingUsers">Convidar Usuários:</label>
              <Select
                id="meetingUsers"
                options={options}
                isMulti
                placeholder="Selecione os usuários..."
                value={options.filter(option => selectedUsers.includes(option.value))}
                onChange={handleUserChange}
              />
            </div>
            <Botao texto={"+"} className="btAdicionar" type="submit"></Botao>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </div>
  );
};
export default Home;
