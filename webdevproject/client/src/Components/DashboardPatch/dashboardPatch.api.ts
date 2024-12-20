import axios from 'axios';

export const getEventById = async (eventId: number) => {
    const response = await axios.get(`http://localhost:3001/Api/v1/controller/Read/${eventId}`);
    return response.data;
};

export const updateEvent = (
    id: number, 
    title: string, 
    description: string, 
    Date: string, 
    startTime: string, 
    endTime: string, 
    location: string, 
    adminApproval: boolean, 
    event_Attendances: [], 
    ReviewFeedback: string
): Promise<Event> => {
    return fetch(`http://localhost:3001/Api/v1/controller/Update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description, Date, startTime, endTime, location, adminApproval, event_Attendances, ReviewFeedback })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => data as Event);
};
