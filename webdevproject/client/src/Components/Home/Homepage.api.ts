import { Event, Review } from "./Homepage.state";

export const loadEvent = (): Promise<Event[]> => {
    return fetch("http://localhost:3001/Api/v1/controller/Read")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => data as Event[]);
}

export const loadUserEvents = (): Promise<Event[]> => {
    return fetch("http://localhost:3001/Api/v1/attendance/events/user")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => data as Event[]);
}

export const submitReview = (eventId: number, review: Review): Promise<void> => {
    return fetch(`http://localhost:3001/api/v1/attendance/attend`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ eventId, ...review })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to submit review");
        }
    });
};