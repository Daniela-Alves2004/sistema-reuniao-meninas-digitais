import axios from 'axios';
import { getDecodedToken } from './cookies';

// Defina a URL base da API
const apiUrl = process.env.REACT_APP_API_URL + '/api';

export const getMeetingsByDate = async (date) => {
    try {
        // Verifica se o date é um objeto Date válido, senão, converte
        if (!(date instanceof Date)) {
            date = new Date(date); // Converte a data se não for um objeto Date
        }

        // Verifica se a data é válida
        if (isNaN(date.getTime())) {
            throw new Error('Data inválida');
        }

        const formattedDate = date.toISOString().split('T')[0]; // Formata a data para o formato esperado

        const response = await axios.get(`${apiUrl}/meetings/getMeetingByDate`, {
            params: { date: formattedDate },
        });

        // Aqui, a resposta já contém a lista de reuniões em response.data.meetings
        const meetings = response.data.meetings;

        if (meetings && meetings.length > 0) {
            console.log('Reuniões encontradas:', meetings);
            return meetings;
        } else {
            console.log('Nenhuma reunião encontrada para esta data.');
            return []; // Retorna um array vazio caso não haja reuniões
        }

    } catch (error) {
        console.error('Erro ao buscar reuniões:', error);
        throw new Error('Erro ao buscar reuniões. Tente novamente.');
    }
};



// Função para buscar os detalhes de uma reunião
export const getMeetingDetails = async (meetingId) => {
    try {
        const locationResponse = await axios.get(`${apiUrl}/locations/getLocationByMeeting`, {
            params: { meetingId },
        });
        const location = locationResponse.data.location;

        const minutesResponse = await getMeetingMinutes(meetingId); // Função corrigida
        const minutes = minutesResponse.data || [];

        const invitationResponse = await getInvitationsByMeeting(meetingId); // Função corrigida
        const invitedUserIds = invitationResponse.data.map(invitation => invitation.id_usuario);

        const usersDetails = await Promise.all(
            invitedUserIds.map(async (userId) => {
                const userResponse = await getUserById(userId); // Função corrigida
                return userResponse.data;
            })
        );

        return { location, minutes, usersDetails };
    } catch (error) {
        console.error('Erro ao buscar detalhes da reunião:', error);
        throw new Error('Erro ao buscar detalhes da reunião. Tente novamente.');
    }
};

// Função para buscar os minutos de uma reunião
export const getMeetingMinutes = async (meetingId) => {
    try {
        const response = await axios.get(`${apiUrl}/minutes/listMinutesByMeeting/${meetingId}`);
        return response;
    } catch (error) {
        console.error('Erro ao buscar minutos da reunião:', error);
        throw new Error('Erro ao buscar minutos da reunião. Tente novamente.');
    }
};

// Função para buscar os convites de uma reunião
export const getInvitationsByMeeting = async (meetingId) => {
    try {
        const response = await axios.get(`${apiUrl}/invitations/getInvitationsByMeetingId/${meetingId}`);
        return response;
    } catch (error) {
        console.error('Erro ao buscar convites da reunião:', error);
        throw new Error('Erro ao buscar convites da reunião. Tente novamente.');
    }
};

// Função para buscar um usuário por ID
export const getUserById = async (userId) => {
    try {
        const response = await axios.get(`${apiUrl}/users/getUserById/${userId}`);
        return response;
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw new Error('Erro ao buscar usuário. Tente novamente.');
    }
};

// Função para buscar locais
export const getAllLocations = async () => {
    try {
        const response = await axios.get(`${apiUrl}/locations/getAllLocations`);
        return response.data.locations || [];
    } catch (error) {
        console.error('Erro ao buscar locais:', error);
        throw new Error('Erro ao buscar locais. Tente novamente.');
    }
};

// Função para buscar todos os usuários
export const getAllUsers = async () => {
    try {
        
        const response = await axios.get(`${apiUrl}/users/getAllUsers`);

        // Filtra o usuário logado da lista de usuários
        const token = getDecodedToken();
        const userId = token.id;
        const users = response.data.filter(user => user.id !== userId);

        return users;

    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw new Error('Erro ao buscar usuários. Tente novamente.');
    }
};

// Função para criar uma reunião
export const createMeeting = async (meetingData) => {
    try {
        const response = await axios.post(`${apiUrl}/meetings/createMeeting`, meetingData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar reunião:', error);
        throw new Error('Erro ao criar reunião. Tente novamente.');
    }
};

// Função para criar um local
export const createLocation = async (locationData) => {
    try {
        const response = await axios.post(`${apiUrl}/locations/createLocation`, locationData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar local:', error);
        throw new Error('Erro ao criar local. Tente novamente.');
    }
};

// Função para criar um setor
export const createSetor = async (setorData) => {
    try {
        const response = await axios.post(`${apiUrl}/sectors/createSector`, setorData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar setor:', error);
        throw new Error('Erro ao criar setor. Tente novamente.');
    }
};

// Função para enviar convites para usuários
export const sendInvitations = async (meetingId, userIds) => {
    try {
        for (const userId of userIds) {
            await axios.post(`${apiUrl}/invitations/createInvitation`, {
                id_usuario: userId,
                id_reuniao: meetingId,
            });
        }
    } catch (error) {
        console.error('Erro ao enviar convites:', error);
        throw new Error('Erro ao enviar convites. Tente novamente.');
    }
};

// Função para adicionar ata em uma reunião
export const addMinutesToMeeting = async (meetingId, minutesContent, token) => {
    try {
        const response = await axios.post(
            `${apiUrl}/minutes/createMinutes`,
            { id_reuniao: meetingId, conteudo: minutesContent },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar ata:', error.response || error);
        throw new Error('Erro ao adicionar ata. Tente novamente.');
    }
};

// Função para buscar os convites de um usuário
export const getInvitationsByUser = async (userId) => {
    try {
        const response = await axios.get(`${apiUrl}/invitations/getInvitationsByUserId/${userId}`);
        return response;
    } catch (error) {
        console.error('Erro ao buscar convites:', error);
        throw new Error('Erro ao buscar convites. Tente novamente.');
    }
};

// Função para buscar as reuniões através do id da reunião
export const getMeetingById = async (meetingId) => {
    try {
        const response = await axios.get(`${apiUrl}/meetings/getMeetingById/${meetingId}`);
        console.log('Reunião encontrada:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar reunião:', error);
        throw new Error('Erro ao buscar reunião. Tente novamente.');
    }
};

