import { Event } from "./dashboard.state";

export const loadEvent = (): Promise<Event[]> => {
    return fetch("http://localhost:5066/Api/v1/controller/Read") // Adjust the URL as needed
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => data as Event[]);
}

export const postEvent = (event: Event): Promise<Event> => {
    return fetch("http://localhost:5066/Api/v1/controller/Create", { // Adjust the URL as needed
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => data as Event);
}