import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('/api/events')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the events!', error);
      });
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Event Title</th>
            <th>Description</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Location</th>
            <th>Admin Approval</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.EventId}>
              <td>{event.Title}</td>
              <td>{event.Description}</td>
              <td>{new Date(event.EventDate).toLocaleDateString()}</td>
              <td>{new Date(event.StartTime).toLocaleTimeString()}</td>
              <td>{new Date(event.EndTime).toLocaleTimeString()}</td>
              <td>{event.Location}</td>
              <td>{event.AdminApproval ? "Approved" : "Pending"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;