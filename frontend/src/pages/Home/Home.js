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

require('./Home.css');

const Home = () => {

  const [date, setDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showAddMeetingPopup, setShowAddMeetingPopup] = useState(false);
  const [showAddMinutesPopup, setShowAddMinutesPopup] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);

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
    } catch (error) {
      console.error('Error fetching meeting location:', error);
      setSelectedMeeting((prevState) => ({
        ...prevState,
        location: null,
      }));
    }
  };

  // Função para abrir o pop-up de adicionar reunião
  const handleAddMeetingClick = async () => {
    setShowPopup(false);
    setShowAddMeetingPopup(true);
    try {
      const response = await axios.get('http://localhost:3000/api/locations/getAllLocations');
      setLocations(response.data.locations || []);
    } catch (error) {
      console.error('Erro ao buscar locais:', error);
      setLocations([]);
      alert('Erro ao buscar locais. Tente novamente mais tarde.');
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
      const response = await axios.post("http://localhost:3000/api/meetings/createMeeting", {
        pauta,
        hora_reuniao,
        data_reuniao,
        id_local,
      });
      if (response.status === 201) {
        toast.success('Reunião criada com sucesso!', {
          autoClose: 3000,
        });
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
            <Botao texto={"+"} className="btAdicionar" type="submit"></Botao>
          </form>
        </DialogContent>
      </Dialog>

      <ToastContainer />

    </div>

  );

};

export default Home;
