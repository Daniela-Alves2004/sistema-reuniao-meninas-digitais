import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';

// Componentes
import Header from '../../componentes/Header/Header';

// Importando a biblioteca de calendário
import Calendar from 'react-calendar';

// Importando componentes do Material-UI
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import axios from 'axios';

import Botao from '../../componentes/Botao/Botao';
import { ToastContainer, toast } from 'react-toastify';

// Importanto a função para verificar o token
import { getDecodedToken, getAuthTokenFromCookies } from '../../utils/cookies';

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
  const [users, setUsers] = useState([]); // Lista de usuários disponíveis
  const [selectedUsers, setSelectedUsers] = useState([]); // Lista de usuários convidados
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);

  const options = users.map(user => ({
    value: user.id,
    label: `${user.primeiro_nome} ${user.ultimo_nome}`
  }));

  const handleUserChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions.map(option => option.value));
  };

  // Função para buscar as reuniões do dia
  const handleDateChange = async (newDate) => {
    setDate(newDate);
    setShowPopup(true);
    setError(null);
    try {
      const formattedDate = newDate.toISOString().split('T')[0];
      const response = await axios.get(`http://localhost:3000/api/meetings/getMeetingByDate`, {
        params: { date: formattedDate },
      });
      setMeetingData(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados da reunião:', error);
      setMeetingData(null);
      setError('Erro ao buscar dados da reunião. Tente novamente mais tarde.');
    }
  };

  // Função para fechar o pop-up
  const closePopup = () => {
    setShowPopup(false);
    setShowDetailsPopup(false);
    setShowAddMeetingPopup(false);
    setShowAddMinutesPopup(false);
  };

  // Função para abrir os detalhes da reunião
  const openMeetingDetails = async (meeting) => {
    setSelectedMeeting(meeting);
    setShowPopup(false);
    setShowDetailsPopup(true);
    try {
      const response = await axios.get('http://localhost:3000/api/locations/getLocationByMeeting', {
        params: { meetingId: meeting.id },
      });
      setSelectedMeeting((prevState) => ({
        ...prevState,
        location: response.data.location,
      }));

      // Buscar as atas da reunião
      const minutesResponse = await axios.get(`http://localhost:3000/api/minutes/listMinutesByMeeting/${meeting.id}`);
      setMeetingMinutes(minutesResponse.data || []);

      // Buscar os convidados
      const invitationResponse = await axios.get('http://localhost:3000/api/invitations/getInvitationsByMeetingId/' + meeting.id);

      const invitedUserIds = invitationResponse.data.map(invitation => invitation.id_usuario);

      // Agora, buscamos os detalhes dos usuários convidados
      const usersDetails = await Promise.all(
        invitedUserIds.map(async (userId) => {
          const userResponse = await axios.get(`http://localhost:3000/api/users/getUserById/${userId}`);
          return userResponse.data; // Aqui você retorna os detalhes do usuário
        })
      );

      console.log(usersDetails); // Mostra os detalhes dos usuários convidados
      setSelectedMeeting((prevState) => ({
        ...prevState,
        invitedUsers: usersDetails, // Lista de usuários convidados com detalhes
      }));
    } catch (error) {
      console.error('Erro ao buscar detalhes da reunião:', error);
      setSelectedMeeting((prevState) => ({
        ...prevState,
        location: null,
        invitedUsers: [], // Caso ocorra um erro, inicialize como uma lista vazia
      }));
    }
  };

  // Função para abrir o pop-up de adicionar reunião
  const handleAddMeetingClick = async () => {
    setShowPopup(false);
    setShowAddMeetingPopup(true);
    try {
      // Buscar locais
      const responseLocations = await axios.get('http://localhost:3000/api/locations/getAllLocations');
      setLocations(responseLocations.data.locations || []);

      // Buscar usuários disponíveis
      const responseUsers = await axios.get('http://localhost:3000/api/users/getAllUsers');
      setUsers(responseUsers.data || []);

    } catch (error) {
      console.error('Erro ao buscar locais ou usuários:', error);
      setLocations([]);
      setUsers([]);
      alert('Erro ao buscar dados. Tente novamente mais tarde.');
    }
  };

  // Função para enviar os dados do formulário para a rota de criação
  const handleAddMeetingSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const pauta = formData.get("pauta");
    const hora_reuniao = formData.get("hora_reuniao");
    const data_reuniao = formData.get("data_reuniao");
    const id_local = formData.get("meetingLocation");

    try {
      // Criação da reunião
      const response = await axios.post("http://localhost:3000/api/meetings/createMeeting", {
        pauta,
        hora_reuniao,
        data_reuniao,
        id_local,
        convidados: selectedUsers, // Adicionamos os usuários convidados
      });

      if (response.status === 201) {
        toast.success('Reunião criada!', { autoClose: 3000 });

        // Agora enviaremos os convites para os usuários
        for (const userId of selectedUsers) {
          try {

            console.log(response.data.meeting.id);

            const invitationResponse = await axios.post("http://localhost:3000/api/invitations/createInvitation", {
              id_usuario: userId,  // O ID do usuário convidado
              id_reuniao: response.data.meeting.id,  // O ID da reunião criada
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

  // Função para abrir o pop-up de adicionar ata
  const handleAddMinutesClick = (meeting) => {
    setSelectedMeeting(meeting);
    setShowPopup(false);
    setShowAddMinutesPopup(true);
  };

  // Função para enviar os dados do formulário para a rota de adicionar ata
  const handleAddMinutesSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const ata = formData.get('ata');
    const meetingId = selectedMeeting.id;
    const token = getAuthTokenFromCookies();
    try {
      const response = await axios.post('http://localhost:3000/api/minutes/createMinutes', {
        id_reuniao: meetingId,
        conteudo: ata,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        toast.success('Ata adicionada com sucesso!', {
          autoClose: 3000,
        });
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
          ) : meetingData && meetingData.meetings && meetingData.meetings.length > 0 ? (
            <div>
              <p>
                {new Date(
                  new Date(meetingData.meetings[0].data_reuniao).setDate(
                    new Date(meetingData.meetings[0].data_reuniao).getDate() + 1
                  )
                ).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                })}
              </p>
              <ul>
                {meetingData.meetings.map((meeting, index) => (
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
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: '8px',
                    borderColor: '#fff',
                    boxShadow: 'none',
                    '&:hover': { borderColor: '#000' },
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    display: 'block',
                  }),
                  menuList: () => ({
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                  }),
                  option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected ? "#ddd" : isFocused ? "#eee" : "#fff",
                    color: "#000",
                    padding: "10px",
                    textAlign: "left",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#000",
                  }),
                }}
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
