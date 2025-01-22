import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import './Home.css';

// Componentes micros
import Header from '../../../micro/Header/Header';

// Importando a biblioteca de calendário
import Calendar from 'react-calendar';

// Importando componentes do Material-UI
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import axios from 'axios';
import { Button } from '@mui/material';

const HomeAdmin = () => {
  const [date, setDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showAddMeetingPopup, setShowAddMeetingPopup] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [error, setError] = useState(null);

  const handleDateChange = async (newDate) => {
    setDate(newDate);
    setShowPopup(true);
    setError(null);

    try {
      const formattedDate = newDate.toISOString().split('T')[0];
      console.log('formattedDate:', formattedDate);

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

  const closePopup = () => {
    setShowPopup(false);
    setShowDetailsPopup(false);
    setShowAddMeetingPopup(false);
  };

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

  const handleAddMeetingClick = () => {
    setShowPopup(false);
    setShowAddMeetingPopup(true);
  };

  // Função para enviar os dados do formulário para a rota de criação
  const handleAddMeetingSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const pauta = formData.get("pauta");
    const data_reuniao = formData.get("data_reuniao");
    const id_local = formData.get("meetingLocation");

    try {
      const response = await axios.post("http://localhost:3000/api/meetings/createMeeting", {
        pauta,
        data_reuniao,
        id_local,
      });

      if (response.status === 201) {
        alert("Reunião criada com sucesso!");
        closePopup();
      }
    } catch (error) {
      console.error("Erro ao criar reunião:", error);
      alert("Ocorreu um erro ao criar a reunião. Tente novamente.");
    }
  };


  return (
    <div className="divHome">
      <Header />

      <div className="divCalendar">
        <Calendar onChange={handleDateChange} value={date} />
      </div>

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

              <p>Reuniões do dia:</p>

              <ul>

                {meetingData.meetings.map((meeting, index) => (

                  <li key={index} onClick={() => openMeetingDetails(meeting)}>

                    {meeting.pauta}

                  </li>

                ))}

              </ul>

              <Button onClick={handleAddMeetingClick}>+</Button>

            </div>
          ) : (

            <div>

              <p>Nenhuma reunião encontrada para esta data.</p>

              <Button onClick={handleAddMeetingClick}>+</Button>

            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pop-Up para visualizar as informações de uma reunião. */}
      <Dialog open={showDetailsPopup} onClose={closePopup}>
        <DialogContent>
          {selectedMeeting ? (
            <div>

              <p>
                <strong>Pauta:</strong> {selectedMeeting.pauta}
              </p>

              {selectedMeeting.location ? (

                <div>
                  
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
              <label htmlFor="pauta">Pauta da Reunião:</label>
              <input type="text" id="pauta" name="pauta" required />
            </div>
            <div>
              <label htmlFor="data_reuniao">Data:</label>
              <input
                type="date"
                id="data_reuniao"
                name="data_reuniao"
                value={date.toISOString().split("T")[0]} // Formata a data para YYYY-MM-DD
                readOnly
                required
              />
            </div>
            <div>
              <label htmlFor="meetingLocation">Local (ID do Local):</label>
              <input type="number" id="meetingLocation" name="meetingLocation" required />
            </div>

            <Button>Adicionar</Button>

          </form>
        </DialogContent>
      </Dialog>


    </div>
  );
};

export default HomeAdmin;
