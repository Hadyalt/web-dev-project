import { Event, Review } from "./Homepage.state";

export const loadEvent = (): Promise<Event[]> => {
    return fetch("http://localhost:3001/Api/v1/controller/Read")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok 1");
            }
            return response.json();
        })
        .then(data => data as Event[]);
}

export const loadUserEvents = (): Promise<Event[]> => {
    return fetch("http://localhost:3001/Api/v1/attendance/events/user", {
        method: "GET",
        credentials: "include"
    }
    )
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok 2");
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

export const attendEvent = (eventId: number, userId: number, FeedBack: string, Rating:number ): Promise<void> => {
    return fetch(`http://localhost:3001/api/v1/attendance/attend`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ eventId, userId, FeedBack, Rating })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to attend event");
        }
    });
}

export const cancelEvent = (eventId: number, userId: number): Promise<void> => {
    return fetch(`http://localhost:3001/api/v1/attendance/remove/{eventid}`, {
        method: "delete",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ eventId, userId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to cancel event");
        }
    });
}
