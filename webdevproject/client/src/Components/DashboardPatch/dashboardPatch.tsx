import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { updateEvent, getEventById } from './dashboardPatch.api.ts';
import { DateOnly } from '../../Models/Date.tsx';

interface DashboardPatchProps {
    backToHome: () => void;
}

export const DashboardPatch: React.FC<DashboardPatchProps> = ({ backToHome }) => {
    const { eventId } = useParams<{ eventId: string }>(); 
    const [event, setEvent] = useState({
        title: '',
        description: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        location: '',
        adminApproval: false,
    });

    useEffect(() => {
        if (eventId) {
            getEventById(parseInt(eventId)).then(setEvent);
        }
    }, [eventId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEvent(prevEvent => ({ ...prevEvent, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventId) return;

        const formattedDate = DateOnly.parse(event.eventDate).toString();
        try {
            await updateEvent(
                parseInt(eventId),
                event.title,
                event.description,
                formattedDate,
                event.startTime,
                event.endTime,
                event.location,
                event.adminApproval,
                [],
                ""
            );
            window.location.href = `/dashboard`
            backToHome();
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

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
        heading: {
            textAlign: "center" as const,
            marginBottom: "20px",
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Edit Event</h1>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        Title:
                        <input
                            type="text"
                            name="title"
                            value={event.title}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </label>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        Description:
                        <textarea
                            name="description"
                            value={event.description}
                            onChange={handleChange}
                            style={styles.textarea}
                        />
                    </label>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        Date:
                        <input
                            type="date"
                            name="eventDate"
                            value={event.eventDate}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </label>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        Start Time:
                        <input
                            type="time"
                            name="startTime"
                            value={event.startTime}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </label>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        End Time:
                        <input
                            type="time"
                            name="endTime"
                            value={event.endTime}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </label>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        Location:
                        <input
                            type="text"
                            name="location"
                            value={event.location}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </label>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        Admin Approval:
                        <input
                            type="checkbox"
                            name="adminApproval"
                            checked={event.adminApproval}
                            onChange={e => setEvent(prevEvent => ({ ...prevEvent, adminApproval: e.target.checked }))}
                        />
                    </label>
                </div>
                <button type="submit" style={styles.button} onClick={() => {window.location.href = '/dashboard'}}>
                    Save
                </button>
                <button
                    type="button"
                    style={styles.button}
                    onClick={() => {
                        window.location.href = '/dashboard'
                    }}
                >
                    Back
                </button>
            </form>
        </div>
    );
};
