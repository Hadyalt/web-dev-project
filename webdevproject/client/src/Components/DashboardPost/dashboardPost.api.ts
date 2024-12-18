import { Event } from "../Dashboard/dashboard.state";

export const postEvent = (event: Event): Promise<Event> => {
    return fetch("http://localhost:5066/Api/v1/controller/Create", {
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