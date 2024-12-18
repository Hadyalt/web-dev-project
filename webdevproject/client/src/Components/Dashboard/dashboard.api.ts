import { Event } from "./dashboard.state";

export const loadEvent = (): Promise<Event[]> => {
    return fetch("http://localhost:3000/Api/v1/controller/Read") // Adjust the URL as needed
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => data as Event[]);
}
