import { Event } from "../Dashboard/dashboard.state";

export const postEvent = (title: string, description: string, Date: string, startTime: string, 
    endTime: string, location: string, adminApproval: boolean, event_Attendances: [], ReviewFeedback: string): Promise<Event> => {
    return fetch("http://localhost:3001/Api/v1/controller/Create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ title, description, Date, startTime, endTime, location, adminApproval, event_Attendances, ReviewFeedback })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => data as Event);
}