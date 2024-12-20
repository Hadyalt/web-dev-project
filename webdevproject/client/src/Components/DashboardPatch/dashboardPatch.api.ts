import axios from 'axios';

export const getEventById = async (eventId: number) => {
    const response = await axios.get(`http://localhost:3001/Api/v1/controller/Read/${eventId}`);
    return response.data;
};

export const updateEvent = async (eventId: number, event: any) => {
    await axios.put(`http://localhost:3001/Api/v1/controller/Update/${eventId}`, event);
};