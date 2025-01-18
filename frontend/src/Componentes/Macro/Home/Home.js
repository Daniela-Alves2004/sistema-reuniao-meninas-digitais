import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import './Home.css';

// Componente Header
import Header from '../../Micro/Header/Header';

// Importando a biblioteca de calendário
import Calendar from 'react-calendar';

// Importando componentes do Material-UI
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import axios from 'axios';

const Home = () => {
  const [date, setDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
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

        params: { date: formattedDate }

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

  };

  const openMeetingDetails = async (meeting) => {

    setSelectedMeeting(meeting);

    setShowPopup(false);

    setShowDetailsPopup(true);

    try {

      const response = await axios.get('http://localhost:3000/api/locations/getLocationByMeeting', {

        params: { meetingId: meeting.id }

      });

      setSelectedMeeting(prevState => ({

        ...prevState,

        location: response.data.location,

      }));

    } catch (error) {

      console.error('Error fetching meeting location:', error);

      setSelectedMeeting(prevState => ({

        ...prevState,

        location: null,

      }));

    }

  };

  return (

    <div className="divHome">

      <Header />

      <div className="divCalendar">

        <Calendar onChange={handleDateChange} value={date} />

      </div>

      <Dialog open={showPopup} onClose={closePopup} sx={{

        '& .MuiDialogContent-root': {
          background: 'linear-gradient(180deg, rgba(86, 40, 131, 1) 9%, rgba(145, 50, 122, 1) 65%, rgba(191, 118, 47, 1) 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '600px',
          height: '800px',
        }

      }}>

        <DialogContent>

          {error ? (

            <p>{error}</p>

          ) : meetingData && meetingData.meetings && meetingData.meetings.length > 0 ? (

            <div style={{ width: '100%' }}>

              <p>{meetingData.meetings[0].data_reuniao}</p>

              <p style={{ fontSize: 20, margin: 20 }}>Reuniões do dia:</p>

              <ul style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {meetingData.meetings.map((meeting, index) => (

                  <li

                    key={index}

                    onClick={() => openMeetingDetails(meeting)}

                    style={{
                      listStyleType: 'none',
                      padding: 20,
                      border: '5px solid white',
                      borderRadius: 5,
                      margin: 20,
                      width: '80%',
                      cursor: 'pointer',
                    }}

                  >

                    {meeting.pauta}

                  </li>

                ))}

              </ul>

            </div>

          ) : (

            <p>Nenhuma reunião encontrada para esta data.</p>

          )}

        </DialogContent>

      </Dialog>

      <Dialog open={showDetailsPopup} onClose={closePopup}

        sx={{

          '& .MuiDialogContent-root': {
            background: 'linear-gradient(180deg, rgba(86, 40, 131, 1) 9%, rgba(145, 50, 122, 1) 65%, rgba(191, 118, 47, 1) 100%)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: '600px',
            height: '800px',
          }

        }}>

        <DialogContent>

          {selectedMeeting ? (

            <div style={{

              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              justifyContent: 'space-around',

            }}>

              <p><strong>Pauta:</strong> {selectedMeeting.pauta}</p>

              {selectedMeeting.location ? (

                <div>

                  {selectedMeeting.location.sala ? (
                    <p><strong>Local:</strong> {selectedMeeting.location.sala}</p>
                  ) : (
                    <p><strong>Local:</strong> Sala não disponível.</p>
                  )}

                  <p><strong>Tipo:</strong> {selectedMeeting.location.tipo}</p>

                  {selectedMeeting.location.link ? (
                    <p><strong>Link:</strong> <a href={selectedMeeting.location.link} target="_blank" rel="noopener noreferrer">{selectedMeeting.location.link}</a></p>
                  ) : (
                    <p><strong>Link:</strong> Link não disponível.</p>
                  )}

                </div>

              ) : (

                <p><strong>Local não disponível.</strong></p>
              )}

            </div>

          ) : (

            <p>Detalhes não disponíveis.</p>

          )}

        </DialogContent>

      </Dialog>

    </div>

  );

};

export default Home;
