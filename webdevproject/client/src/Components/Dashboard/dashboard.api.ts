import { Attendance, Event, Event_Attendance } from "./dashboard.state";

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

export const deleteEvent = (eventId: string): Promise<void> => {
    return fetch(`http://localhost:3001/Api/v1/controller/delete/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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

  export const getAttendance = async (eventId: number): Promise<Attendance[]> => {
    const response = await fetch(`http://localhost:3001/api/v1/attendance/attendees/${eventId}`, {
        method: "GET",
        credentials: "include", 
    });

    if (!response.ok) {
        throw new Error("Failed to fetch attendance");
    }

    const data = await response.json();
    return data as Attendance[];
};
