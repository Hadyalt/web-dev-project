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
        <ul>
          {events.map((event, index) => (
            <li key={`${event.eventId}-${index}`}>{event.title} {event.description}</li>
          ))}
        </ul>
      </div>
    );
  }
}