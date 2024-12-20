import { Event } from "./dashboard.state";

export const loadEvent = (): Promise<Event[]> => {
    return fetch("http://localhost:3001/Api/v1/controller/Read") // Adjust the URL as needed
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => data as Event[]);
}

export const deleteEvent = (eventId: string): Promise<void> => {
    return fetch(`http://localhost:3001/Api/v1/controller/delete/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete event");
        }
      })
      .catch((error) => {
        throw new Error(error.message || "Unknown error occurred during deletion");
      });
  };