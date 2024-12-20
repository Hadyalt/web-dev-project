import React, { useState, useEffect } from 'react';
import { updateEvent, getEventById } from './dashboardPatch.api.ts';
import { DateOnly } from '../../Models/Date.tsx';

interface DashboardPatchProps {
    backToHome: () => void;
    eventId: number;
}

export const DashboardPatch: React.FC<DashboardPatchProps> = ({ backToHome, eventId }) => {
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
        // Fetch event details by ID
        getEventById(eventId).then(setEvent);
    }, [eventId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEvent(prevEvent => ({ ...prevEvent, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Call the API to post the event
        const formattedDate = DateOnly.parse(event.eventDate).toString();
        await updateEvent(eventId, event.title, event.description, formattedDate, event.startTime,
          event.endTime, event.location, event.adminApproval, [], "")
          .then(() => {
            // Redirect to the dashboard
            backToHome();
          })
          .catch(() => {
            // Handle the error
          });
        backToHome();
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
                        <input type="checkbox" name="adminApproval" checked={event.adminApproval} onChange={e => setEvent(prevEvent => ({ ...prevEvent, adminApproval: e.target.checked }))} />
                    </label>
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={backToHome}>Back</button>
            </form>
        </div>
    );
};