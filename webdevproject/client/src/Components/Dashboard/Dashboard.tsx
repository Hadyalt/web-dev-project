import React from "react";
import { Event } from "./dashboard.state";
import { loadEvent } from "./dashboard.api.ts";

interface DashboardState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

export class DashboardForm extends React.Component<{}, DashboardState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      events: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    // Load events when the component mounts
    loadEvent()
      .then((events) => {
        this.setState({ events, loading: false });
      })
      .catch((error) => {
        this.setState({ error: error.message, loading: false });
      });
  }

  render() {
    const { events, loading, error } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div>
        <h1>Events</h1>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Location</th>
              <th>Admin Approval</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={`${event.eventId}-${index}`}>
                <td>{event.title}</td>
                <td>{event.description}</td>
                <td>{event.eventDate.toString()}</td>
                <td>{event.startTime.toString()}</td>
                <td>{event.endTime.toString()}</td>
                <td>{event.location}</td>
                <td>{event.adminApproval ? "Approved" : "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}