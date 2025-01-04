import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { updateEvent, getEventById } from './dashboardPatch.api.ts';
import { DateOnly } from '../../Models/Date.tsx';

interface DashboardPatchProps {
    backToHome: () => void;
}

export const DashboardPatch: React.FC<DashboardPatchProps> = ({ backToHome }) => {
    const { eventId } = useParams<{ eventId: string }>(); // Use useParams to get the eventId
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
            // Fetch event details by ID
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
            window.location.href = "/dashboard"; 
            backToHome(); // Redirect to the dashboard (or use navigate('/desired-path') if you want to use react-router navigation)
        } catch (error) {
            console.error("Error updating event:", error);
        }
        window.location.href = "/dashboard"; 
    };

    return (
        <div>
            <h1>Edit Event</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Title:
                        <input type="text" name="title" value={event.title} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Description:
                        <textarea name="description" value={event.description} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Date:
                        <input type="date" name="eventDate" value={event.eventDate} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Start Time:
                        <input type="time" name="startTime" value={event.startTime} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        End Time:
                        <input type="time" name="endTime" value={event.endTime} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Location:
                        <input type="text" name="location" value={event.location} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Admin Approval:
                        <input
                            type="checkbox"
                            name="adminApproval"
                            checked={event.adminApproval}
                            onChange={e => setEvent(prevEvent => ({ ...prevEvent, adminApproval: e.target.checked }))}
                        />
                    </label>
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => {
            window.location.href = "/dashboard";  
            //this.props.backToHome()
            }}> Back </button>
            </form>
        </div>
    );
};
