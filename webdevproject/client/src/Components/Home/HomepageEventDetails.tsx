import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Event, Review } from "./Homepage.state";
import { loadEvent, submitReview } from "./Homepage.api";
import { getEventById } from "../DashboardPatch/dashboardPatch.api";

export const HomepageEventDetails: React.FC<{ backToHome: () => void }> = ({ backToHome }) => {
    const { eventId } = useParams<{ eventId: string }>();
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    useEffect(() => {
        if (eventId) {
            getEventById(parseInt(eventId))
                .then(event => setSelectedEvent(event))
                .catch(() => alert("Failed to load event details"));
        }
    }, [eventId]);

    if (!selectedEvent) {
        return <div>Loading event details...</div>;
    }

    const styles = {
        container: {
            fontFamily: "Arial, sans-serif",
            padding: "20px",
            maxWidth: "600px",
            margin: "auto",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        },
        heading: {
            textAlign: "center" as const,
            marginBottom: "20px",
        },
        eventDetails: {
            marginBottom: "20px",
        },
        reviews: {
            marginBottom: "20px",
        },
        formGroup: {
            marginBottom: "15px",
        },
        label: {
            display: "block",
            marginBottom: "5px",
            fontWeight: "bold",
        },
        input: {
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
        },
        textarea: {
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
        },
        button: {
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px",
        },
        reviewList: {
            listStyleType: "none",
            padding: 0,
        },
        reviewItem: {
            borderBottom: "1px solid #ddd",
            padding: "10px 0",
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>{selectedEvent.title}</h1>
            <div style={styles.eventDetails}>
                <p>{selectedEvent.description}</p>
                <p>Date: {selectedEvent.eventDate.toString()}</p>
                <p>Start Time: {selectedEvent.startTime.toString()}</p>
                <p>End Time: {selectedEvent.endTime.toString()}</p>
                <p>Location: {selectedEvent.location}</p>
                <p>Admin Approval: {selectedEvent.adminApproval ? "Approved" : "Pending"}</p>
            </div>
                <button
                    type="button"
                    style={styles.button}
                    onClick={() => {
                        window.location.href = "/homepage";
                    }}
                >
                    Go to the Homepage
                </button>
        </div>
    );
};
